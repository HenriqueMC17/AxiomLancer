export type IntegrationStatus = "ACTIVE" | "INACTIVE" | "ERROR" | "PENDING";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING";
export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELED";
export type ChannelType = "EMAIL" | "SMS" | "WHATSAPP";
export type ExpenseStatus = "PENDING" | "PAID" | "CANCELED";
export type LedgerTxType = "INCOME" | "EXPENSE" | "FEE" | "REFUND";
export type SaasBillingStatus = "PENDING" | "PAID" | "FAILED" | "CANCELED";
export type ExecutionStatus = "PENDING" | "SUCCESS" | "FAILED";
export type ContractStatus = "ACTIVE" | "COMPLETED" | "CANCELED" | "PENDING_SIGNATURE";
export type ToneOfVoice = "AMIGAVEL" | "FIRME" | "EXECUTIVO";

export interface User {
  id: string;
  email: string;
  name: string;
  billing_paused: boolean;
  current_score: number; // Score geral de reputacao (0.00 a 5.00)
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Client {
  id: string;
  user_id: string;
  legal_name: string;
  email: string;
  tone_of_voice: ToneOfVoice;
  billing_paused: boolean;
  payment_reliability_score: number;
  avg_payment_delay_days: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  // P1-4: client_name removido -- resolver via join com clients[]
  invoice_number: string;
  status: InvoiceStatus;
  due_date: string;
  gross_value: number;
  tax_rate: number;
  net_value: number;
  tax_provisioned: number;
  billing_paused: boolean;
  pix_key?: string;
  pix_qr_code?: string;
  recovered_by_engine?: boolean;
  created_at: string;
}

export type ExpenseCategory = "INFRA" | "SAAS" | "CONTABILIDADE" | "EQUIPAMENTO" | "IMPOSTOS" | "OUTROS";

export interface Expense {
  id: string;
  user_id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  due_date: string;
  paid_at?: string;
  status: ExpenseStatus;
  is_fixed: boolean;
  created_at: string;
}

export interface BillingRule {
  id: string;
  user_id: string;
  name: string;
  trigger_type: "PRE_DUE" | "ON_DUE" | "POST_DUE_SHORT" | "POST_DUE_LONG";
  offset_days: number;
  channel: ChannelType;
  tone_of_voice: ToneOfVoice;
  active: boolean;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  user_id: string;
  tone_of_voice: ToneOfVoice;
  channel: ChannelType;
  subject: string;
  body: string;
}

export interface DeduplicationJournal {
  event_id: string;
  invoice_id: string;
  trigger_day: string;
  rule_id: string;
  execution_id: string;
  processed_at: string;
}

export interface BillingExecution {
  id: string;
  invoice_id: string;
  rule_id: string;
  template_id: string;
  channel: ChannelType;
  status: ExecutionStatus;
  attempted_at: string;
  sent_at?: string;
  error_message?: string;
}

export interface RecoveryTakeRate {
  id: string;
  invoice_id: string;
  recovered_amount: number;
  rate_percent: number;
  commission_amount: number;
  recovered_at: string;
}

export interface Contract {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description?: string;
  contract_value: number; // Precisao decimal(12,2)
  status: ContractStatus;
  start_date: string;
  end_date?: string | null;
  client_name?: string;
  terms_clause?: string;
  accepted_at?: string | null;
  signer_name?: string | null;
  signer_email?: string | null;
  signer_ip?: string | null;
  signature_hash?: string | null;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface MilestoneEscrow {
  id: string;
  contract_id: string;
  title: string;
  amount: number;
  status: "LOCKED" | "APPROVED" | "RELEASED";
  deliverable_url?: string;
  release_date?: string;
}

export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  social_name?: string;
  bio?: string;
  avatar_url?: string;
  email: string;
  phone: string;
  address_type?: "PF" | "PJ";
  tax_id?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  instagram_url?: string;
  overall_score?: number;
}

export interface ProjectFeedback {
  id: string;
  user_id: string;
  project_id: string;
  score: number; // 0.00 a 5.00
  comments?: string;
  created_at: string;
}

export type CycleTriggerType = "MILESTONE_10_PROJECTS" | "MONTHLY_30_DAYS" | "MANUAL";
export type CycleEvaluationStatus = "PENDING" | "COMPLETED" | "EXPIRED";

export interface CycleEvaluation {
  id: string;
  user_id: string;
  client_id: string;
  client_name?: string;
  cycle_identifier: string;
  trigger_type?: CycleTriggerType;
  status?: CycleEvaluationStatus;
  score_communication?: number; // 0.00 a 5.00
  score_proactivity?: number;   // 0.00 a 5.00
  score_results?: number;       // 0.00 a 5.00
  score_understanding?: number; // 0.00 a 5.00
  score_demand_delivery?: number; // 0.00 a 5.00
  general_score: number;       // 0.00 a 5.00 (Decimal 12,2)
  comments?: string;
  invitation_token?: string;
  invitation_sent_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string | null;
  is_public_client_name: boolean; // Flag LGPD
  client_name?: string;           // Nome resolvido ou 'Confidencial'
  feedback?: ProjectFeedback;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}