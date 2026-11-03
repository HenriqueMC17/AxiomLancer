import {
  BillingRule,
  BillingExecution,
  Client,
  DeduplicationJournal,
  Invoice,
  ToneOfVoice,
  User,
} from "../domain/types";
import { MonetaryService } from "./monetary.service";

export interface ExecutionCandidate {
  invoice: Invoice;
  client: Client;
  rule: BillingRule;
  targetDate: string; // YYYY-MM-DD
}

export interface EngineResult {
  executionId: string;
  invoiceId: string;
  ruleName: string;
  channel: string;
  recipientEmail: string;
  subject: string;
  renderedBody: string;
  status: "SUCCESS" | "SKIPPED_DEDUPLICATED" | "ABORTED_PANIC_BUTTON" | "FAILED";
  reason?: string;
  latencyMs: number;
}

export class RulesEngineService {
  /**
   * Gera o ID idempotente determinístico para o DeduplicationJournal
   */
  public static generateEventId(invoiceId: string, triggerDay: string, ruleId: string): string {
    return `dedup_${invoiceId}_${triggerDay}_${ruleId}`;
  }

  /**
   * Avalia se uma fatura deve disparar uma regra no dia atual (ex: D-3, D-0, D+3, D+7)
   */
  public static calculateOffsetDays(dueDateStr: string, currentDateStr: string): number {
    const due = new Date(dueDateStr);
    const curr = new Date(currentDateStr);
    // Zera horas para comparação puramente diária
    due.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);

    const diffTime = curr.getTime() - due.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Renderiza a mensagem baseada no Tom de Voz e dados da fatura
   */
  public static renderMessage(
    invoice: Invoice,
    client: Client,
    rule: BillingRule,
    pixKey: string = "pix@axiomlancer.com.br"
  ): { subject: string; body: string } {
    const formattedAmount = MonetaryService.formatBRL(invoice.gross_value);
    const dueDateFormatted = new Date(invoice.due_date).toLocaleDateString("pt-BR");

    let subject = "";
    let body = "";

    const tone: ToneOfVoice = client.tone_of_voice || rule.tone_of_voice || "AMIGAVEL";

    switch (rule.trigger_type) {
      case "PRE_DUE":
        if (tone === "AMIGAVEL") {
          subject = `Lembrete amigável: Fatura #${invoice.invoice_number} vence em breve`;
          body = `Olá, ${client.legal_name}! Esperamos que esteja tudo bem. Passando para avisar que a fatura #${invoice.invoice_number} no valor de ${formattedAmount} vencerá em ${dueDateFormatted}. Você pode pagar via PIX chave: ${pixKey}. Agradecemos pela parceria!`;
        } else if (tone === "FIRME") {
          subject = `Aviso de Vencimento: Fatura #${invoice.invoice_number}`;
          body = `Prezado(a) ${client.legal_name}, informamos que a fatura #${invoice.invoice_number} (${formattedAmount}) vence em ${dueDateFormatted}. Chave PIX: ${pixKey}. Por favor programe o pagamento para evitar encargos.`;
        } else {
          subject = `Notificação Financeira: Fatura #${invoice.invoice_number}`;
          body = `À atenção do Departamento Financeiro de ${client.legal_name}. Segue lembrete de vencimento programado para ${dueDateFormatted} referente à fatura #${invoice.invoice_number} no montante de ${formattedAmount}. PIX: ${pixKey}.`;
        }
        break;

      case "ON_DUE":
        subject = `Hoje é o vencimento da Fatura #${invoice.invoice_number} - ${formattedAmount}`;
        body = `Olá, ${client.legal_name}. Lembramos que hoje é a data de vencimento da fatura #${invoice.invoice_number}. Chave PIX para liquidação imediata: ${pixKey}. Qualquer dúvida estamos à disposição.`;
        break;

      case "POST_DUE_SHORT":
        subject = `[Atenção] Fatura #${invoice.invoice_number} em atraso - Regularização PIX`;
        body = `Olá, ${client.legal_name}. Constatamos que a fatura #${invoice.invoice_number} (${formattedAmount}) com vencimento em ${dueDateFormatted} ainda não teve confirmação de pagamento. Solicitamos a quitação via PIX (${pixKey}) para evitar interrupções nos serviços.`;
        break;

      case "POST_DUE_LONG":
        subject = `[URGENTE] Aviso de Cobrança e Suspensão de Serviços - Fatura #${invoice.invoice_number}`;
        body = `Prezado(a) ${client.legal_name}, notificamos que a fatura #${invoice.invoice_number} encontra-se com atraso superior a 7 dias. O não pagamento até o encerramento do dia útil acarretará a suspensão das entregas e aplicação de encargos legais. Chave PIX: ${pixKey}.`;
        break;
    }

    return { subject, body };
  }

