import Decimal from "decimal.js";
import { MonetaryService } from "./monetary.service";

interface Bracket {
  limit: number;
  rate: number;
  deduction: number;
}

const BRACKETS_ANEXO_III: Bracket[] = [
  { limit: 180000, rate: 0.06, deduction: 0 },
  { limit: 360000, rate: 0.112, deduction: 9360 },
  { limit: 720000, rate: 0.135, deduction: 17640 },
  { limit: 1800000, rate: 0.16, deduction: 35640 },
  { limit: 3600000, rate: 0.21, deduction: 125640 },
  { limit: 4800000, rate: 0.33, deduction: 648000 },
];

const BRACKETS_ANEXO_V: Bracket[] = [
  { limit: 180000, rate: 0.155, deduction: 0 },
  { limit: 360000, rate: 0.18, deduction: 4500 },
  { limit: 720000, rate: 0.195, deduction: 9900 },
  { limit: 1800000, rate: 0.205, deduction: 17100 },
  { limit: 3600000, rate: 0.23, deduction: 62100 },
  { limit: 4800000, rate: 0.305, deduction: 540000 },
];

export class TaxEngineService {
  /**
   * Avalia enquadramento no Fator R:
   * Se razão Folha / RBT12 >= 28%, tributação migra para o Anexo III (alíquotas a partir de 6%)
   * Se menor que 28%, permanece no Anexo V (alíquotas a partir de 15.5%)
   */
  public static calculateFatorR(
    annualPayroll: Decimal.Value,
    annualRevenueRBT12: Decimal.Value
  ): {
    ratioPercent: Decimal;
    qualifiesForAnexoIII: boolean;
    recommendedAnexo: "ANEXO_III" | "ANEXO_V";
    taxSavingsPercent: Decimal;
  } {
    const payroll = new Decimal(annualPayroll);
    const revenue = new Decimal(annualRevenueRBT12);

    if (revenue.isZero()) {
      return {
        ratioPercent: new Decimal(0),
        qualifiesForAnexoIII: false,
        recommendedAnexo: "ANEXO_V",
        taxSavingsPercent: new Decimal(0),
      };
    }

    const ratio = payroll.dividedBy(revenue);
    const ratioPercent = MonetaryService.toMoney(ratio.times(100));
    const qualifiesForAnexoIII = ratioPercent.greaterThanOrEqualTo(28);

    const recommendedAnexo = qualifiesForAnexoIII ? "ANEXO_III" : "ANEXO_V";
    // Economia típica média na 1ª faixa: 15.5% - 6% = 9.5%
    const taxSavingsPercent = qualifiesForAnexoIII ? new Decimal("9.50") : new Decimal("0.00");

    return {
      ratioPercent,
      qualifiesForAnexoIII,
      recommendedAnexo,
      taxSavingsPercent,
    };
  }

  /**
   * Calcula a Alíquota Efetiva do Simples Nacional com base na RBT12
   * Fórmula oficial: ((RBT12 * Alíquota Nominal) - Parcela a Deduzir) / RBT12
   */
  public static calculateEffectiveTaxRate(
    annualRevenueRBT12: Decimal.Value,
    anexo: "ANEXO_III" | "ANEXO_V"
  ): {
    effectiveRatePercent: Decimal;
    nominalRatePercent: Decimal;
    deductionValue: Decimal;
    bracketNumber: number;
  } {
    const rbt12 = new Decimal(annualRevenueRBT12);
    const brackets = anexo === "ANEXO_III" ? BRACKETS_ANEXO_III : BRACKETS_ANEXO_V;

    if (rbt12.isZero() || rbt12.lessThanOrEqualTo(180000)) {
      const firstBracket = brackets[0];
      return {
        effectiveRatePercent: MonetaryService.toMoney(new Decimal(firstBracket.rate).times(100)),
        nominalRatePercent: MonetaryService.toMoney(new Decimal(firstBracket.rate).times(100)),
        deductionValue: new Decimal(0),
        bracketNumber: 1,
      };
    }

    let selectedBracket = brackets[brackets.length - 1];
    let bracketIndex = brackets.length;

    for (let i = 0; i < brackets.length; i++) {
      if (rbt12.lessThanOrEqualTo(brackets[i].limit)) {
        selectedBracket = brackets[i];
        bracketIndex = i + 1;
        break;
      }
    }

    const nominalRate = new Decimal(selectedBracket.rate);
    const deduction = new Decimal(selectedBracket.deduction);

    // ((RBT12 * AliqNominal) - ParcelaDeduzir) / RBT12
    const numerator = rbt12.times(nominalRate).minus(deduction);
    const effectiveRate = numerator.dividedBy(rbt12);
    const effectiveRatePercent = MonetaryService.toMoney(effectiveRate.times(100));

    return {
      effectiveRatePercent,
      nominalRatePercent: MonetaryService.toMoney(nominalRate.times(100)),
      deductionValue: deduction,
      bracketNumber: bracketIndex,
    };
  }

  /**
   * Provisiona o split tributário para uma fatura emitida
   */
  public static provisionInvoiceTax(
    invoiceAmount: Decimal.Value,
    rbt12: Decimal.Value,
    anexo: "ANEXO_III" | "ANEXO_V"
  ): {
    grossAmount: Decimal;
    effectiveRatePercent: Decimal;
    virtualSafeDeposit: Decimal; // Valor a reter na subconta de impostos
    netOperationalAmount: Decimal; // Valor livre para gastos operacionais / pró-labore
  } {
    const gross = MonetaryService.toMoney(invoiceAmount);
    const { effectiveRatePercent } = this.calculateEffectiveTaxRate(rbt12, anexo);

    const split = MonetaryService.calculateTaxSplit(gross, effectiveRatePercent);

    return {
      grossAmount: gross,
      effectiveRatePercent,
      virtualSafeDeposit: split.taxProvisioned,
      netOperationalAmount: split.netValue,
    };
  }
}
