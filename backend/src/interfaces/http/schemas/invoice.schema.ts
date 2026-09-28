import { z } from 'zod';

export const createInvoiceItemSchema = z.object({
  description: z.string().min(2, 'Descrição do item deve ter no mínimo 2 caracteres.'),
  quantity: z.number().int().positive('Quantidade deve ser um número inteiro positivo.'),
  unitPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Preço unitário deve ser decimal válido (ex: "150.00").'),
});

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

export const settleInvoiceSchema = z.object({
  paidAt: z.string().datetime().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type SettleInvoiceInput = z.infer<typeof settleInvoiceSchema>;