  /**
   * Executa a avaliação da esteira de cobrança com verificação estrita de Botão de Pânico e Deduplicação
   */
  public static executeCandidate(
    candidate: ExecutionCandidate,
    user: User,
    existingJournal: DeduplicationJournal[],
    mockLatencyMs: number = 12
  ): EngineResult {
    const startTime = performance.now();
    const { invoice, client, rule, targetDate } = candidate;

    // 1. CHECAGEM DO BOTÃO DE PÂNICO (SAFE MODE) - < 12ms abort
    if (user.billing_paused || client.billing_paused || invoice.billing_paused) {
      const latency = Math.round(performance.now() - startTime) || mockLatencyMs;
      return {
        executionId: `exec_panic_${Date.now()}`,
        invoiceId: invoice.id,
        ruleName: rule.name,
        channel: rule.channel,
        recipientEmail: client.email,
        subject: "",
        renderedBody: "",
        status: "ABORTED_PANIC_BUTTON",
        reason: "Disparo cancelado instantaneamente: Safe Mode / Botão de Pânico ativado.",
        latencyMs: latency,
      };
    }

    // 2. CHECAGEM DE STATUS DA FATURA (Apenas PENDING ou OVERDUE devem receber cobrança)
    if (invoice.status === "PAID" || invoice.status === "CANCELED") {
      const latency = Math.round(performance.now() - startTime) || mockLatencyMs;
      return {
        executionId: `exec_skip_${Date.now()}`,
        invoiceId: invoice.id,
        ruleName: rule.name,
        channel: rule.channel,
        recipientEmail: client.email,
        subject: "",
        renderedBody: "",
        status: "SKIPPED_DEDUPLICATED",
        reason: `Fatura já está ${invoice.status}. Cobrança não é necessária.`,
        latencyMs: latency,
      };
    }

    // 3. CHECAGEM DE IDEMPOTÊNCIA VIA DEDUPLICATION JOURNAL
    const eventId = this.generateEventId(invoice.id, targetDate, rule.id);
    const alreadyProcessed = existingJournal.some((entry) => entry.event_id === eventId);

    if (alreadyProcessed) {
      const latency = Math.round(performance.now() - startTime) || mockLatencyMs;
      return {
        executionId: `exec_dedup_${Date.now()}`,
        invoiceId: invoice.id,
        ruleName: rule.name,
        channel: rule.channel,
        recipientEmail: client.email,
        subject: "",
        renderedBody: "",
        status: "SKIPPED_DEDUPLICATED",
        reason: `DeduplicationJournal: Evento ${eventId} já executado hoje para esta fatura. Evitando envio duplicado.`,
        latencyMs: latency,
      };
    }

    // 4. DISPARO BEM-SUCEDIDO
    const { subject, body } = this.renderMessage(invoice, client, rule, invoice.pix_key);
    const latency = Math.round(performance.now() - startTime) || mockLatencyMs;

    return {
      executionId: `exec_${Date.now()}`,
      invoiceId: invoice.id,
      ruleName: rule.name,
      channel: rule.channel,
      recipientEmail: client.email,
      subject,
      renderedBody: body,
      status: "SUCCESS",
      latencyMs: latency,
    };
  }
}
