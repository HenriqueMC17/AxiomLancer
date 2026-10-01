import {
  InvoiceDTO,
  LedgerEntryDTO,
  DashboardMetricsDTO,
  TaxBreakdownDTO,
  PanicButtonDataDTO,
  CashflowPointDTO,
  DashboardSummaryDTO,
  InvoiceStatus,
  LedgerEntryType,
} from '@axiom/contracts';

export type InvoiceItem = InvoiceDTO;
export type LedgerEntry = LedgerEntryDTO;
export type DashboardMetrics = DashboardMetricsDTO;
export type TaxBreakdown = TaxBreakdownDTO;
export type PanicButtonData = PanicButtonDataDTO;
export type CashflowPoint = CashflowPointDTO;
export type DashboardSummary = DashboardSummaryDTO;
export type { InvoiceStatus, LedgerEntryType };
