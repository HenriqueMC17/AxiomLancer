export interface BillingJobPayload {
  invoiceId: string;
  triggerDay: number; // Ex: -3 (3 dias antes), 0 (no dia do vencimento), +5 (5 dias após)
  channel: 'WHATSAPP' | 'EMAIL' | 'PIX_DYNAMIC';
  correlationId: string;
}

export interface IQueueService {
  enqueueBillingReminder(payload: BillingJobPayload, delayMs?: number): Promise<string>;
}
