import { z } from 'zod';

export const processBillingTriggerSchema = z.object({
  invoiceId: z.string().uuid('ID da fatura deve ser um UUID v4 válido.'),
  triggerDay: z.number().int('triggerDay deve ser um inteiro (ex: -3, 0, 5).'),
  channel: z.enum(['WHATSAPP', 'EMAIL', 'PIX_DYNAMIC'], {
    errorMap: () => ({ message: 'Canal deve ser WHATSAPP, EMAIL ou PIX_DYNAMIC.' }),
  }),
  correlationId: z.string().uuid().optional(),
  lockTtlSeconds: z.number().int().positive().optional().default(300),
});

export type ProcessBillingTriggerInput = z.infer<typeof processBillingTriggerSchema>;
