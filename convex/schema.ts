import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * AxiomLancer Convex Schema
 * Fielmente derivado de AxiomLancer.sql e core/domain/types.ts
 * Arquitetura reativa de alta performance desenvolvida pelo time 7Keys
 */

export default defineSchema({
  // Usuarios / Tenants do SaaS
  users: defineTable({
    email: v.string(),
    name: v.string(),
    billing_paused: v.boolean(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Perfil corporativo do freelancer/agencia
  user_profiles: defineTable({
    user_id: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    social_name: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    address_type: v.optional(v.string()),
    tax_id: v.optional(v.string()),
    cep: v.optional(v.string()),
    street: v.optional(v.string()),
    number: v.optional(v.string()),
    complement: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    github_url: v.optional(v.string()),
    linkedin_url: v.optional(v.string()),
    portfolio_url: v.optional(v.string()),
    overall_score: v.optional(v.float64()),
  }).index("by_user", ["user_id"]),

  // Clientes dos freelancers
  clients: defineTable({
    user_id: v.string(),
    legal_name: v.string(),
    email: v.string(),
    tone_of_voice: v.union(
      v.literal("AMIGAVEL"),
      v.literal("FIRME"),
      v.literal("EXECUTIVO")
    ),
    billing_paused: v.boolean(),
    payment_reliability_score: v.float64(),
    avg_payment_delay_days: v.float64(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_user", ["user_id"]),

  // Faturas e faturamentos com Split Tributario
  invoices: defineTable({
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
    gross_value: v.float64(),
    tax_rate: v.float64(),
    net_value: v.float64(),
    tax_provisioned: v.float64(),
    billing_paused: v.boolean(),
    pix_key: v.optional(v.string()),
    pix_qr_code: v.optional(v.string()),
    recovered_by_engine: v.optional(v.boolean()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_client", ["client_id"])
    .index("by_status", ["status"])
    .index("by_due_date", ["due_date"]),

  // Despesas operacionais para DRE e EBITDA
  expenses: defineTable({
    user_id: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("INFRA"),
      v.literal("SAAS"),
      v.literal("CONTABILIDADE"),
      v.literal("EQUIPAMENTO"),
      v.literal("IMPOSTOS"),
      v.literal("OUTROS")
    ),
    amount: v.float64(),
    due_date: v.string(),
    paid_at: v.optional(v.string()),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("CANCELED")
    ),
    is_fixed: v.boolean(),
    created_at: v.optional(v.string()),
  }).index("by_user", ["user_id"]),

  // Regras atomicas da esteira de cobranca
  billing_rules: defineTable({
    user_id: v.string(),
    name: v.string(),
    trigger_type: v.union(
      v.literal("PRE_DUE"),
      v.literal("ON_DUE"),
      v.literal("POST_DUE_SHORT"),
      v.literal("POST_DUE_LONG")
    ),
    offset_days: v.float64(),
    channel: v.union(
      v.literal("EMAIL"),
      v.literal("SMS"),
      v.literal("WHATSAPP")
    ),
    tone_of_voice: v.union(
      v.literal("AMIGAVEL"),
      v.literal("FIRME"),
      v.literal("EXECUTIVO")
    ),
    active: v.boolean(),
    created_at: v.optional(v.string()),
  }).index("by_user", ["user_id"]),

  // DeduplicationJournal para garantir idempotencia estrita
  deduplication_journal: defineTable({
    event_id: v.string(),
    invoice_id: v.string(),
    trigger_day: v.string(),
    rule_id: v.string(),
    execution_id: v.string(),
    processed_at: v.string(),
  })
    .index("by_event", ["event_id"])
    .index("by_invoice", ["invoice_id"]),

  // Historico de disparos de cobranca
  billing_executions: defineTable({
    invoice_id: v.string(),
    rule_id: v.string(),
    channel: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("SUCCESS"),
      v.literal("FAILED")
    ),
    error_message: v.optional(v.string()),
    executed_at: v.string(),
  }).index("by_invoice", ["invoice_id"]),

  // Retencao do Success Fee de 5% sobre faturas recuperadas
  recovery_take_rates: defineTable({
    invoice_id: v.string(),
    gross_amount: v.float64(),
    recovered_amount: v.float64(),
    take_rate_percent: v.float64(),
    retained_fee: v.float64(),
    processed_at: v.string(),
  }).index("by_invoice", ["invoice_id"]),

  // Smart Escrows vinculados a entregas e deploys
  milestone_escrows: defineTable({
    project_id: v.string(),
    title: v.string(),
    amount: v.float64(),
    status: v.union(
      v.literal("CUSTODIED"),
      v.literal("APPROVED"),
      v.literal("RELEASED")
    ),
    deploy_url: v.optional(v.string()),
    created_at: v.optional(v.string()),
  }),

  // Templates de mensagem personalizados por tom de voz e canal
  message_templates: defineTable({
    user_id: v.string(),
    tone_of_voice: v.union(
      v.literal("AMIGAVEL"),
      v.literal("FIRME"),
      v.literal("EXECUTIVO")
    ),
    channel: v.union(
      v.literal("EMAIL"),
      v.literal("SMS"),
      v.literal("WHATSAPP")
    ),
    subject: v.string(),
    body: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index("by_user", ["user_id"]),

  // Livro-Razao Contabil (Ledger)
  ledger_transactions: defineTable({
    user_id: v.string(),
    type: v.union(
      v.literal("INCOME"),
      v.literal("EXPENSE"),
      v.literal("FEE"),
      v.literal("REFUND")
    ),
    amount: v.float64(),
    description: v.string(),
    created_at: v.string(),
  }).index("by_user", ["user_id"]),

  // Contratos formais com aceite digital imutavel
  contracts: defineTable({
    user_id: v.string(),
    client_id: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    contract_value: v.float64(),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("COMPLETED"),
      v.literal("CANCELED"),
      v.literal("PENDING_SIGNATURE")
    ),
    start_date: v.string(),
    end_date: v.optional(v.union(v.string(), v.null())),
    terms_clause: v.string(),
    accepted_at: v.optional(v.string()),
    signer_name: v.optional(v.string()),
    signer_email: v.optional(v.string()),
    signer_ip: v.optional(v.string()),
    signature_hash: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_client", ["client_id"])
    .index("by_status", ["status"]),

  // Avaliacoes de Ciclo Recorrente (10 projetos / 30 dias)
  cycle_evaluations: defineTable({
    user_id: v.string(),
    client_id: v.string(),
    cycle_identifier: v.string(),
    score_communication: v.optional(v.float64()),
    score_proactivity: v.optional(v.float64()),
    score_results: v.optional(v.float64()),
    score_understanding: v.optional(v.float64()),
    score_demand_delivery: v.optional(v.float64()),
    general_score: v.float64(),
    comments: v.optional(v.string()),
    trigger_type: v.union(
      v.literal("MILESTONE_10_PROJECTS"),
      v.literal("MONTHLY_30_DAYS"),
      v.literal("MANUAL")
    ),
    status: v.union(
      v.literal("PENDING"),
      v.literal("COMPLETED"),
      v.literal("EXPIRED")
    ),
    invitation_token: v.optional(v.string()),
    invitation_sent_at: v.optional(v.string()),
    completed_at: v.optional(v.string()),
    client_name: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_token", ["invitation_token"])
    .index("by_identifier", ["cycle_identifier"]),

  // Projetos do portfolio do freelancer
  projects: defineTable({
    user_id: v.string(),
    client_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    start_date: v.string(),
    end_date: v.optional(v.union(v.string(), v.null())),
    is_public_client_name: v.boolean(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_client", ["client_id"]),

  // Avaliacoes e feedbacks de projetos entregues
  project_feedbacks: defineTable({
    user_id: v.string(),
    project_id: v.string(),
    score: v.float64(),
    comments: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_project", ["project_id"]),
});
