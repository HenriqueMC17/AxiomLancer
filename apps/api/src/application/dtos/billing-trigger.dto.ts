export interface ProcessBillingTriggerInputDTO {
  invoiceId: string;
  triggerDay: number; // Ex: -3 (3 dias antes do vencimento), 0 (no vencimento), 5 (atrasada)
  channel: 'WHATSAPP' | 'EMAIL' | 'PIX_DYNAMIC';
  correlationId?: string;
  lockTtlSeconds?: number;
}

export interface ProcessBillingTriggerOutputDTO {
  idempotencyKey: string;
  status: 'PROCESSED' | 'REPLAYED_FROM_CACHE' | 'SKIPPED_SAFE_MODE';
  invoiceId: string;
  channel: string;
  deliveredAt: string;
  recipientEmail: string;
  amountDue: string;
  message: string;
}
