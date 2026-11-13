/**
 * Port (interface) para Servicos de Notificacao Multicanal (WhatsApp, Email, SMS).
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 * Implementado por adaptadores em infrastructure/whatsapp e infrastructure/email.
 */

export interface NotificationPayload {
  recipient: string; // Telefone E.164 (+55...) ou E-mail
  recipientName: string;
  channel: "WHATSAPP" | "EMAIL" | "SMS";
  subject?: string;
  body: string;
  metadata?: {
    invoiceId?: string;
    clientId?: string;
    pixCopyAndPaste?: string;
    dueDate?: string;
    amount?: number;
    tone?: "AMIGAVEL" | "FIRME" | "EXECUTIVO";
  };
}

export interface NotificationResult {
  success: boolean;
  messageId: string;
  channel: "WHATSAPP" | "EMAIL" | "SMS";
  dispatchedAt: string;
  status: "SENT" | "BLOCKED_PANIC_MODE" | "BLOCKED_QUIET_HOURS" | "FAILED";
  reason?: string;
}

export interface INotifier {
  /**
   * Envia uma notificacao multicanal de cobranca
   */
  send(payload: NotificationPayload): Promise<NotificationResult>;

  /**
   * Avalia se a janela de disparo e permitida (respeitando Quiet Hours: 08h-20h em dias uteis/sabados)
   */
  canDispatchNow(): boolean;
}