import { z } from 'zod';
import { InvoiceDTO } from '../billing/invoice.contracts';

export const LedgerEntryTypeSchema = z.enum([
  'CREDIT',
  'DEBIT',
  'INCOME',
  'EXPENSE',
  'FEE',
  'REFUND',
]);

export type LedgerEntryType = z.infer<typeof LedgerEntryTypeSchema>;

export const AccountCategorySchema = z.enum([
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE',
  'TAX_RESERVE',
]);

export type AccountCategory = z.infer<typeof AccountCategorySchema>;

export interface LedgerEntryDTO {
  id: string;
  occurredAt?: string;
  userId?: string;
  invoiceId?: string | null;
  expenseId?: string | null;
  entryType: LedgerEntryType;
  accountCategory: string;
  amount: number;
  balanceAfter: number;
  description: string;
  correlationId?: string | null;
  transactionDate: string;
}

export interface DashboardMetricsDTO {
  liquidatedRevenue: number;
  receivables: number;
  operationalExpenses: number;
  taxReserve: number;
  defaultRiskRate: number;
  financialHealthScore: number;
}

export interface TaxBreakdownDTO {
  regime: string;
  effectiveRate: string;
  iss: string;
  pisCofins: string;
  irpjCsll: string;
  projectedDasAmount: number;
}

export interface PanicButtonDataDTO {
  isSafeModeActive: boolean;
  responseTimeMs: number;
  monitoredChannels: string[];
  recoverySuccessRate: number;
}

export interface CashflowPointDTO {
  period: string;
  receivables: number;
  expenses: number;
  taxReserve: number;
  netCashflow: number;
}

export interface DashboardSummaryDTO {
  metrics: DashboardMetricsDTO;
  recentInvoices: InvoiceDTO[];
  recentLedgerEntries: LedgerEntryDTO[];
  cashflowProjection: CashflowPointDTO[];
  panicButton: PanicButtonDataDTO;
  taxBreakdown: TaxBreakdownDTO;
}
