import { describe, it, expect, beforeEach } from "vitest";
import { CreateInvoiceUseCase } from "@/core/use-cases/create-invoice.use-case";
import { TogglePanicModeUseCase } from "@/core/use-cases/toggle-panic-mode.use-case";
import { InMemoryInvoiceRepository } from "@/infrastructure/repositories/in-memory/in-memory-invoice.repository";
import { InMemoryClientRepository } from "@/infrastructure/repositories/in-memory/in-memory-client.repository";
import { InMemoryPanicRepository } from "@/infrastructure/repositories/in-memory/in-memory-panic.repository";
import { ValidationError, NotFoundError } from "@/core/errors/app-error";

describe("Application Use Cases - Inversão de Dependência & Regras de Negócio", () => {
  let invoiceRepo: InMemoryInvoiceRepository;
  let clientRepo: InMemoryClientRepository;
  let panicRepo: InMemoryPanicRepository;
  let createInvoiceUseCase: CreateInvoiceUseCase;
  let togglePanicUseCase: TogglePanicModeUseCase;

  beforeEach(() => {
    invoiceRepo = new InMemoryInvoiceRepository();
    clientRepo = new InMemoryClientRepository();
    panicRepo = new InMemoryPanicRepository();
    createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepo, clientRepo);
    togglePanicUseCase = new TogglePanicModeUseCase(panicRepo);
  });

  it("deve criar uma fatura com provisão tributária e PIX dinâmico válidos", async () => {
    // Arrange: Certifica cliente existente
    const client = await clientRepo.create({
      id: "cli_test_01",
      user_id: "usr_01",
      legal_name: "Cliente Teste S.A.",
      email: "financeiro@clienteteste.com",
      tone_of_voice: "EXECUTIVO",
      billing_paused: false,
      payment_reliability_score: 90,
      avg_payment_delay_days: 0,
      created_at: new Date().toISOString(),
    });

    // Act
    const result = await createInvoiceUseCase.execute({
      userId: "usr_01",
      clientId: client.id,
      invoiceNumber: "FAT-TEST-001",
      dueDate: "2026-05-10",
      grossValue: 5000.0,
      annualRevenueRbt12: 180000.0,
      simplesNacionalType: "ANEXO_III",
    });

    // Assert
    expect(result.invoice.id).toBeDefined();
    expect(result.invoice.gross_value).toBe(5000.0);
    expect(result.invoice.tax_provisioned).toBe(300.0); // 6%
    expect(result.invoice.net_value).toBe(4700.0);
    expect(result.invoice.pix_qr_code).toContain("pix@7keys.dev");
  });

  it("deve falhar com ValidationError se o valor bruto for menor ou igual a zero", async () => {
    // Act & Assert
    await expect(
      createInvoiceUseCase.execute({
        userId: "usr_01",
        clientId: "cli_qualquer",
        invoiceNumber: "FAT-ERR-001",
        dueDate: "2026-05-10",
        grossValue: -100.0,
        annualRevenueRbt12: 180000.0,
        simplesNacionalType: "ANEXO_III",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("deve acionar o Safe Mode e registrar a latência atômica", async () => {
    // Act
    const result = await togglePanicUseCase.execute({
      billingPaused: true,
      reason: "Alinhamento verbal com o cliente",
    });

    // Assert
    expect(result.billing_paused).toBe(true);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.message).toContain("Safe Mode ativado");
  });
});
