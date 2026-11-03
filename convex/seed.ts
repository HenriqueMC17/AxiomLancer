import { mutation } from "./_generated/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Verifica se ja existem dados para evitar duplicacao
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "henrique@7keys.dev"))
      .first();

    if (existingUser) {
      return { status: "already_seeded", userId: existingUser._id };
    }

    const now = new Date().toISOString();

    // 2. Insere Usuario Mestre
    const userId = await ctx.db.insert("users", {
      name: "Henrique Monteiro (7Keys Studio)",
      email: "henrique@7keys.dev",
      billing_paused: false,
      created_at: now,
      updated_at: now,
    });

    // 3. Insere Perfil do Arquiteto
    await ctx.db.insert("user_profiles", {
      user_id: userId,
      first_name: "Henrique",
      last_name: "Monteiro Cardoso",
      social_name: "Henrique Monteiro",
      bio: "Lead Software Architect & Freelancer no time 7Keys. Especialista em TypeScript, arquitetura limpa, automações bancárias via PIX e FinTechs de alto desempenho.",
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
      city: "São Paulo",
      state: "SP",
      github_url: "github.com/HenriqueMC17",
      linkedin_url: "linkedin.com/in/henriquemonteirocardoso",
      portfolio_url: "https://7keys.dev",
      overall_score: 4.95,
    });

    // 4. Insere Clientes
    const cliAcme = await ctx.db.insert("clients", {
      user_id: userId,
      legal_name: "Acme Corp Dev Lab",
      email: "financeiro@acmedev.io",
      tone_of_voice: "AMIGAVEL",
      billing_paused: false,
      payment_reliability_score: 95,
      avg_payment_delay_days: 1,
      created_at: now,
      updated_at: now,
    });

    const cliNexus = await ctx.db.insert("clients", {
      user_id: userId,
      legal_name: "Nexus FinTech Ventures",
      email: "billing@nexusfintech.com",
      tone_of_voice: "FIRME",
      billing_paused: false,
      payment_reliability_score: 62,
      avg_payment_delay_days: 12,
      created_at: now,
      updated_at: now,
    });

    const cliAlpha = await ctx.db.insert("clients", {
      user_id: userId,
      legal_name: "Alpha Studio Design",
      email: "contas@alphastudio.design",
      tone_of_voice: "EXECUTIVO",
      billing_paused: false,
      payment_reliability_score: 88,
      avg_payment_delay_days: 3,
      created_at: now,
      updated_at: now,
    });

    // 5. Insere Faturas Iniciais com Split Tributario
    await ctx.db.insert("invoices", {
      user_id: userId,
      client_id: cliAcme,
      invoice_number: "FAT-2026-001",
      status: "PAID",
      due_date: "2026-03-10",
      gross_value: 8500.0,
      tax_rate: 6.0,
      net_value: 7990.0,
      tax_provisioned: 510.0,
      billing_paused: false,
      pix_key: "pix@7keys.dev",
      recovered_by_engine: false,
      created_at: now,
      updated_at: now,
    });

    await ctx.db.insert("invoices", {
      user_id: userId,
      client_id: cliNexus,
      invoice_number: "FAT-2026-002",
      status: "OVERDUE",
      due_date: "2026-03-25",
      gross_value: 12000.0,
      tax_rate: 6.0,
      net_value: 11280.0,
      tax_provisioned: 720.0,
      billing_paused: false,
      pix_key: "pix@7keys.dev",
      recovered_by_engine: false,
      created_at: now,
      updated_at: now,
    });

    await ctx.db.insert("invoices", {
      user_id: userId,
      client_id: cliAlpha,
      invoice_number: "FAT-2026-003",
      status: "PENDING",
      due_date: "2026-04-05",
      gross_value: 4800.0,
      tax_rate: 6.0,
      net_value: 4512.0,
      tax_provisioned: 288.0,
      billing_paused: false,
      pix_key: "pix@7keys.dev",
      recovered_by_engine: false,
      created_at: now,
      updated_at: now,
    });

    // 6. Insere Regras Padrao da Esteira
    await ctx.db.insert("billing_rules", {
      user_id: userId,
      name: "Aviso Preventivo de Cortesia",
      trigger_type: "PRE_DUE",
      offset_days: -3,
      channel: "EMAIL",
      tone_of_voice: "AMIGAVEL",
      active: true,
      created_at: now,
    });

    await ctx.db.insert("billing_rules", {
      user_id: userId,
      name: "Notificacao no Vencimento com PIX Dinamico",
      trigger_type: "ON_DUE",
      offset_days: 0,
      channel: "WHATSAPP",
      tone_of_voice: "EXECUTIVO",
      active: true,
      created_at: now,
    });

    await ctx.db.insert("billing_rules", {
      user_id: userId,
      name: "Lembrete Assertivo Pos-Vencimento",
      trigger_type: "POST_DUE_SHORT",
      offset_days: 3,
      channel: "WHATSAPP",
      tone_of_voice: "FIRME",
      active: true,
      created_at: now,
    });

    // 7. Insere Despesas Operacionais Base
    await ctx.db.insert("expenses", {
      user_id: userId,
      description: "Servidores Cloud & Vercel Pro",
      category: "INFRA",
      amount: 140.0,
      due_date: "2026-04-10",
      status: "PAID",
      is_fixed: true,
      created_at: now,
    });

    await ctx.db.insert("expenses", {
      user_id: userId,
      description: "Assinatura Contabilidade Digital",
      category: "CONTABILIDADE",
      amount: 350.0,
      due_date: "2026-04-15",
      status: "PENDING",
      is_fixed: true,
      created_at: now,
    });

    return { status: "success", userId };
  },
});
