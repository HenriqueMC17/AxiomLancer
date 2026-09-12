/**
 * Single Source of Truth (SSOT) - AxiomLancer Copywriting & CRO
 * Centralizes all textual content, value propositions, metrics, and persona copy.
 * Enables rapid A/B testing and marketing iteration without touching layout JSX.
 */

export const copywriting = {
  brand: {
    name: "AxiomLancer",
    tagline: "Previsio BI Powered Financial Autonomy",
    slogan: "Elimine o constrangimento de cobrar clientes: da entrega ao dinheiro na conta.",
    shortDescription:
      "A esteira autônoma que orquestra faturamento com Asaas e Stripe, executa réguas preditivas inteligentes e provisiona tributos no ato do recebimento para freelancers e microagências.",
  },

  hero: {
    badge: "GESTÃO FINANCEIRA AUTÔNOMA PARA FREELANCERS & MICROAGÊNCIAS",
    headline:
      "Cansado de passar o final do mês correndo atrás de clientes atrasados sem saber quanto realmente vai entrar na conta?",
    subheadline:
      "Deixe de ser o cobrador constrangido do seu próprio trabalho. O AxiomLancer é a esteira autônoma que calcula impostos, emite cobranças via PIX/Boleto e executa réguas preditivas inteligentes. Você programa, cria e entrega; o nosso robô garante que o dinheiro caia na sua conta.",
    cta: {
      primary: "Comece seu teste gratuito de 14 dias",
      secondary: "Ver demonstração técnica guiada",
      placeholder: "Digite seu e-mail profissional...",
    },
    guarantees: [
      "Sem cartão de crédito no cadastro",
      "Setup em 3 minutos",
      "Integrado com Asaas e Stripe",
      "Cancele quando quiser",
    ],
  },

  socialProof: {
    stats: [
      { label: "Tempo de Cobrança Poupado", value: "80%", detail: "Até 15h semanais devolvidas" },
      { label: "Redução de Inadimplência", value: "-40%", detail: "Liquidação no vencimento" },
      { label: "Velocidade de Conciliação", value: "280ms", detail: "Webhooks instantâneos" },
      { label: "Cofre Tributário Blindado", value: "100%", detail: "Zero surpresa de impostos" },
    ],
    partners: [
      { name: "Asaas", role: "Gateway Oficial PIX & Boletos" },
      { name: "Stripe", role: "Infraestrutura Global de Cartões" },
      { name: "Open Finance Brasil", role: "Conexão Bancária Criptografada" },
      { name: "AWS GovCloud", role: "Criptografia AES-256 em Repouso" },
    ],
  },

  personas: [
    {
      id: "dev",
      title: "Dev Full Stack PJ",
      subtitle: "Engenheiro de Software & Consultor Independente",
      badge: "Para Autônomos Tech",
      weeklyGain: "+12h livres / semana",
      pain: "Passar o fechamento do mês conferindo extratos bancários e cobrando clientes no WhatsApp como um pedinte.",
      solution: "Esteira autônoma com webhooks da Stripe e Asaas: emite PIX com QR Code dinâmico, liquida faturas em 280ms e faz conciliação instantânea.",
      primaryBenefit: "Fim das horas não faturáveis e foco 100% no código.",
      quote: "Minha inadimplência foi a zero e parei de perder os domingos fazendo conciliação bancária manual.",
      author: "Lucas Silveira • Desenvolvedor Full Stack PJ",
    },
    {
      id: "designer",
      title: "UI/UX & Brand Designer",
      subtitle: "Designers de Produto & Estúdios Solo",
      badge: "Para Criativos Independentes",
      weeklyGain: "+9h livres / semana",
      pain: "Cobrar clientes no meio de uma sprint de redesign e medo do sistema automático criar constrangimento em aditivos de escopo.",
      solution: "Régua cortês corporativa com Botão de Pânico: se o cliente pedir mais prazo, congele as cobranças dele em 5 segundos sem afetar o resto da carteira.",
      primaryBenefit: "Postura de grande agência e preservação total do relacionamento comercial.",
      quote: "O Botão de Pânico me dá a segurança de pausar quando estou renegociando um escopo com o cliente.",
      author: "Mariana Esteves • Brand & UI/UX Designer",
    },
    {
      id: "consultant",
      title: "Consultor / Estrategista",
      subtitle: "Especialistas em Arquitetura, DevOps & Segurança",
      badge: "Para Especialistas Sêniores",
      weeklyGain: "+10h livres / semana",
      pain: "Emitir faturas de honorários elevados e não ter previsibilidade determinística de recebimento de contratos corporativos.",
      solution: "Smart Escrows com liquidação programada por milestone de consultoria e relatórios de auditoria financeira no padrão C-Level.",
      primaryBenefit: "Previsibilidade de caixa e formalidade contratual que impõe respeito perante departamentos de compras corporativos.",
      quote: "A liberação por milestone com escrow transformou a seriedade dos meus contratos corporativos.",
      author: "Guilherme Sampaio • Arquiteto Cloud & Consultor",
    },
    {
      id: "agency",
      title: "Microagência Digital",
      subtitle: "Fundadores de Estúdios de 2 a 8 Pessoas",
      badge: "Para Pequenos Times",
      weeklyGain: "+18h livres / semana",
      pain: "Faturar R$ 40k no mês e ver a margem líquida sumir pela falta de provisionamento de impostos e descontrole de assinaturas de software.",
      solution: "OPEX Guardian com teto de gastos preventivo e split fiscal automático de impostos (Simples Nacional/ISS) no ato de cada recebimento.",
      primaryBenefit: "Previsibilidade de lucro líquido e proteção contra multas tributárias surpresa.",
      quote: "O provisionamento automático de tributos e o teto de gastos salvaram nossa margem de lucro operacional.",
      author: "Rafael Mendonça • Fundador de Estúdio Tech",
    },
  ],

  features: [
    {
      id: "smart-escrow",
      badge: "Garantia Contratual",
      title: "Smart Escrows & Liberação por Milestone",
      description:
        "Retenção programada de pagamentos vinculados a entregas técnicas. O valor fica custodiado com segurança bancária e é liberado assim que o deploy ou entrega for aprovado.",
      colSpan: "md:col-span-6",
      metric: "100% de segurança contra calotes de entrega",
    },
    {
      id: "preditive-sequence",
      badge: "Redis & BullMQ",
      title: "Régua de Cobrança Preditiva Multicanal",
      description:
        "Disparos automáticos e elegantes em D-5, D-0 e D+2 via WhatsApp, E-mail e SMS. Links diretos com QR Code PIX que liquidam no mesmo instante.",
      colSpan: "md:col-span-6",
      metric: "-42% de inadimplência média",
    },
    {
      id: "tax-vault",
      badge: "Blindagem Fiscal",
      title: "Split Tributário Automático no Recebimento",
      description:
        "Cálculo exato da alíquota (Simples Nacional, MEI ou Lucro Presumido). Ao receber a fatura, o percentual de imposto é segregado em cofre virtual isolado.",
      colSpan: "md:col-span-4",
      metric: "Zero surpresa no DAS/Darf",
    },
    {
      id: "previsio-bi",
      badge: "Previsio BI Engine",
      title: "Previsio BI & Scoring de Recebíveis",
      description:
        "Modelagem preditiva de fluxo de caixa a 30, 60 e 90 dias. Algoritmo de risco que classifica a pontualidade do pagador antes mesmo do vencimento.",
      colSpan: "md:col-span-4",
      metric: "DRE projetado com 96% de acurácia",
    },
    {
      id: "instant-reconciliation",
      badge: "Webhooks 200 OK",
      title: "Conciliação Bancária em Tempo Real",
      description:
        "Baixa automática de faturas em menos de 280 milissegundos via webhooks criptografados do Asaas e Stripe. Sem arquivos OFX ou conferência manual de comprovante.",
      colSpan: "md:col-span-4",
      metric: "Baixa média em 280ms",
    },
    {
      id: "panic-button-feature",
      badge: "Controle Total",
      title: "Botão de Pânico & Auditoria em 1 Clique",
      description:
        "Renegociando escopo com o cliente? Congele toda a esteira de cobranças com um toque. Auditoria ativa com indicador de IA para revisão contínua de contratos.",
      colSpan: "md:col-span-12",
      metric: "Controle absoluto nas suas mãos",
    },
  ],

  panicSandbox: {
    badge: "PLAYGROUND INTERATIVO DE SEGURANÇA",
    title: "Teste a Régua Preditiva e o Botão de Pânico",
    subtitle:
      "Simule o comportamento do robô ao longo da linha do tempo e veja como você sempre mantém o controle total sobre qualquer notificação enviada ao cliente.",
    stages: [
      {
        id: "d-5",
        label: "D-5 (Lembrete Cortês)",
        tone: "Gentil & Preventivo",
        channel: "WhatsApp & E-mail",
        message:
          "Olá [Cliente], tudo bem? Enviando com antecedência a fatura do Milestone #2 (R$ 4.500,00) com vencimento em 15/10. O PIX já está disponível para facilitar sua programação financeira!",
      },
      {
        id: "d-0",
        label: "D-0 (Dia do Vencimento)",
        tone: "Prático & Direto",
        channel: "WhatsApp com QR Code",
        message:
          "Olá [Cliente]! Hoje vence a fatura de desenvolvimento #1084. Copie o código PIX dinâmico abaixo para liquidação imediata sem taxa de boleto: [PIX COPIA E COLA]",
      },
      {
        id: "d-2",
        label: "D+2 (Tolerância Amigável)",
        tone: "Empático & Profissional",
        channel: "E-mail Executivo",
        message:
          "Olá [Cliente], notamos que a fatura #1084 ainda está em aberto. Houve algum imprevisto com o faturamento bancário? Estamos à disposição para ajudar.",
      },
    ],
  },

  pricing: {
    badge: "MODELO DE MONETIZAÇÃO TRANSPARENTE",
    title: "Investimento claro. Retorno comprovado.",
    subtitle: "Escolha o plano ideal para a escala da sua operação independente.",
    plans: [
      {
        id: "solo",
        name: "Freelancer Solo",
        badge: "Mais Popular",
        isPopular: true,
        priceMonthly: "49,90",
        priceAnnualMonthly: "39,90",
        period: "/mês",
        description: "A esteira autônoma completa para desenvolvedores PJ, designers e consultores solo.",
        features: [
          "Faturamento ilimitado de PIX dinâmico e Boletos",
          "Integração direta com Asaas e Stripe (Webhooks)",
          "Conciliação bancária instantânea em 280ms",
          "Régua de Cobrança Preditiva (D-5, D-0, D+2)",
          "Botão de Pânico com congelamento em 1 clique",
          "Provisionamento de tributos no ato (Simples/MEI)",
          "Simulador de ROI e Previsio BI básico",
          "1 Operador (Você no comando total)",
        ],
        cta: "Comece teste grátis de 14 dias",
      },
      {
        id: "agency",
        name: "Microagência / Studio",
        badge: "Para Equipes",
        isPopular: false,
        priceMonthly: "129,90",
        priceAnnualMonthly: "99,90",
        period: "/mês",
        description: "Para estúdios e microagências de 2 a 8 pessoas que gerenciam múltiplos contratos e clientes.",
        features: [
          "Tudo do plano Freelancer Solo",
          "Até 5 operadores de equipe com permissões",
          "Previsio BI Avançado com DRE Projetado a 90 dias",
          "Scoring de Risco de Crédito de Clientes",
          "Múltiplas contas bancárias e CNPJs integrados",
          "OPEX Guardian (Monitor de Teto de Gastos de Ferramentas)",
          "Exportação de dados para contabilidade externa",
          "Suporte prioritário via WhatsApp com time técnico 7Keys",
        ],
        cta: "Assinar Plano Microagência",
      },
    ],
    takeRate: {
      title: "Como Funciona o Take Rate Transacional:",
      regular: {
        title: "Faturas Pagas em Dia:",
        rate: "TAXA 0%",
        desc: "100% do valor vai direto para sua conta bancária. Não cobramos comissão sobre sua receita normal.",
      },
      recovered: {
        title: "Inadimplência Recuperada pelo Robô:",
        rate: "1,2% a 2,5% de comissão",
        desc: "Cobrado estritamente sobre faturas vencidas que a esteira resgatar. Você só compartilha taxa se o dinheiro que estava perdido entrar na conta.",
      },
    },
  },
} as const;

export type Copywriting = typeof copywriting;
