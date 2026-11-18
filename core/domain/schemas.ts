import { z } from "zod";

export const createInvoiceSchema = z.object({
  client_id: z.string().min(1, "Cliente obrigatorio"),
  invoice_number: z.string().min(1, "Numero da fatura obrigatorio"),
  due_date: z.string().refine((d) => !isNaN(Date.parse(d)), "Data de vencimento invalida"),
  gross_value: z.number().positive("O valor bruto deve ser maior que zero"),
  tax_rate: z.number().min(0).max(100, "Aliquota deve estar entre 0 e 100%").default(6.0),
  description: z.string().optional(),
  // P1-2: RBT12 e tipo do Anexo parametrizados (nao mais hardcoded)
  annual_revenue_rbt12: z.number().nonnegative().default(180000),
  simples_nacional_type: z.enum(["ANEXO_III", "ANEXO_V"]).default("ANEXO_III"),
  // P1-1: Dados PIX opcionals (fallback para pix@7keys.dev se omitidos)
  pix_key: z.string().min(1).optional(),
  merchant_name: z.string().max(25).optional(),
  merchant_city: z.string().max(15).optional(),
});

export const togglePanicSchema = z.object({
  billing_paused: z.boolean(),
  reason: z.string().optional(),
});

export const pricingCalculationSchema = z.object({
  monthly_personal_expenses: z.number().nonnegative(),
  monthly_business_expenses: z.number().nonnegative(),
  desired_net_income: z.number().positive(),
  billable_hours_per_week: z.number().min(5).max(60).default(25),
  weeks_worked_per_year: z.number().min(30).max(52).default(48),
  simples_nacional_type: z.enum(["ANEXO_III", "ANEXO_V"]),
  annual_revenue_rbt12: z.number().nonnegative().default(180000),
  payroll_ratio_fator_r: z.number().min(0).max(100).default(28),
  gateway_type: z.enum(["PIX", "CREDIT_CARD", "BOLETO"]).default("PIX"),
});

export const recoverInvoiceSchema = z.object({
  invoice_id: z.string().min(1),
  take_rate_percent: z.number().min(1).max(25).optional().default(5.0),
  rate_percent: z.number().min(1).max(25).optional(),
}).transform((data) => ({
  invoice_id: data.invoice_id,
  take_rate_percent: data.rate_percent ?? data.take_rate_percent ?? 5.0,
}));

export const createMessageTemplateSchema = z.object({
  tone_of_voice: z.enum(["AMIGAVEL", "FIRME", "EXECUTIVO"], {
    errorMap: () => ({ message: "Tom de voz invalido. Use: AMIGAVEL, FIRME ou EXECUTIVO" }),
  }),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP"], {
    errorMap: () => ({ message: "Canal invalido. Use: EMAIL, SMS ou WHATSAPP" }),
  }),
  subject: z.string().min(3, "Assunto obrigatorio e deve ter ao menos 3 caracteres"),
  body: z.string().min(10, "Corpo da mensagem deve ter ao menos 10 caracteres"),
});

export const updateMessageTemplateSchema = createMessageTemplateSchema.partial();

export type CreateMessageTemplateInput = z.infer<typeof createMessageTemplateSchema>;
export type UpdateMessageTemplateInput = z.infer<typeof updateMessageTemplateSchema>;

export const createProjectSchema = z
  .object({
    client_id: z.string().min(1, "Cliente obrigatorio"),
    name: z.string().min(2, "Nome do projeto obrigatorio e deve ter ao menos 2 caracteres"),
    description: z.string().optional(),
    start_date: z.string().refine((d) => !isNaN(Date.parse(d)), "Data de inicio invalida"),
    end_date: z
      .string()
      .nullable()
      .optional()
      .refine((d) => {
        if (!d || d.trim() === "") return true;
        return !isNaN(Date.parse(d));
      }, "Data de termino invalida"),
    is_in_development: z.boolean().optional().default(false),
    is_public_client_name: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      // Se estiver em desenvolvimento ou sem data de termino, a validacao e satisfeita
      if (data.is_in_development || !data.end_date || data.end_date.trim() === "") {
        return true;
      }
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "A Data de Inicio nao pode ser maior que a Data de Termino",
      path: ["end_date"],
    }
  );

export const updateProjectSchema = z
  .object({
    client_id: z.string().min(1).optional(),
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    start_date: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), "Data de inicio invalida")
      .optional(),
    end_date: z
      .string()
      .nullable()
      .optional()
      .refine((d) => {
        if (!d || d.trim() === "") return true;
        return !isNaN(Date.parse(d));
      }, "Data de termino invalida"),
    is_in_development: z.boolean().optional(),
    is_public_client_name: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.is_in_development || !data.end_date || !data.start_date) {
        return true;
      }
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "A Data de Inicio nao pode ser maior que a Data de Termino",
      path: ["end_date"],
    }
  );

export type CreateProjectInput = z.input<typeof createProjectSchema>;
export type UpdateProjectInput = z.input<typeof updateProjectSchema>;

