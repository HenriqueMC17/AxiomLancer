import Decimal from "decimal.js";
import { Expense, Invoice, Client } from "../domain/types";
import { MonetaryService } from "./monetary.service";

export interface CashFlowPoint {
  date: string;
  displayDate: string;
  optimisticBalance: number;
  realisticBalance: number;
  pessimisticBalance: number;
  projectedInflow: number;
  projectedOutflow: number;
  netDayChange: number;
}

export interface RevenueLeakageReport {
  unbilledHoursPerWeek: number; // 10-15h perdidas
  estimatedMonthlyLeakageAmount: number; // R$ valor perdido por falta de faturamento
  uncollectedOverdueAmount: number; // Total em faturas vencidas
  draftInvoicesCount: number;
  draftInvoicesAmount: number;
  recoverableThroughEngine: number; // Potencial a ser recuperado pelo motor de cobrança
  potentialAxiomLancerTakeRate: number; // Take Rate estimado da plataforma (5%)
}

export class PredictiveCashflowService {
  /**
   * Gera a projeção diária de fluxo de caixa para os próximos N dias (30, 60 ou 90 dias)
   */
  public static generateProjection(
    currentBalance: number,
    invoices: Invoice[],
    expenses: Expense[],
    clients: Client[],
    horizonDays: number = 30
  ): {
    points: CashFlowPoint[];
    summary: {
      initialBalance: number;
      finalRealisticBalance: number;
      totalProjectedInflow: number;
      totalProjectedOutflow: number;
      projectedNetProfit: number;
      minProjectedBalance: number;
      riskAlerts: string[];
    };
  } {
    const points: CashFlowPoint[] = [];
    const clientMap = new Map<string, Client>();
    clients.forEach((c) => clientMap.set(c.id, c));

    let optBal = new Decimal(currentBalance);
    let realBal = new Decimal(currentBalance);
    let pessBal = new Decimal(currentBalance);

    let totalInflow = new Decimal(0);
    let totalOutflow = new Decimal(0);
    let minBalance = new Decimal(currentBalance);
    const riskAlerts: string[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day <= horizonDays; day++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + day);
      const dateStr = targetDate.toISOString().split("T")[0];
      const displayDate = targetDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

      let dayInflowOptimistic = new Decimal(0);
      let dayInflowRealistic = new Decimal(0);
      let dayInflowPessimistic = new Decimal(0);
      let dayOutflow = new Decimal(0);

      // 1. Processa despesas do dia
      expenses.forEach((exp) => {
        if (exp.status !== "CANCELED" && exp.due_date === dateStr) {
          const expAmt = new Decimal(exp.amount);
          dayOutflow = dayOutflow.plus(expAmt);
        }
      });

      // 2. Processa faturas com vencimento ou previsão
      invoices.forEach((inv) => {
        if (inv.status === "PAID" || inv.status === "CANCELED") return;

        const invDueDate = inv.due_date.split("T")[0];
        const client = clientMap.get(inv.client_id);
        const reliability = client ? client.payment_reliability_score / 100 : 0.8;
        const delayDays = client ? client.avg_payment_delay_days : 4;
        const invNet = new Decimal(inv.net_value);

        // Cenário Otimista: entra no dia exato do vencimento
        if (invDueDate === dateStr) {
          dayInflowOptimistic = dayInflowOptimistic.plus(invNet);
        }

        // Cenário Realista: ponderado por probabilidade e atraso médio
        const realisticTargetDate = new Date(inv.due_date);
        realisticTargetDate.setDate(realisticTargetDate.getDate() + (reliability < 0.9 ? delayDays : 0));
        if (realisticTargetDate.toISOString().split("T")[0] === dateStr) {
          dayInflowRealistic = dayInflowRealistic.plus(invNet.times(reliability));
        }

        // Cenário Pessimista: atraso de 14 dias para clientes com score < 90%
        const pessimisticTargetDate = new Date(inv.due_date);
        pessimisticTargetDate.setDate(pessimisticTargetDate.getDate() + 14);
        if (pessimisticTargetDate.toISOString().split("T")[0] === dateStr) {
          dayInflowPessimistic = dayInflowPessimistic.plus(invNet.times(0.7));
        }
      });

      optBal = optBal.plus(dayInflowOptimistic).minus(dayOutflow);
      realBal = realBal.plus(dayInflowRealistic).minus(dayOutflow);
      pessBal = pessBal.plus(dayInflowPessimistic).minus(dayOutflow);

      totalInflow = totalInflow.plus(dayInflowRealistic);
      totalOutflow = totalOutflow.plus(dayOutflow);

      if (realBal.lessThan(minBalance)) {
        minBalance = realBal;
      }

      if (realBal.lessThan(0) && !riskAlerts.some((a) => a.includes(dateStr))) {
        riskAlerts.push(`Alerta de Caixa: Saldo negativo projetado em ${displayDate} (${MonetaryService.formatBRL(realBal)})`);
      }

      points.push({
        date: dateStr,
        displayDate,
        optimisticBalance: MonetaryService.toMoney(optBal).toNumber(),
        realisticBalance: MonetaryService.toMoney(realBal).toNumber(),
        pessimisticBalance: MonetaryService.toMoney(pessBal).toNumber(),
        projectedInflow: MonetaryService.toMoney(dayInflowRealistic).toNumber(),
        projectedOutflow: MonetaryService.toMoney(dayOutflow).toNumber(),
        netDayChange: MonetaryService.toMoney(dayInflowRealistic.minus(dayOutflow)).toNumber(),
      });
    }

