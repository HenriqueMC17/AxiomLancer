import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ==============================================================================
// SCHEMA DEFINITIVO DO AXIOM LANCER PARA O CONVEX
// Mapeamento integral das 22 tabelas e enums de domínio
// ==============================================================================

export default defineSchema({
  // 1. Inquilinos (Tenants / Freelancers)
  users: defineTable({
    id: v.optional(v.string()), // UUID universal
    email: v.string(),
    name: v.string(),
    billing_paused: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // 2. Configurações regionais do usuário
  user_config: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    timezone: v.optional(v.string()),
    default_currency: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 3. Integrações externas (Stripe, Asaas, Twilio)
  integration: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    provider: v.string(),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("INACTIVE"),
      v.literal("ERROR"),
      v.literal("PENDING")
    ),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 4. Planos SaaS do AxiomLancer
  subscription_plan: defineTable({
    id: v.optional(v.string()),
    code: v.string(),
    name: v.string(),
    price: v.number(),
    billing_interval: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_code", ["code"]),

  // 5. Assinaturas ativas dos usuários
  user_subscription: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    plan_id: v.string(),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("CANCELED"),
      v.literal("PAST_DUE"),
      v.literal("TRIALING")
    ),
    started_at: v.optional(v.string()),
    current_period_end: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 6. Clientes dos Freelancers
  client: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    legal_name: v.string(),
    email: v.string(),
    tone_of_voice: v.optional(v.string()),
    billing_paused: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 7. Faturas emitidas
  invoice: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    client_id: v.string(),
    invoice_number: v.string(),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("OVERDUE"),
      v.literal("CANCELED")
    ),
    due_date: v.string(),
    gross_value: v.number(),
    tax_rate: v.number(),
    net_value: v.number(),
    billing_paused: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_client_id", ["client_id"])
    .index("by_user_and_number", ["user_id", "invoice_number"])
    .index("by_user_and_status", ["user_id", "status"]),

  // 8. Regras de automação (Motor de cobrança)
  billing_rule: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    name: v.string(),
    trigger_type: v.string(),
    offset_days: v.number(),
    channel: v.union(v.literal("EMAIL"), v.literal("SMS"), v.literal("WHATSAPP")),
    tone_of_voice: v.optional(v.string()),
    active: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 9. Modelos de mensagens
  message_template: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    tone_of_voice: v.string(),
    channel: v.union(v.literal("EMAIL"), v.literal("SMS"), v.literal("WHATSAPP")),
    subject: v.optional(v.string()),
    body: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 10. Despesas operacionais
  expense: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    description: v.string(),
    category: v.string(),
    amount: v.number(),
    due_date: v.optional(v.string()),
    paid_at: v.optional(v.string()),
    status: v.union(v.literal("PENDING"), v.literal("PAID"), v.literal("CANCELED")),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 11. Livro Razão Central (Ledger)
  ledger_transaction: defineTable({
    id: v.optional(v.string()),
    occurred_at: v.string(),
    user_id: v.string(),
    invoice_id: v.optional(v.string()),
    expense_id: v.optional(v.string()),
    integration_id: v.optional(v.string()),
    type: v.union(
      v.literal("INCOME"),
      v.literal("EXPENSE"),
      v.literal("FEE"),
      v.literal("REFUND")
    ),
    amount: v.number(),
    external_id: v.optional(v.string()),
    reconciled_at: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_user_and_occurred", ["user_id", "occurred_at"]),

  // 12. Cobranças SaaS
  saas_billing: defineTable({
    id: v.optional(v.string()),
    subscription_id: v.string(),
    amount: v.number(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("CANCELED")
    ),
    due_at: v.string(),
    paid_at: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_subscription_id", ["subscription_id"]),

  // 13. Histórico de disparos de réguas
  billing_execution: defineTable({
    id: v.optional(v.string()),
    invoice_id: v.string(),
    rule_id: v.string(),
    template_id: v.string(),
    channel: v.union(v.literal("EMAIL"), v.literal("SMS"), v.literal("WHATSAPP")),
    status: v.union(v.literal("PENDING"), v.literal("SUCCESS"), v.literal("FAILED")),
    attempted_at: v.optional(v.string()),
    sent_at: v.optional(v.string()),
    error_message: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_invoice_id", ["invoice_id"]),

  // 14. Comissões de recuperação
  recovery_take_rate: defineTable({
    id: v.optional(v.string()),
    invoice_id: v.string(),
    recovered_amount: v.number(),
    rate_percent: v.number(),
    commission_amount: v.number(),
    recovered_at: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  }).index("by_invoice_id", ["invoice_id"]),

  // 15. Diário de Idempotência
  deduplication_journal: defineTable({
    event_id: v.string(),
    invoice_id: v.string(),
    trigger_day: v.string(),
    rule_id: v.optional(v.string()),
    execution_id: v.optional(v.string()),
    processed_at: v.optional(v.string()),
  })
    .index("by_event_id", ["event_id"])
    .index("by_invoice_and_day", ["invoice_id", "trigger_day"]),

  // 16. Transactional Outbox
  outbox_events: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    aggregate_type: v.string(),
    aggregate_id: v.string(),
    event_type: v.string(),
    payload: v.any(),
    processed_at: v.optional(v.string()),
    created_at: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_unprocessed", ["processed_at"]),

  // 17. Perfil e Score do Freelancer
  freelancer_portfolio: defineTable({
    user_id: v.string(),
    photo_url: v.optional(v.string()),
    phone: v.optional(v.string()),
    website_url: v.optional(v.string()),
    overall_score: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_user_id", ["user_id"]),

  // 18. Contratos comerciais/jurídicos
  contract: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    client_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    contract_value: v.number(),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("COMPLETED"),
      v.literal("CANCELED"),
      v.literal("PENDING_SIGNATURE")
    ),
    start_date: v.string(),
    end_date: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_client_id", ["client_id"]),

  // 19. Portfólio de Projetos
  project: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    client_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    start_date: v.string(),
    end_date: v.optional(v.string()),
    is_public_client_name: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    deleted_at: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_client_id", ["client_id"]),

  // 20. Avaliação por Projeto
  project_feedback: defineTable({
    id: v.optional(v.string()),
    project_id: v.string(),
    score: v.number(),
    comments: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_project_id", ["project_id"]),

  // 21. Avaliação de Ciclo
  cycle_evaluation: defineTable({
    id: v.optional(v.string()),
    user_id: v.string(),
    client_id: v.string(),
    cycle_identifier: v.string(),
    score_communication: v.number(),
    score_proactivity: v.number(),
    score_results: v.number(),
    score_understanding: v.number(),
    general_score: v.number(),
    comments: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_identifier", ["cycle_identifier"]),

  // 22. Vínculo Avaliação e Contratos
  cycle_evaluation_contract: defineTable({
    cycle_evaluation_id: v.string(),
    contract_id: v.string(),
    created_at: v.optional(v.string()),
  })
    .index("by_cycle_evaluation_id", ["cycle_evaluation_id"])
    .index("by_contract_id", ["contract_id"]),
});