export const createContractSchema = z
  .object({
    client_id: z.string().min(1, "Cliente obrigatorio"),
    title: z.string().min(3, "Titulo do contrato deve ter ao menos 3 caracteres"),
    description: z.string().optional(),
    contract_value: z.number().positive("O valor do contrato deve ser estritamente maior que zero"),
    start_date: z.string().refine((d) => !isNaN(Date.parse(d)), "Data de inicio invalida"),
    end_date: z
      .string()
      .nullable()
      .optional()
      .refine((d) => {
        if (!d || d.trim() === "") return true;
        return !isNaN(Date.parse(d));
      }, "Data de termino invalida"),
    terms_clause: z.string().min(10, "Os termos e clausulas do contrato devem ter ao menos 10 caracteres"),
  })
  .refine(
    (data) => {
      if (!data.end_date || data.end_date.trim() === "") return true;
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "A Data de Inicio nao pode ser maior que a Data de Termino do contrato",
      path: ["end_date"],
    }
  );

export const updateContractSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    contract_value: z.number().positive().optional(),
    start_date: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), "Data de inicio invalida")
      .optional(),
    end_date: z
      .string()
      .nullable()
      .optional()
      .refine((d) => {
        if (!d || d.trim() === "") return true;
        return !isNaN(Date.parse(d));
      }, "Data de termino invalida"),
    terms_clause: z.string().min(10).optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "CANCELED", "PENDING_SIGNATURE"]).optional(),
  })
  .refine(
    (data) => {
      if (!data.end_date || !data.start_date) return true;
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "A Data de Inicio nao pode ser maior que a Data de Termino do contrato",
      path: ["end_date"],
    }
  );

export const acceptContractSchema = z.object({
  signer_name: z.string().min(2, "Nome completo do signatario obrigatorio"),
  signer_email: z.string().email("E-mail corporativo do signatario invalido"),
  confirm_terms: z.literal(true, {
    errorMap: () => ({ message: "Voce deve concordar expressamente com os termos do contrato" }),
  }),
});

export type CreateContractInput = z.input<typeof createContractSchema>;
export type UpdateContractInput = z.input<typeof updateContractSchema>;
export type AcceptContractInput = z.infer<typeof acceptContractSchema>;
// ─── Schemas de Avaliacao de Ciclo Recorrente ────────────────────────────────

/**
 * Validacao de submissao de feedback de ciclo pelo cliente (Fail Fast estrito).
 * Exige nota entre 1.00 e 5.00 em cada dimensao qualitativa e parecer textual minimo.
 */
export const submitCycleFeedbackSchema = z.object({
  invitation_token: z.string().min(10, "Token de convite invalido ou ausente"),
  score_communication: z.number()
    .min(1.0, "Nota minima de Comunicacao e 1.0")
    .max(5.0, "Nota maxima de Comunicacao e 5.0"),
  score_proactivity: z.number()
    .min(1.0, "Nota minima de Proatividade e 1.0")
    .max(5.0, "Nota maxima de Proatividade e 5.0"),
  score_results: z.number()
    .min(1.0, "Nota minima de Apresentacao de Resultados e 1.0")
    .max(5.0, "Nota maxima de Apresentacao de Resultados e 5.0"),
  score_understanding: z.number()
    .min(1.0, "Nota minima de Entendimento da Dor e 1.0")
    .max(5.0, "Nota maxima de Entendimento da Dor e 5.0"),
  score_demand_delivery: z.number()
    .min(1.0, "Nota minima de Atendimento a Demanda e 1.0")
    .max(5.0, "Nota maxima de Atendimento a Demanda e 5.0"),
  comments: z.string()
    .min(15, "O parecer qualitativo deve ter ao menos 15 caracteres")
    .max(2000, "Comentario muito extenso (maximo 2000 caracteres)"),
});

/**
 * Validacao do disparo manual/automatico de avaliacao de ciclo.
 */
export const triggerCycleEvaluationSchema = z.object({
  client_id: z.string().min(1, "Identificador do cliente e obrigatorio"),
  trigger_type: z.enum(["MILESTONE_10_PROJECTS", "MONTHLY_30_DAYS", "MANUAL"], {
    errorMap: () => ({ message: "Tipo de gatilho invalido" }),
  }),
});

export type SubmitCycleFeedbackInput = z.infer<typeof submitCycleFeedbackSchema>;
export type TriggerCycleEvaluationInput = z.infer<typeof triggerCycleEvaluationSchema>;
/**
 * Schema de Cadastro e Atualizacao de Clientes Corporativos (Gatekeeper Zod).
 */
export const createClientSchema = z.object({
  legal_name: z.string().min(2, "Razao Social / Nome obrigatorio com ao menos 2 caracteres"),
  email: z.string().email("E-mail corporativo invalido"),
  tone_of_voice: z.enum(["AMIGAVEL", "FIRME", "EXECUTIVO"], {
    errorMap: () => ({ message: "Tom de voz invalido. Opcoes: AMIGAVEL, FIRME, EXECUTIVO" }),
  }),
  billing_paused: z.boolean().optional().default(false),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

/**
 * Schema de Registro e Gestao de Despesas Profissionais e OPEX.
 */
export const createExpenseSchema = z.object({
  description: z.string().min(2, "Descricao da despesa obrigatoria"),
  category: z.enum(["INFRA", "SAAS", "CONTABILIDADE", "EQUIPAMENTO", "IMPOSTOS", "OUTROS"], {
    errorMap: () => ({ message: "Categoria de despesa invalida" }),
  }),
  amount: z.number().positive("O valor da despesa deve ser estritamente positivo"),
  due_date: z.string().refine((d) => !isNaN(Date.parse(d)), "Data de vencimento invalida"),
  is_fixed: z.boolean().optional().default(false),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
