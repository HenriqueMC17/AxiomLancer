export interface InvoiceItem {
  id: string;
  clientName: string;
  clientTaxId: string;
  grossAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'DRAFT' | 'PENDING' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELED';
  dueDate: string;
  issuedAt?: string | null;
  paidAt?: string | null;
}

export interface LedgerEntry {
  id: string;
  entryType: 'CREDIT' | 'DEBIT' | 'INCOME' | 'EXPENSE' | 'FEE' | 'REFUND';
  accountCategory: string;
  amount: number;
  balanceAfter: number;
  description: string;
  correlationId?: string;
  transactionDate: string;
}

export interface DashboardMetrics {
  liquidatedRevenue: number;
  receivables: number;
  operationalExpenses: number;
  taxReserve: number;
  defaultRiskRate: number;
  financialHealthScore: number;
}

export interface TaxBreakdown {
  regime: string;
  effectiveRate: string;
  iss: string;
  pisCofins: string;
  irpjCsll: string;
  projectedDasAmount: number;
}

export interface PanicButtonData {
  isSafeModeActive: boolean;
  responseTimeMs: number;
  monitoredChannels: string[];
  recoverySuccessRate: number;
}

export interface CashflowPoint {
  period: string;
  receivables: number;
  expenses: number;
  taxReserve: number;
  netCashflow: number;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  recentInvoices: InvoiceItem[];
  recentLedgerEntries: LedgerEntry[];
  cashflowProjection: CashflowPoint[];
  panicButton: PanicButtonData;
  taxBreakdown: TaxBreakdown;
}
