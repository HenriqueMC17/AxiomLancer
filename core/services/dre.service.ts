import Decimal from "decimal.js";
import { Expense, Invoice, RecoveryTakeRate } from "../domain/types";
import { MonetaryService } from "./monetary.service";

export interface DREReport {
  grossRevenue: number;
  taxDeductions: number;
  netRevenue: number;
  directCosts: number;
  grossProfit: number;
  operatingExpenses: number;
  axiomLancerCoreSubscription: number; // R$ 49,90 fixo
  axiomLancerTakeRateCommission: number; // Taxa de recuperação
  ebitda: number;
  netIncome: number;
  netMarginPercent: number;
}

export class DREService {
  /**
   * Gera o DRE contábil determinístico
   */
  public static generateDRE(
    invoices: Invoice[],
    expenses: Expense[],
    takeRates: RecoveryTakeRate[] = []
  ): DREReport {
    // 1. Receita Bruta de faturas pagas
    const paidInvoices = invoices.filter((i) => i.status === "PAID");
    const grossRevenue = paidInvoices.reduce(
      (acc, curr) => acc.plus(curr.gross_value),
      new Decimal(0)
    );

    // 2. Impostos provisionados (Simples Nacional)
    const taxDeductions = paidInvoices.reduce(
      (acc, curr) => acc.plus(curr.tax_provisioned),
      new Decimal(0)
    );

    // 3. Receita Líquida
    const netRevenue = grossRevenue.minus(taxDeductions);

    // 4. Custos Diretos (Infra, Servidores, APIs)
    const directCosts = expenses
      .filter((e) => e.status === "PAID" && (e.category === "INFRA" || e.category === "EQUIPAMENTO"))
      .reduce((acc, curr) => acc.plus(curr.amount), new Decimal(0));

    // 5. Lucro Bruto
    const grossProfit = netRevenue.minus(directCosts);

    // 6. Despesas Operacionais (Contabilidade, Outros, exceto AxiomLancer)
    const operatingExpenses = expenses
      .filter((e) => e.status === "PAID" && e.category !== "INFRA" && e.category !== "EQUIPAMENTO" && e.category !== "IMPOSTOS")
      .reduce((acc, curr) => acc.plus(curr.amount), new Decimal(0));

    // 7. AxiomLancer SaaS Core e Take Rate
    const axiomLancerCoreSubscription = new Decimal("49.90");
    const axiomLancerTakeRateCommission = takeRates.reduce(
      (acc, curr) => acc.plus(curr.commission_amount),
      new Decimal(0)
    );

    // 8. EBITDA / Lucro Líquido
    const totalDeductionsAfterGross = directCosts
      .plus(operatingExpenses)
      .plus(axiomLancerCoreSubscription)
      .plus(axiomLancerTakeRateCommission);

    const netIncome = netRevenue.minus(totalDeductionsAfterGross);
    const netMarginPercent = grossRevenue.isZero()
      ? new Decimal(0)
      : MonetaryService.toMoney(netIncome.dividedBy(grossRevenue).times(100));

    return {
      grossRevenue: MonetaryService.toMoney(grossRevenue).toNumber(),
      taxDeductions: MonetaryService.toMoney(taxDeductions).toNumber(),
      netRevenue: MonetaryService.toMoney(netRevenue).toNumber(),
      directCosts: MonetaryService.toMoney(directCosts).toNumber(),
      grossProfit: MonetaryService.toMoney(grossProfit).toNumber(),
      operatingExpenses: MonetaryService.toMoney(operatingExpenses).toNumber(),
      axiomLancerCoreSubscription: MonetaryService.toMoney(axiomLancerCoreSubscription).toNumber(),
      axiomLancerTakeRateCommission: MonetaryService.toMoney(axiomLancerTakeRateCommission).toNumber(),
      ebitda: MonetaryService.toMoney(netIncome).toNumber(),
      netIncome: MonetaryService.toMoney(netIncome).toNumber(),
      netMarginPercent: netMarginPercent.toNumber(),
    };
  }
}
