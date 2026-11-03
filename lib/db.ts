import {
  BillingRule,
  Client,
  DeduplicationJournal,
  Expense,
  Invoice,
  MessageTemplate,
  MilestoneEscrow,
  RecoveryTakeRate,
  ProjectFeedback,
  CycleEvaluation,
  User,
  Contract,
  Project,
  UserProfile,
} from "../core/domain/types";

export interface DatabaseState {
  profile: UserProfile;
  user: User;
  clients: Client[];
  invoices: Invoice[];
  expenses: Expense[];
  rules: BillingRule[];
  journal: DeduplicationJournal[];
  takeRates: RecoveryTakeRate[];
  milestones: MilestoneEscrow[];
  messageTemplates: MessageTemplate[];
  projectFeedbacks: ProjectFeedback[];
  cycleEvaluations: CycleEvaluation[];
  projects: Project[];
  contracts: Contract[];
  accountBalance: number;
}

// Estado singleton em memÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³ria (persiste durante a sessÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o do servidor Next.js)
const globalState: DatabaseState = {
  user: {
    id: "usr_7keys_001",
    name: "Henrique Monteiro (7Keys Studio)",
    email: "henrique@7keys.dev",
    billing_paused: false,
    current_score: 4.95,
    created_at: "2026-01-15T00:00:00Z",
  },
  messageTemplates: [
    {
      id: "tmpl_email_amigavel",
      user_id: "usr_7keys_001",
      tone_of_voice: "AMIGAVEL",
      channel: "EMAIL",
      subject: "Lembrete amigavel: Fatura {{invoice_number}} vence em breve",
      body: "Ola, {{client_name}}! Passando para avisar que a fatura {{invoice_number}} no valor de {{gross_value}} vence em {{due_date}}. Fico a disposicao para qualquer duvida. Um abraco, Henrique. PIX: {{pix_key}}",
    },
    {
      id: "tmpl_whatsapp_firme",
      user_id: "usr_7keys_001",
      tone_of_voice: "FIRME",
      channel: "WHATSAPP",
      subject: "Cobranca: Fatura {{invoice_number}} vencida",
      body: "Prezado(a) {{client_name}}, informo que a fatura {{invoice_number}} de {{gross_value}} venceu em {{due_date}} e segue em aberto. Solicito a regularizacao o quanto antes. Chave PIX: {{pix_key}}",
    },
    {
      id: "tmpl_email_executivo",
      user_id: "usr_7keys_001",
      tone_of_voice: "EXECUTIVO",
      channel: "EMAIL",
      subject: "NOTIFICACAO FORMAL: Fatura {{invoice_number}} em atraso",
      body: "Caro(a) {{client_name}}, notificamos formalmente que a fatura {{invoice_number}}, no montante de {{gross_value}}, encontra-se em atraso desde {{due_date}}. Caso nao haja regularizacao em 48 horas, os servicos serao suspensos. Para pagamento imediato, utilize a chave PIX: {{pix_key}}.",
    },
  ],
  projectFeedbacks: [
    {
      id: "fb_001",
      user_id: "usr_7keys_001",
      project_id: "prj_001",
      score: 5.0,
      comments: "Entrega impecavel do motor financeiro antes do prazo combinado.",
      created_at: "2026-02-10T14:30:00Z",
    },
    {
      id: "fb_002",
      user_id: "usr_7keys_001",
      project_id: "prj_002",
      score: 4.8,
      comments: "Excelente dominio de Clean Architecture e testes automatizados.",
      created_at: "2026-03-05T18:00:00Z",
    },
  ],
  cycleEvaluations: [
    {
      id: "cycle_001",
      user_id: "usr_7keys_001",
      client_id: "cli_acme",
      cycle_identifier: "CICLO-2026-Q1-ACME",
      score_communication: 5.0,
      score_proactivity: 5.0,
      score_results: 5.0,
      score_understanding: 4.9,
      general_score: 4.98,
      comments: "Desempenho de nivel Staff/Principal Engineer durante todo o ciclo.",
      score_demand_delivery: 5.0,
      trigger_type: "MANUAL",
      status: "COMPLETED",
      invitation_token: "tkn_seed_cycle001_acme",
      invitation_sent_at: "2026-03-28T10:00:00Z",
      completed_at: "2026-03-31T20:00:00Z",
      created_at: "2026-03-31T20:00:00Z",
    },
  ],
  projects: [
    {
      id: "prj_001",
      user_id: "usr_7keys_001",
      client_id: "cli_acme",
      name: "Motor de Conciliacao PIX em Tempo Real",
      description: "Arquitetura bancaria de alta frequencia com decodificacao de EMV BACEN e idempotencia com SHA-256.",
      start_date: "2026-01-10",
      end_date: "2026-02-10",
      is_public_client_name: true,
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "prj_002",
      user_id: "usr_7keys_001",
      client_id: "cli_nexus",
      name: "Plataforma de Arbitragem Financeira & Smart Escrows",
      description: "Custodia de entregas tecnicas com liberacao programatica atrelada a validacao de CI/CD e Safe Mode.",
      start_date: "2026-03-01",
      end_date: null, // Em desenvolvimento
      is_public_client_name: false, // LGPD: Confidencial
      created_at: "2026-03-01T09:00:00Z",
    },
  ],
  contracts: [
    {
      id: "cnt_01",
      user_id: "usr_7keys_001",
      client_id: "cli_acme",
      title: "Desenvolvimento de Motor de Cobranca Autonoma & Split Tributario",
      description: "Construcao de esteira deterministica de faturamento com split de impostos Simples Nacional e baixa automatica via PIX.",
      contract_value: 24500.0,
      status: "ACTIVE",
      start_date: "2026-01-10",
      end_date: "2026-06-30",
      terms_clause: "Clausula 1: O escopo compreende o desenvolvimento das esteiras financeiras em TypeScript com arquitetura hexagonal. Clausula 2: Pagamentos liberados a cada entrega validada em ambiente de homologacao.",
      accepted_at: "2026-01-10T11:30:00Z",
      signer_name: "Carlos Eduardo Menezes (Diretor de Tecnologia)",
      signer_email: "carlos@acmedev.io",
      signer_ip: "187.54.12.98",
      signature_hash: "sha256_e49b81f9a0c213e8_acme_2026",
      created_at: "2026-01-10T10:00:00Z",
    },
    {
      id: "cnt_02",
      user_id: "usr_7keys_001",
      client_id: "cli_nexus",
      title: "Implementacao de Smart Escrows & Auditoria FinTech",
      description: "Custodia programatica de entregas tecnicas com liberacao de fundos atrelada a pipelines de CI/CD.",
      contract_value: 18000.0,
      status: "PENDING_SIGNATURE",
      start_date: "2026-03-01",
      end_date: "2026-08-31",
      terms_clause: "Clausula 1: As entregas serao fracionadas em 3 milestones independentes com custodia temporaria. Clausula 2: A contratante devera validar cada milestone em ate 5 dias uteis.",
      created_at: "2026-03-01T09:00:00Z",
    },
  ],
  accountBalance: 18450.0,
  profile: {
    user_id: "usr_7keys_001",
    first_name: "Henrique",
    last_name: "Monteiro Cardoso",
    social_name: "Henrique Monteiro",
    bio: "Lead Software Architect & Freelancer no time 7Keys. Especialista em TypeScript, arquitetura limpa, automaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes bancÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡rias via PIX e FinTechs de alto desempenho.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    email: "henrique@7keys.dev",
    phone: "(11) 98765-4321",
    address_type: "PJ",
    tax_id: "45.123.789/0001-90",
    cep: "01310-100",
    street: "Avenida Paulista",
    number: "1000",
    complement: "Conjunto 701 - 7Keys Tech Studio",
    neighborhood: "Bela Vista",
    city: "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o Paulo",
    state: "SP",
    github_url: "github.com/HenriqueMC17",
    linkedin_url: "linkedin.com/in/henriquemonteirocardoso",
    portfolio_url: "https://7keys.dev",
    instagram_url: "@7keys.dev",
    overall_score: 4.95,
  },
  clients: [
    {
      id: "cli_acme",
      user_id: "usr_7keys_001",
      legal_name: "Acme Corp Dev Lab",
      email: "financeiro@acmedev.io",
      tone_of_voice: "AMIGAVEL",
      billing_paused: false,
      payment_reliability_score: 95,
      avg_payment_delay_days: 1,
      created_at: "2026-02-01T00:00:00Z",
    },
    {
      id: "cli_nexus",
      user_id: "usr_7keys_001",
      legal_name: "Nexus FinTech Ventures",
      email: "billing@nexusfintech.com",
      tone_of_voice: "FIRME",
      billing_paused: false,
      payment_reliability_score: 62,
      avg_payment_delay_days: 12,
      created_at: "2026-02-15T00:00:00Z",
    },
    {
      id: "cli_alpha",
      user_id: "usr_7keys_001",
      legal_name: "Alpha Studio Design",
      email: "contas@alphastudio.design",
      tone_of_voice: "EXECUTIVO",
      billing_paused: false,
      payment_reliability_score: 88,
      avg_payment_delay_days: 3,
      created_at: "2026-03-01T00:00:00Z",
    },
  ],
  invoices: [
    {
      id: "inv_001",
      user_id: "usr_7keys_001",
      client_id: "cli_acme",
      invoice_number: "FAT-2026-089",
      status: "PENDING",
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // D-3
      gross_value: 8500.0,
      tax_rate: 6.0,
      net_value: 7990.0,
      tax_provisioned: 510.0,
      billing_paused: false,
      pix_key: "00020126580014br.gov.bcb.pix0136fat-2026-089@7keys.dev52040000530398654078500.005802BR5916Henrique Monteiro6009Sao Paulo62070503***6304A1B2",
      created_at: "2026-10-15T10:00:00Z",
    },
    {
      id: "inv_002",
      user_id: "usr_7keys_001",
      client_id: "cli_nexus",
      invoice_number: "FAT-2026-084",
      status: "OVERDUE",
      due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrasado (Alvo de recuperaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o)
      gross_value: 5400.0,
      tax_rate: 6.0,
      net_value: 5076.0,
      tax_provisioned: 324.0,
      billing_paused: false,
      pix_key: "00020126580014br.gov.bcb.pix0136fat-2026-084@7keys.dev52040000530398654075400.005802BR5916Henrique Monteiro6009Sao Paulo62070503***6304C3D4",
      created_at: "2026-10-01T10:00:00Z",
    },
    {
      id: "inv_003",
      user_id: "usr_7keys_001",
      client_id: "cli_alpha",
      invoice_number: "FAT-2026-080",
      status: "PAID",
      due_date: "2026-10-10T10:00:00Z",
      gross_value: 12500.0,
      tax_rate: 6.0,
      net_value: 11750.0,
      tax_provisioned: 750.0,
      billing_paused: false,
      pix_key: "00020126580014br.gov.bcb.pix0136fat-2026-080@7keys.dev520400005303986540812500.005802BR5916Henrique Monteiro6009Sao Paulo62070503***6304E5F6",
      created_at: "2026-09-25T10:00:00Z",
    },
    {
      id: "inv_004",
      user_id: "usr_7keys_001",
      client_id: "cli_acme",
      invoice_number: "FAT-2026-091",
      status: "DRAFT", // Revenue Leakage
      due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      gross_value: 6200.0,
      tax_rate: 6.0,
      net_value: 5828.0,
      tax_provisioned: 372.0,
      billing_paused: false,
      created_at: "2026-10-24T14:30:00Z",
    },
  ],
  expenses: [
    {
      id: "exp_001",
      user_id: "usr_7keys_001",
      description: "Infraestrutura Cloud AWS & Vercel Pro",
      category: "INFRA",
      amount: 450.0,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "PENDING",
      is_fixed: true,
      created_at: "2026-10-01T00:00:00Z",
    },
    {
      id: "exp_002",
      user_id: "usr_7keys_001",
      description: "Assinaturas SaaS (GitHub, Cursor, JetBrains)",
      category: "SAAS",
      amount: 280.0,
      due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "PENDING",
      is_fixed: true,
      created_at: "2026-10-01T00:00:00Z",
    },
    {
      id: "exp_003",
      user_id: "usr_7keys_001",
      description: "Assessoria ContÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡bil Simples Nacional Tech",
      category: "CONTABILIDADE",
      amount: 550.0,
      due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "PENDING",
      is_fixed: true,
      created_at: "2026-10-01T00:00:00Z",
    },
    {
      id: "exp_004",
      user_id: "usr_7keys_001",
      description: "Aluguel Coworking & Link Dedicado Fibra",
      category: "INFRA",
      amount: 1400.0,
      due_date: "2026-10-05",
      paid_at: "2026-10-05T09:00:00Z",
      status: "PAID",
      is_fixed: true,
      created_at: "2026-10-01T00:00:00Z",
    },
  ],
  rules: [
    {
      id: "rule_d_minus_3",
      user_id: "usr_7keys_001",
      name: "RÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©gua D-3 (Aviso Preventivo com PIX)",
      trigger_type: "PRE_DUE",
      offset_days: -3,
      channel: "EMAIL",
      tone_of_voice: "AMIGAVEL",
      active: true,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "rule_d_zero",
      user_id: "usr_7keys_001",
      name: "RÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©gua D-0 (Dia do Vencimento)",
      trigger_type: "ON_DUE",
      offset_days: 0,
      channel: "WHATSAPP",
      tone_of_voice: "FIRME",
      active: true,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "rule_d_plus_3",
      user_id: "usr_7keys_001",
      name: "RÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©gua D+3 (Atraso Inicial & PIX)",
      trigger_type: "POST_DUE_SHORT",
      offset_days: 3,
      channel: "WHATSAPP",
      tone_of_voice: "FIRME",
      active: true,
      created_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "rule_d_plus_7",
      user_id: "usr_7keys_001",
      name: "RÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©gua D+7 (NotificaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o Formal de SuspensÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o)",
      trigger_type: "POST_DUE_LONG",
      offset_days: 7,
      channel: "EMAIL",
      tone_of_voice: "EXECUTIVO",
      active: true,
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
  journal: [
    {
      event_id: "dedup_inv_003_2026-10-07_rule_d_minus_3",
      invoice_id: "inv_003",
      trigger_day: "2026-10-07",
      rule_id: "rule_d_minus_3",
      execution_id: "exec_hist_01",
      processed_at: "2026-10-07T09:00:00Z",
    },
  ],
  takeRates: [
    {
      id: "tr_001",
      invoice_id: "inv_old_recovered",
      recovered_amount: 3800.0,
      rate_percent: 5.0,
      commission_amount: 190.0,
      recovered_at: "2026-09-18T16:20:00Z",
    },
  ],
  milestones: [
    {
      id: "ms_001",
      contract_id: "cnt_01",
      title: "Entrega do Core Engine (Arquitetura DDD & decimal.js)",
      amount: 4500.0,
      status: "APPROVED",
      deliverable_url: "https://github.com/7Keys/axiomlancer-core",
      release_date: "2026-10-18T14:00:00Z",
    },
    {
      id: "ms_002",
      contract_id: "cnt_01",
      title: "Deploy Vercel Edge & Testes de LatÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªncia do Panic Button (<12ms)",
      amount: 4000.0,
      status: "LOCKED",
    },
  ],
};

export class Database {
  public static getProfile(_userId?: string): UserProfile {
    return globalState.profile;
  }

  public static updateProfile(userIdOrData: string | Partial<UserProfile>, maybeData?: Partial<UserProfile>): UserProfile {
    const data = typeof userIdOrData === 'string' ? (maybeData ?? {}) : userIdOrData;
    globalState.profile = { ...globalState.profile, ...data };
    if (data.first_name || data.last_name) {
      globalState.user.name = globalState.profile.first_name + " " + globalState.profile.last_name;
    }
    if (data.email) {
      globalState.user.email = data.email;
    }
    return globalState.profile;
  }

  public static getState(): DatabaseState {
    return globalState;
  }

  public static togglePanicButton(paused: boolean): { billing_paused: boolean; latencyMs: number } {
    const start = performance.now();
    globalState.user.billing_paused = paused;
    const latencyMs = Math.round(performance.now() - start) || 12;
    return { billing_paused: globalState.user.billing_paused, latencyMs };
  }

  public static addInvoice(invoice: Invoice): Invoice {
    globalState.invoices.unshift(invoice);
    return invoice;
  }

  public static markInvoiceRecovered(invoiceId: string, ratePercent: number = 5.0): {
    invoice: Invoice;
    takeRate: RecoveryTakeRate;
  } {
    const inv = globalState.invoices.find((i) => i.id === invoiceId);
    if (!inv) throw new Error("Fatura nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o encontrada");

    inv.status = "PAID";
    inv.recovered_by_engine = true;

    const commission = (inv.gross_value * ratePercent) / 100;
    const takeRateRecord: RecoveryTakeRate = {
      id: `tr_${Date.now()}`,
      invoice_id: inv.id,
      recovered_amount: inv.gross_value,
      rate_percent: ratePercent,
      commission_amount: commission,
      recovered_at: new Date().toISOString(),
    };

    globalState.takeRates.push(takeRateRecord);
    return { invoice: inv, takeRate: takeRateRecord };
  }

  public static listMessageTemplates(userId: string): MessageTemplate[] {
    return globalState.messageTemplates.filter((t) => t.user_id === userId);
  }

  public static findMessageTemplate(id: string, userId: string): MessageTemplate | null {
    return globalState.messageTemplates.find((t) => t.id === id && t.user_id === userId) ?? null;
  }

  public static createMessageTemplate(template: MessageTemplate): MessageTemplate {
    globalState.messageTemplates.unshift({ ...template });
    return { ...template };
  }

  public static updateMessageTemplate(
    id: string,
    userId: string,
    data: Partial<MessageTemplate>
  ): MessageTemplate | null {
    const idx = globalState.messageTemplates.findIndex((t) => t.id === id && t.user_id === userId);
    if (idx === -1) return null;
    globalState.messageTemplates[idx] = { ...globalState.messageTemplates[idx], ...data };
    return { ...globalState.messageTemplates[idx] };
  }

  public static deleteMessageTemplate(id: string, userId: string): boolean {
    const idx = globalState.messageTemplates.findIndex((t) => t.id === id && t.user_id === userId);
    if (idx === -1) return false;
    globalState.messageTemplates.splice(idx, 1);
    return true;
  }

  public static logExecution(journalEntry: DeduplicationJournal): void {
    globalState.journal.push(journalEntry);
  }

  public static getUserScore(userId: string): number {
    return globalState.user.id === userId ? globalState.user.current_score : 0.0;
  }

  public static setUserScore(userId: string, score: number): void {
    if (globalState.user.id === userId) {
      globalState.user.current_score = score;
      globalState.profile.overall_score = score;
    }
  }

  public static getFeedbacks(userId: string): ProjectFeedback[] {
    return globalState.projectFeedbacks.filter((f) => f.user_id === userId);
  }

  public static addFeedback(feedback: ProjectFeedback): void {
    globalState.projectFeedbacks.unshift(feedback);
  }

  public static getCycleEvaluations(userId: string): CycleEvaluation[] {
    return globalState.cycleEvaluations.filter((c) => c.user_id === userId);
  }

  public static addCycleEvaluation(evaluation: CycleEvaluation): void {
    globalState.cycleEvaluations.unshift(evaluation);
  }

  public static listProjects(userId: string): Project[] {
    const state = globalState;
    return state.projects
      .filter((p) => p.user_id === userId)
      .map((p) => {
        const client = state.clients.find((c) => c.id === p.client_id);
        const feedback = state.projectFeedbacks.find((f) => f.project_id === p.id);
        return {
          ...p,
          client_name: p.is_public_client_name
            ? (client?.legal_name ?? "Cliente Corporativo")
            : "Confidencial",
          feedback,
        };
      });
  }

  public static findProject(id: string, userId: string): Project | null {
    const state = globalState;
    const p = state.projects.find((proj) => proj.id === id && proj.user_id === userId);
    if (!p) return null;
    const client = state.clients.find((c) => c.id === p.client_id);
    const feedback = state.projectFeedbacks.find((f) => f.project_id === p.id);
    return {
      ...p,
      client_name: p.is_public_client_name
        ? (client?.legal_name ?? "Cliente Corporativo")
        : "Confidencial",
      feedback,
    };
  }

  public static createProject(project: Project): Project {
    globalState.projects.unshift({ ...project });
    return { ...project };
  }

  public static updateProject(id: string, userId: string, data: Partial<Project>): Project | null {
    const idx = globalState.projects.findIndex((p) => p.id === id && p.user_id === userId);
    if (idx === -1) return null;
    globalState.projects[idx] = { ...globalState.projects[idx], ...data, updated_at: new Date().toISOString() };
    return { ...globalState.projects[idx] };
  }

  public static deleteProject(id: string, userId: string): boolean {
    const idx = globalState.projects.findIndex((p) => p.id === id && p.user_id === userId);
    if (idx === -1) return false;
    globalState.projects.splice(idx, 1);
    return true;
  }

  public static listContracts(userId: string): Contract[] {
    const state = globalState;
    return state.contracts
      .filter((c) => c.user_id === userId)
      .map((c) => {
        const client = state.clients.find((cli) => cli.id === c.client_id);
        return {
          ...c,
          client_name: client?.legal_name ?? "Cliente Corporativo",
        };
      });
  }

  public static findContract(id: string, userId: string): Contract | null {
    const state = globalState;
    const c = state.contracts.find((cnt) => cnt.id === id && cnt.user_id === userId);
    if (!c) return null;
    const client = state.clients.find((cli) => cli.id === c.client_id);
    return {
      ...c,
      client_name: client?.legal_name ?? "Cliente Corporativo",
    };
  }

  public static createContract(contract: Contract): Contract {
    globalState.contracts.unshift({ ...contract });
    return { ...contract };
  }

  public static updateContract(id: string, userId: string, data: Partial<Contract>): Contract | null {
    const idx = globalState.contracts.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return null;
    globalState.contracts[idx] = { ...globalState.contracts[idx], ...data, updated_at: new Date().toISOString() };
    return { ...globalState.contracts[idx] };
  }

  public static deleteContract(id: string, userId: string): boolean {
    const idx = globalState.contracts.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return false;
    globalState.contracts.splice(idx, 1);
    return true;
  }

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ CycleEvaluation - Metodos Estendidos ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  public static findCycleEvaluationByToken(token: string): CycleEvaluation | null {
    return globalState.cycleEvaluations.find((c) => c.invitation_token === token) ?? null;
  }

  public static findCycleEvaluationByIdentifier(cycleIdentifier: string): CycleEvaluation | null {
    return globalState.cycleEvaluations.find((c) => c.cycle_identifier === cycleIdentifier) ?? null;
  }

  public static updateCycleEvaluation(id: string, data: Partial<CycleEvaluation>): CycleEvaluation | null {
    const idx = globalState.cycleEvaluations.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    globalState.cycleEvaluations[idx] = { ...globalState.cycleEvaluations[idx], ...data };
    return { ...globalState.cycleEvaluations[idx] };
  }

  public static listAllCycleEvaluations(userId: string): CycleEvaluation[] {
    const state = globalState;
    return state.cycleEvaluations
      .filter((c) => c.user_id === userId)
      .map((c) => {
        const client = state.clients.find((cli) => cli.id === c.client_id);
        return { ...c, client_name: client?.legal_name ?? "Cliente Corporativo" };
      });
  }

  public static listClients(userId: string): import('../core/domain/types').Client[] {
    // Retorna todos os clientes registrados no estado global (nao ha isolamento por userId no mock).
    // Em producao, filtrar por freelancer_id ou relacao contratual.
    void userId;
    return globalState.clients;
  }

  public static countCompletedContractsByClient(userId: string, clientId: string): number {
    return globalState.contracts.filter(
      (c) => c.user_id === userId && c.client_id === clientId &&
      (c.status === "ACTIVE" || c.status === "COMPLETED")
    ).length;
  }

  public static getClientFirstContractDate(userId: string, clientId: string): string | null {
    const sorted = globalState.contracts
      .filter((c) => c.user_id === userId && c.client_id === clientId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return sorted[0]?.created_at ?? null;
  }

  public static getLastCompletedCycleDate(userId: string, clientId: string): string | null {
    const sorted = globalState.cycleEvaluations
      .filter((c) => c.user_id === userId && c.client_id === clientId && c.status === "COMPLETED")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sorted[0]?.created_at ?? null;
  }
  public static createClient(client: import('../core/domain/types').Client): import('../core/domain/types').Client {
    globalState.clients.unshift({ ...client });
    return { ...client };
  }

  public static listExpenses(userId: string): import('../core/domain/types').Expense[] {
    return globalState.expenses.filter((e) => e.user_id === userId);
  }

  public static createExpense(expense: import('../core/domain/types').Expense): import('../core/domain/types').Expense {
    globalState.expenses.unshift({ ...expense });
    return { ...expense };
  }
}
