import { z } from 'zod';

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
