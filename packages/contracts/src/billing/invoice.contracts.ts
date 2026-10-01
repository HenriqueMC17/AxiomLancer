import { z } from 'zod';

export const invoiceStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'ISSUED',
  'PAID',
  'OVERDUE',
  'CANCELED',
]);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const createInvoiceItemSchema = z.object({
  description: z.string().min(2, 'Descrição do item deve ter no mínimo 2 caracteres.'),
  quantity: z.number().int().positive('Quantidade deve ser um número inteiro positivo.'),
  unitPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Preço unitário deve ser decimal válido (ex: "150.00").'),
});
export type CreateInvoiceItemInput = z.infer<typeof createInvoiceItemSchema>;

export const createInvoiceSchema = z.object({
  userId: z.string().uuid('ID do usuário deve ser um UUID v4 válido.'),
  clientName: z.string().min(2, 'Nome do cliente é obrigatório.'),
  clientEmail: z.string().email('E-mail do cliente inválido.'),
  clientTaxId: z
    .string()
    .min(11, 'Documento fiscal do cliente deve ter ao menos 11 dígitos.')
    .max(18, 'Documento fiscal excede tamanho máximo.'),
  items: z.array(createInvoiceItemSchema).min(1, 'A fatura deve ter pelo menos um item.'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de vencimento deve seguir o formato YYYY-MM-DD.'),
  description: z.string().optional(),
  taxRatePercent: z.string().regex(/^\d+(\.\d{1,4})?$/).optional(),
  taxComponents: z
    .array(
      z.object({
        name: z.string().min(1),
        ratePercent: z.string().regex(/^\d+(\.\d{1,4})?$/),
      }),
    )
    .optional(),
  issueImmediately: z.boolean().optional().default(true),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const settleInvoiceSchema = z.object({
  paidAt: z.string().datetime().optional(),
});
export type SettleInvoiceInput = z.infer<typeof settleInvoiceSchema>;

export const calculateTaxesSchema = z.object({
  grossAmount: z
    .string({ required_error: 'Valor bruto é obrigatório.' })
    .regex(/^\d+(\.\d{1,2})?$/, 'Formato de valor bruto inválido. Use formato decimal com até 2 casas (ex: "15000.00").'),
  taxRatePercent: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/, 'Formato de alíquota inválido. Ex: "6.00" ou "13.45".')
    .optional(),
  taxComponents: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome do imposto é obrigatório.'),
        ratePercent: z.string().regex(/^\d+(\.\d{1,4})?$/, 'Alíquota componente inválida.'),
      }),
    )
    .optional(),
});
export type CalculateTaxesInput = z.infer<typeof calculateTaxesSchema>;

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

export interface InvoiceDTO {
  id: string;
  userId?: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string | null;
  clientTaxId: string;
  grossAmount: number;
  taxAmount: number;
  netAmount: number;
  taxRatePercent?: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt?: string | null;
  paidAt?: string | null;
  billingPaused?: boolean;
}