    return {
      points,
      summary: {
        initialBalance: currentBalance,
        finalRealisticBalance: MonetaryService.toMoney(realBal).toNumber(),
        totalProjectedInflow: MonetaryService.toMoney(totalInflow).toNumber(),
        totalProjectedOutflow: MonetaryService.toMoney(totalOutflow).toNumber(),
        projectedNetProfit: MonetaryService.toMoney(totalInflow.minus(totalOutflow)).toNumber(),
        minProjectedBalance: MonetaryService.toMoney(minBalance).toNumber(),
        riskAlerts,
      },
    };
  }

  /**
   * Identifica Vazamento de Receita (Revenue Leakage)
   * Base: Freelancers perdem 10 a 15h semanais com tarefas não faturáveis
   */
  public static calculateRevenueLeakage(
    invoices: Invoice[],
    hourlyRate: number = 150,
    wastedHoursPerWeek: number = 12
  ): RevenueLeakageReport {
    const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");
    const draftInvoices = invoices.filter((i) => i.status === "DRAFT");

    const uncollectedOverdueAmount = overdueInvoices.reduce((acc, curr) => acc + curr.gross_value, 0);
    const draftInvoicesAmount = draftInvoices.reduce((acc, curr) => acc + curr.gross_value, 0);

    // 12 horas semanais x 4.33 semanas x valor da hora
    const monthlyLeakage = new Decimal(wastedHoursPerWeek).times(4.33).times(hourlyRate);

    // Estimativa de recuperação do motor: 75% das faturas em atraso
    const recoverable = new Decimal(uncollectedOverdueAmount).times(0.75);
    const takeRate5Percent = recoverable.times(0.05);

    return {
      unbilledHoursPerWeek: wastedHoursPerWeek,
      estimatedMonthlyLeakageAmount: MonetaryService.toMoney(monthlyLeakage).toNumber(),
      uncollectedOverdueAmount: MonetaryService.toMoney(uncollectedOverdueAmount).toNumber(),
      draftInvoicesCount: draftInvoices.length,
      draftInvoicesAmount: MonetaryService.toMoney(draftInvoicesAmount).toNumber(),
      recoverableThroughEngine: MonetaryService.toMoney(recoverable).toNumber(),
      potentialAxiomLancerTakeRate: MonetaryService.toMoney(takeRate5Percent).toNumber(),
    };
  }
}
