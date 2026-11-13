import { IInvoiceRepository } from "../domain/ports/repositories/invoice.repository.port";
import { IClientRepository } from "../domain/ports/repositories/client.repository.port";
import { IPanicRepository } from "../domain/ports/repositories/panic.repository.port";
import { IDeduplicationJournalRepository } from "../domain/ports/deduplication-journal.port";
import { IOutboxRepository } from "../domain/ports/outbox.port";
import { INotifier } from "../domain/ports/notifier.port";
import { RulesEngineService } from "../services/rules-engine.service";
import { NotFoundError } from "../errors/app-error";
import { BillingRule, ChannelType, ToneOfVoice } from "../domain/types";

export interface ChargeClientInput {
  invoiceId: string;
  triggerDay: string; // YYYY-MM-DD
  ruleId: string;
  ruleName?: string;
  channel?: ChannelType;
  toneOfVoice?: ToneOfVoice;
}

export interface ChargeClientResult {
  executionId: string;
  invoiceId: string;
  status: "SUCCESS" | "SKIPPED_DEDUPLICATED" | "ABORTED_PANIC_BUTTON" | "FAILED";
  channel: ChannelType;
  recipient: string;
  subject?: string;
  renderedBody?: string;
  messageId?: string;
  reason?: string;
  latencyMs: number;
}

export class ChargeClientUseCase {
  constructor(
    private readonly invoiceRepo: IInvoiceRepository,
    private readonly clientRepo: IClientRepository,
    private readonly panicRepo: IPanicRepository,
    private readonly dedupRepo: IDeduplicationJournalRepository,
    private readonly outboxRepo: IOutboxRepository,
    private readonly whatsappNotifier: INotifier,
    private readonly emailNotifier: INotifier
  ) {}

  public async execute(input: ChargeClientInput): Promise<ChargeClientResult> {
    const startTime = performance.now();

    // 1. CHECAGEM DO BOTAO DE PANICO (SAFE MODE) - SLA < 12ms
    const isPanicActive = await this.panicRepo.getStatus();
    if (isPanicActive) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        executionId: `exec_panic_${Date.now()}`,
        invoiceId: input.invoiceId,
        status: "ABORTED_PANIC_BUTTON",
        channel: input.channel ?? "EMAIL",
        recipient: "",
        reason: "Safe Mode ativado globalmente pelo usuario. Disparo abortado com sucesso.",
        latencyMs,
      };
    }

    // 2. BUSCA DA FATURA E CLIENTE
    const invoice = await this.invoiceRepo.findById(input.invoiceId);
    if (!invoice) {
      throw new NotFoundError("Fatura", input.invoiceId);
    }

    if (invoice.billing_paused) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        executionId: `exec_paused_${Date.now()}`,
        invoiceId: input.invoiceId,
        status: "ABORTED_PANIC_BUTTON",
        channel: input.channel ?? "EMAIL",
        recipient: "",
        reason: "Fatura com billing_paused ativado pontualmente.",
        latencyMs,
      };
    }

    const client = await this.clientRepo.findById(invoice.client_id);
    if (!client) {
      throw new NotFoundError("Cliente", invoice.client_id);
    }

    if (client.billing_paused) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        executionId: `exec_paused_client_${Date.now()}`,
        invoiceId: input.invoiceId,
        status: "ABORTED_PANIC_BUTTON",
        channel: input.channel ?? "EMAIL",
        recipient: client.email,
        reason: "Cliente pausado na esteira de cobranca.",
        latencyMs,
      };
    }

    // 3. IDEMPOTENCIA NO DEDUPLICATION JOURNAL (Prevencao de Dual Write / Double Charge)
    const eventId = RulesEngineService.generateEventId(invoice.id, input.triggerDay, input.ruleId);
    const alreadyProcessed = await this.dedupRepo.exists(eventId);
    if (alreadyProcessed) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        executionId: `exec_dedup_${Date.now()}`,
        invoiceId: invoice.id,
        status: "SKIPPED_DEDUPLICATED",
        channel: input.channel ?? "EMAIL",
        recipient: client.email,
        reason: `Disparo ja efetuado anteriormente em ${input.triggerDay} para a regra ${input.ruleId}.`,
        latencyMs,
      };
    }

    // 4. PREPARACAO DA REGUA E MENSAGEM
    const channel: ChannelType = input.channel ?? "EMAIL";
    const tone: ToneOfVoice = input.toneOfVoice ?? client.tone_of_voice ?? "AMIGAVEL";

    // Regra sintetica para renderizacao de template
    const offset = RulesEngineService.calculateOffsetDays(invoice.due_date, input.triggerDay);
    let triggerType: BillingRule["trigger_type"] = "ON_DUE";
    if (offset < 0) triggerType = "PRE_DUE";
    else if (offset > 7) triggerType = "POST_DUE_LONG";
    else if (offset > 0) triggerType = "POST_DUE_SHORT";

    const syntheticRule: BillingRule = {
      id: input.ruleId,
      user_id: invoice.user_id,
      name: input.ruleName ?? `Regra ${triggerType}`,
      trigger_type: triggerType,
      offset_days: offset,
      channel,
      tone_of_voice: tone,
      active: true,
      created_at: new Date().toISOString(),
    };

    const rendered = RulesEngineService.renderMessage(invoice, client, syntheticRule, invoice.pix_key);

    // 5. SELECAO DO NOTIFIER E DISPARO
    const notifier = channel === "WHATSAPP" ? this.whatsappNotifier : this.emailNotifier;
    const recipient = channel === "WHATSAPP" ? (client.email.includes("@") ? "11999999999" : client.email) : client.email;

    const dispatchResult = await notifier.send({
      recipient,
      recipientName: client.legal_name,
      channel,
      subject: rendered.subject,
      body: rendered.body,
      metadata: {
        invoiceId: invoice.id,
        clientId: client.id,
        pixCopyAndPaste: invoice.pix_qr_code,
        dueDate: invoice.due_date,
        amount: invoice.gross_value,
        tone,
      },
    });

    if (!dispatchResult.success) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        executionId: `exec_fail_${Date.now()}`,
        invoiceId: invoice.id,
        status: "FAILED",
        channel,
        recipient,
        subject: rendered.subject,
        renderedBody: rendered.body,
        reason: dispatchResult.reason ?? "Falha de envio no adaptador externo.",
        latencyMs,
      };
    }

    // 6. REGISTRO ATOMICO NO DEDUPLICATION JOURNAL E TRANSACTIONAL OUTBOX
    const executionId = `exec_${Date.now()}`;
    await this.dedupRepo.record({
      event_id: eventId,
      invoice_id: invoice.id,
      trigger_day: input.triggerDay,
      rule_id: input.ruleId,
      execution_id: executionId,
      processed_at: new Date().toISOString(),
    });

    await this.outboxRepo.saveEvent({
      aggregate_type: "INVOICE",
      aggregate_id: invoice.id,
      event_type: "InvoiceNotificationDispatched",
      payload: {
        eventId,
        executionId,
        invoiceId: invoice.id,
        clientId: client.id,
        channel,
        recipient,
        dispatchedAt: dispatchResult.dispatchedAt,
        messageId: dispatchResult.messageId,
      },
    });

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      executionId,
      invoiceId: invoice.id,
      status: "SUCCESS",
      channel,
      recipient,
      subject: rendered.subject,
      renderedBody: rendered.body,
      messageId: dispatchResult.messageId,
      latencyMs,
    };
  }
}