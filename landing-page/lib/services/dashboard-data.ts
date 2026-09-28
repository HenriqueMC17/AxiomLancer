export interface InvoiceItem {
  id: string;
  clientName: string;
  clientTaxId: string;
  grossAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'PAID' | 'ISSUED' | 'OVERDUE' | 'DRAFT';
  dueDate: string;
  issuedAt?: string | null;
  paidAt?: string | null;
  description: string;
}

export interface LedgerEntry {
  id: string;
  entryType: 'DEBIT' | 'CREDIT';
  accountCategory: 'ASSET' | 'REVENUE' | 'EXPENSE' | 'TAX_RESERVE' | 'LIABILITY';
  amount: number;
  balanceAfter: number;
  description: string;
  correlationId: string;
  transactionDate: string;
}

export interface CashflowPoint {
  period: string;
  receivables: number;
  expenses: number;
  taxReserve: number;
  netCashflow: number;
}

export interface DashboardData {
  metrics: {
    liquidatedRevenue: number;
    receivables: number;
    operationalExpenses: number;
    taxReserve: number;
    defaultRiskRate: number;
    financialHealthScore: number;
    monthlyGoal: number;
    growthRate: number;
  };
  invoices: InvoiceItem[];
  ledgerEntries: LedgerEntry[];
  cashflowProjection: CashflowPoint[];
  panicButton: {
    isSafeModeActive: boolean;
    responseTimeMs: number;
    monitoredChannels: string[];
    recoverySuccessRate: number;
    activeEscrowMilestones: number;
  };
  taxBreakdown: {
    regime: string;
    effectiveRate: number;
    iss: number;
    pisCofins: number;
    irpjCsll: number;
    projectedDasAmount: number;
    dasDueDate: string;
  };
}

