export interface DashboardMetricsDTO {
  liquidatedRevenue: string;
  receivables: string;
  operationalExpenses: string;
  taxReserve: string;
  defaultRiskRate: number;
  financialHealthScore: number;
}

export interface DashboardInvoiceItemDTO {
  id: string;
  clientName: string;
  clientTaxId: string;
  grossAmount: string;
  taxAmount: string;
  netAmount: string;
  status: string;
  dueDate: string;
  issuedAt?: string | null;
  paidAt?: string | null;
}

export interface DashboardLedgerEntryDTO {
  id: string;
  entryType: 'DEBIT' | 'CREDIT';
  accountCategory: string;
  amount: string;
  balanceAfter: string;
  description: string;
  correlationId?: string | null;
  transactionDate: string;
}

export interface DashboardCashflowPointDTO {
  period: string;
  receivables: number;
  expenses: number;
  taxReserve: number;
  netCashflow: number;
}

export interface DashboardSummaryResponseDTO {
  metrics: DashboardMetricsDTO;
  recentInvoices: DashboardInvoiceItemDTO[];
  recentLedgerEntries: DashboardLedgerEntryDTO[];
  cashflowProjection: DashboardCashflowPointDTO[];
  panicButton: {
    isSafeModeActive: boolean;
    responseTimeMs: number;
    monitoredChannels: string[];
    recoverySuccessRate: number;
  };
  taxBreakdown: {
    regime: string;
    effectiveRate: string;
    iss: string;
    pisCofins: string;
    irpjCsll: string;
    projectedDasAmount: string;
  };
}
