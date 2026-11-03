import Decimal from "decimal.js";
import { Invoice, Expense, ExpenseCategory } from "@/core/domain/types";

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface DashboardSummaryReport {
  // Entradas (Inflow)
  totalReceivedMonth: number;
  totalReceivedYear: number;
  totalReceivable: number;
  totalDraft: number;

  // Saidas (OPEX)
  opexMonth: number;
  opexYear: number;
  fixedOpexMonth: number;
  variableOpexMonth: number;
  opexByCategory: CategoryBreakdown[];

  // Margem de Lucro Real
  netProfitMonth: number;
  netMarginPercentMonth: number;
  netProfitYear: number;
  netMarginPercentYear: number;

  // Metricas de Contratos/Faturas
  paidInvoicesCount: number;
  pendingInvoicesCount: number;
  activeExpensesCount: number;

  calculatedAt: string;
}

/**
 * Service de Dominio para Sumarizacao de Caixa e OPEX do Dashboard.
 *
 * Principios:
 * - Precisao Monetaria Absoluta: Todas as totalizacoes utilizam decimal.js com ROUND_HALF_UP.
 * - Zero Float Leaks: Nenhuma operacao matematica usa operadores nativos com floats IEEE 754.
 * - Segregacao Temporal: Filtra estritamente receitas e despesas por mes e ano de competencia.
 */
export class DashboardSummaryService {
  /**
   * Consolida faturas e despesas operacionais em um relatorio deterministico.
   */
  public static calculateSummary(
    invoices: Invoice[],
    expenses: Expense[],
    referenceDate: Date = new Date()
  ): DashboardSummaryReport {
    const currentYear = referenceDate.getFullYear();
    const currentMonth = referenceDate.getMonth(); // 0 a 11

    // -------------------------------------------------------------
    // 1. PROCESSAMENTO DE ENTRADAS (INVOICES)
    // -------------------------------------------------------------
    let dReceivedMonth = new Decimal(0);
    let dReceivedYear = new Decimal(0);
    let dReceivable = new Decimal(0);
    let dDraft = new Decimal(0);
    let paidCount = 0;
    let pendingCount = 0;

    for (const inv of invoices) {
      const invValue = new Decimal(inv.gross_value || 0);
      const invDate = new Date(inv.due_date);
      const isThisYear = !isNaN(invDate.getTime()) && invDate.getFullYear() === currentYear;
      const isThisMonth = isThisYear && invDate.getMonth() === currentMonth;

      if (inv.status === "PAID") {
        paidCount++;
        if (isThisYear) {
          dReceivedYear = dReceivedYear.plus(invValue);
        }
        if (isThisMonth) {
          dReceivedMonth = dReceivedMonth.plus(invValue);
        }
      } else if (inv.status === "PENDING" || inv.status === "OVERDUE") {
        pendingCount++;
        dReceivable = dReceivable.plus(invValue);
      } else if (inv.status === "DRAFT") {
        dDraft = dDraft.plus(invValue);
      }
    }

    // -------------------------------------------------------------
    // 2. PROCESSAMENTO DE SAIDAS (OPEX - DESPESAS OPERACIONAIS)
    // -------------------------------------------------------------
    let dOpexMonth = new Decimal(0);
    let dOpexYear = new Decimal(0);
    let dFixedOpexMonth = new Decimal(0);
    let dVariableOpexMonth = new Decimal(0);
    const categoryTotals: Record<string, Decimal> = {};

    let activeExpensesCount = 0;

    for (const exp of expenses) {
      if (exp.status === "CANCELED") continue;
      activeExpensesCount++;

      const expValue = new Decimal(exp.amount || 0);
      const expDate = new Date(exp.due_date);
      const isThisYear = !isNaN(expDate.getTime()) && expDate.getFullYear() === currentYear;
      const isThisMonth = isThisYear && expDate.getMonth() === currentMonth;

      if (isThisYear) {
        dOpexYear = dOpexYear.plus(expValue);
      }

      if (isThisMonth) {
        dOpexMonth = dOpexMonth.plus(expValue);

        if (exp.is_fixed) {
          dFixedOpexMonth = dFixedOpexMonth.plus(expValue);
        } else {
          dVariableOpexMonth = dVariableOpexMonth.plus(expValue);
        }

        // Agrupamento por categoria no mes
        const cat = exp.category || "OUTROS";
        categoryTotals[cat] = (categoryTotals[cat] || new Decimal(0)).plus(expValue);
      }
    }

    // -------------------------------------------------------------
    // 3. QUEBRA DE OPEX POR CATEGORIA (APIs, SaaS, Infra, etc.)
    // -------------------------------------------------------------
    const opexByCategory: CategoryBreakdown[] = Object.entries(categoryTotals).map(([cat, total]) => {
      const percentage = dOpexMonth.isZero()
        ? 0
        : total.dividedBy(dOpexMonth).times(100).toDecimalPlaces(1, Decimal.ROUND_HALF_UP).toNumber();
      return {
        category: cat as ExpenseCategory,
        amount: total.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
        percentage,
      };
    });

    // Ordena da maior para a menor despesa
    opexByCategory.sort((a, b) => b.amount - a.amount);

    // -------------------------------------------------------------
    // 4. MARGEM DE LUCRO REAL (MENSAL E ANUAL)
    // -------------------------------------------------------------
    const dNetProfitMonth = dReceivedMonth.minus(dOpexMonth);
    const dNetMarginMonth = dReceivedMonth.isZero()
      ? new Decimal(0)
      : dNetProfitMonth.dividedBy(dReceivedMonth).times(100);

    const dNetProfitYear = dReceivedYear.minus(dOpexYear);
    const dNetMarginYear = dReceivedYear.isZero()
      ? new Decimal(0)
      : dNetProfitYear.dividedBy(dReceivedYear).times(100);

    return {
      totalReceivedMonth: dReceivedMonth.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalReceivedYear: dReceivedYear.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalReceivable: dReceivable.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalDraft: dDraft.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),

      opexMonth: dOpexMonth.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      opexYear: dOpexYear.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      fixedOpexMonth: dFixedOpexMonth.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      variableOpexMonth: dVariableOpexMonth.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      opexByCategory,

      netProfitMonth: dNetProfitMonth.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      netMarginPercentMonth: dNetMarginMonth.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      netProfitYear: dNetProfitYear.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      netMarginPercentYear: dNetMarginYear.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),

      paidInvoicesCount: paidCount,
      pendingInvoicesCount: pendingCount,
      activeExpensesCount,

      calculatedAt: new Date().toISOString(),
    };
  }
}