export const initialDashboardData: DashboardData = {
  metrics: {
    liquidatedRevenue: 48750.0,
    receivables: 24320.0,
    operationalExpenses: 9180.5,
    taxReserve: 3864.2,
    defaultRiskRate: 1.2,
    financialHealthScore: 98.2,
    monthlyGoal: 60000.0,
    growthRate: 18.4,
  },
  invoices: [
    {
      id: 'INV-2026-089',
      clientName: 'Fintech Nexus Tecnologia S.A.',
      clientTaxId: '34.892.110/0001-45',
      grossAmount: 18500.0,
      taxAmount: 1110.0,
      netAmount: 17390.0,
      status: 'PAID',
      dueDate: '2026-09-22',
      issuedAt: '2026-09-08',
      paidAt: '2026-09-21',
      description: 'Sprint 04: Motor de Conciliação Bancária & Webhooks',
    },
    {
      id: 'INV-2026-090',
      clientName: 'Studio Alpha Design B2B',
      clientTaxId: '19.420.852/0001-90',
      grossAmount: 14250.0,
      taxAmount: 855.0,
      netAmount: 13395.0,
      status: 'ISSUED',
      dueDate: '2026-10-02',
      issuedAt: '2026-09-17',
      paidAt: null,
      description: 'Design System Enterprise & Tokens Multi-Marca',
    },
    {
      id: 'INV-2026-091',
      clientName: 'CloudScale Infraestrutura Cloud',
      clientTaxId: '28.113.654/0001-12',
      grossAmount: 10070.0,
      taxAmount: 604.2,
      netAmount: 9465.8,
      status: 'ISSUED',
      dueDate: '2026-10-10',
      issuedAt: '2026-09-20',
      paidAt: null,
      description: 'Otimização Kubernetes e Migração Zero Downtime',
    },
    {
      id: 'INV-2026-092',
      clientName: 'Apex Capital Ventures',
      clientTaxId: '09.541.223/0001-08',
      grossAmount: 16000.0,
      taxAmount: 960.0,
      netAmount: 15040.0,
      status: 'PAID',
      dueDate: '2026-09-15',
      issuedAt: '2026-09-01',
      paidAt: '2026-09-15',
      description: 'Dashboard de BI Executivo com Métricas de Portfólio',
    },
    {
      id: 'INV-2026-088',
      clientName: 'Veloce Logística Inteligente',
      clientTaxId: '41.332.908/0001-67',
      grossAmount: 14250.0,
      taxAmount: 855.0,
      netAmount: 13395.0,
      status: 'PAID',
      dueDate: '2026-09-10',
      issuedAt: '2026-08-25',
      paidAt: '2026-09-10',
      description: 'Integração de Rastreamento de Frotas via Telemetria',
    },
    {
      id: 'INV-2026-087',
      clientName: 'Vanguard Health Labs',
      clientTaxId: '12.876.543/0001-21',
      grossAmount: 3800.0,
      taxAmount: 228.0,
      netAmount: 3572.0,
      status: 'OVERDUE',
      dueDate: '2026-09-18',
      issuedAt: '2026-09-03',
      paidAt: null,
      description: 'Manutenção Mensal de API e Suporte L2',
    },
  ],
  ledgerEntries: [
    {
      id: 'TX-LEDGER-944',
      entryType: 'CREDIT',
      accountCategory: 'TAX_RESERVE',
      amount: 1110.0,
      balanceAfter: 3864.2,
      description: 'Split Tributário 6.00% provisionado (INV-2026-089)',
      correlationId: 'CORR-INV-089-SETTLE',
      transactionDate: '2026-09-21T14:32:00Z',
    },
    {
      id: 'TX-LEDGER-943',
      entryType: 'CREDIT',
      accountCategory: 'ASSET',
      amount: 17390.0,
      balanceAfter: 48750.0,
      description: 'Liquidação Líquida recebida via PIX (INV-2026-089)',
      correlationId: 'CORR-INV-089-SETTLE',
      transactionDate: '2026-09-21T14:32:00Z',
    },
    {
      id: 'TX-LEDGER-942',
      entryType: 'DEBIT',
      accountCategory: 'EXPENSE',
      amount: 1450.0,
      balanceAfter: 9180.5,
      description: 'AWS Cloud Services & Cluster ECS Fargate',
      correlationId: 'CORR-EXP-AWS-SET26',
      transactionDate: '2026-09-18T10:15:00Z',
    },
    {
      id: 'TX-LEDGER-941',
      entryType: 'CREDIT',
      accountCategory: 'TAX_RESERVE',
      amount: 960.0,
      balanceAfter: 2754.2,
      description: 'Split Tributário 6.00% provisionado (INV-2026-092)',
      correlationId: 'CORR-INV-092-SETTLE',
      transactionDate: '2026-09-15T09:20:00Z',
    },
    {
      id: 'TX-LEDGER-940',
      entryType: 'CREDIT',
      accountCategory: 'ASSET',
      amount: 15040.0,
      balanceAfter: 31360.0,
      description: 'Liquidação Líquida recebida via Boleto Asaas (INV-2026-092)',
      correlationId: 'CORR-INV-092-SETTLE',
      transactionDate: '2026-09-15T09:20:00Z',
    },
    {
      id: 'TX-LEDGER-939',
      entryType: 'DEBIT',
      accountCategory: 'EXPENSE',
      amount: 850.0,
      balanceAfter: 7730.5,
      description: 'Assinaturas de Software (GitHub Enterprise + Figma Org)',
      correlationId: 'CORR-EXP-SAAS-SET26',
      transactionDate: '2026-09-12T16:40:00Z',
    },
  ],
  cashflowProjection: [
    { period: 'Abr', receivables: 32000, expenses: 7800, taxReserve: 1920, netCashflow: 22280 },
    { period: 'Mai', receivables: 38500, expenses: 8400, taxReserve: 2310, netCashflow: 27790 },
    { period: 'Jun', receivables: 41200, expenses: 8900, taxReserve: 2472, netCashflow: 29828 },
    { period: 'Jul', receivables: 45000, expenses: 9100, taxReserve: 2700, netCashflow: 33200 },
    { period: 'Ago', receivables: 47800, expenses: 9400, taxReserve: 2868, netCashflow: 35532 },
    { period: 'Set (Atual)', receivables: 52600, expenses: 9180, taxReserve: 3156, netCashflow: 40264 },
  ],
  panicButton: {
    isSafeModeActive: false,
    responseTimeMs: 12,
    monitoredChannels: ['WhatsApp Business API', 'E-mail SMTP/Resend', 'PIX Dinâmico BACEN'],
    recoverySuccessRate: 89.3,
    activeEscrowMilestones: 4,
  },
  taxBreakdown: {
    regime: 'Simples Nacional (Anexo III)',
    effectiveRate: 6.0,
    iss: 2.0,
    pisCofins: 1.65,
    irpjCsll: 2.35,
    projectedDasAmount: 3864.2,
    dasDueDate: '2026-10-20',
  },
};

export async function fetchDashboardData(): Promise<DashboardData> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${backendUrl}/api/v1/dashboard/summary`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return mergeWithSeedData(json.data);
      }
    }
  } catch {
    // Falha silenciosa no fetch: fallback determinístico de alta performance
  }

  return initialDashboardData;
}

function mergeWithSeedData(apiData: any): DashboardData {
  return {
    ...initialDashboardData,
    metrics: {
      ...initialDashboardData.metrics,
      liquidatedRevenue: Number(apiData.metrics?.liquidatedRevenue) || initialDashboardData.metrics.liquidatedRevenue,
      receivables: Number(apiData.metrics?.receivables) || initialDashboardData.metrics.receivables,
      operationalExpenses: Number(apiData.metrics?.operationalExpenses) || initialDashboardData.metrics.operationalExpenses,
      taxReserve: Number(apiData.metrics?.taxReserve) || initialDashboardData.metrics.taxReserve,
      financialHealthScore: Number(apiData.metrics?.financialHealthScore) || initialDashboardData.metrics.financialHealthScore,
      defaultRiskRate: Number(apiData.metrics?.defaultRiskRate) || initialDashboardData.metrics.defaultRiskRate,
    },
  };
}
