import { describe, it, expect, beforeEach } from "vitest";
import { ChargeClientUseCase } from "@/core/use-cases/charge-client.use-case";
import { InMemoryInvoiceRepository } from "@/infrastructure/repositories/in-memory/in-memory-invoice.repository";
import { InMemoryClientRepository } from "@/infrastructure/repositories/in-memory/in-memory-client.repository";
import { InMemoryPanicRepository } from "@/infrastructure/repositories/in-memory/in-memory-panic.repository";
import { TransactionalOutboxAdapter } from "@/infrastructure/resilience/transactional-outbox.adapter";
import { WhatsAppNotifierAdapter } from "@/infrastructure/whatsapp/whatsapp-notifier.adapter";
import { EmailNotifierAdapter } from "@/infrastructure/email/email-notifier.adapter";

describe("ChargeClientUseCase - Motor Autônomo com Isolamento Hexagonal", () => {
  let invoiceRepo: InMemoryInvoiceRepository;
  let clientRepo: InMemoryClientRepository;
  let panicRepo: InMemoryPanicRepository;
  let outboxAdapter: TransactionalOutboxAdapter;
  let whatsappNotifier: WhatsAppNotifierAdapter;
  let emailNotifier: EmailNotifierAdapter;
  let useCase: ChargeClientUseCase;

  beforeEach(async () => {
    invoiceRepo = new InMemoryInvoiceRepository();
    clientRepo = new InMemoryClientRepository();
    panicRepo = new InMemoryPanicRepository();
    outboxAdapter = new TransactionalOutboxAdapter();

    // forceAllowQuietHours: true para testes unitarios deterministas
    whatsappNotifier = new WhatsAppNotifierAdapter(panicRepo, true);
    emailNotifier = new EmailNotifierAdapter(panicRepo);

    useCase = new ChargeClientUseCase(
      invoiceRepo,
      clientRepo,
      panicRepo,
      outboxAdapter,
      outboxAdapter,
      whatsappNotifier,
      emailNotifier
    );

    // Setup base
    await clientRepo.create({
      id: "cli_acme_01",
      user_id: "usr_01",
      legal_name: "Acme Dev Corp",
      email: "financeiro@acmedev.com",
      tone_of_voice: "AMIGAVEL",
      billing_paused: false,
      payment_reliability_score: 95,
      avg_payment_delay_days: 0,
      created_at: new Date().toISOString(),
    });

    await invoiceRepo.create({
      id: "inv_101",
      user_id: "usr_01",
      client_id: "cli_acme_01",
      invoice_number: "FAT-101",
      status: "PENDING",
      due_date: "2026-11-20T00:00:00Z",
      gross_value: 3000.0,
      tax_rate: 6.0,
      net_value: 2820.0,
      tax_provisioned: 180.0,
      billing_paused: false,
      pix_key: "pix@7keys.dev",
      pix_qr_code: "00020126...6304ABCD",
      recovered_by_engine: false,
      created_at: new Date().toISOString(),
    });
  });

  it("deve executar o disparo com sucesso e registrar no DeduplicationJournal e Outbox", async () => {
    const result = await useCase.execute({
      invoiceId: "inv_101",
      triggerDay: "2026-11-17",
      ruleId: "rule_d_minus_3",
      channel: "EMAIL",
    });

    expect(result.status).toBe("SUCCESS");
    expect(result.channel).toBe("EMAIL");
    expect(result.recipient).toBe("financeiro@acmedev.com");
    expect(result.messageId).toBeDefined();

    // Verifica que o DeduplicationJournal foi populado
    const isRecorded = await outboxAdapter.exists("dedup_inv_101_2026-11-17_rule_d_minus_3");
    expect(isRecorded).toBe(true);

    // Verifica emissao do Transactional Outbox
    const events = await outboxAdapter.fetchPending();
    expect(events.length).toBe(1);
    expect(events[0].event_type).toBe("InvoiceNotificationDispatched");
  });

  it("deve evitar disparo duplo (idempotencia) se o evento ja existir no Journal", async () => {
    // 1º Disparo
    await useCase.execute({
      invoiceId: "inv_101",
      triggerDay: "2026-11-17",
      ruleId: "rule_d_minus_3",
      channel: "EMAIL",
    });

    // 2º Disparo imediato com mesmos parametros
    const secondResult = await useCase.execute({
      invoiceId: "inv_101",
      triggerDay: "2026-11-17",
      ruleId: "rule_d_minus_3",
      channel: "EMAIL",
    });

    expect(secondResult.status).toBe("SKIPPED_DEDUPLICATED");
    expect(secondResult.reason).toContain("Disparo ja efetuado anteriormente");
  });

  it("deve abortar em < 12ms se o Botao de Panico estiver ativo", async () => {
    await panicRepo.setPanicState(true);

    const result = await useCase.execute({
      invoiceId: "inv_101",
      triggerDay: "2026-11-17",
      ruleId: "rule_d_minus_3",
      channel: "EMAIL",
    });

    expect(result.status).toBe("ABORTED_PANIC_BUTTON");
    expect(result.latencyMs).toBeLessThan(12);
  });
});