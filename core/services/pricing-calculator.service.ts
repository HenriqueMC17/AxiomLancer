import Decimal from "decimal.js";
import { MonetaryService } from "./monetary.service";
import { TaxEngineService } from "./tax-engine.service";

export interface PricingInput {
  monthlyPersonalExpenses: number;
  monthlyBusinessExpenses: number;
  desiredNetIncome: number;
  billableHoursPerWeek: number; // default 25
  weeksWorkedPerYear: number;   // default 48
  simplesNacionalType: "ANEXO_III" | "ANEXO_V";
  annualRevenueRBT12: number;
  payrollRatioFatorR: number;   // %
  gatewayType: "PIX" | "CREDIT_CARD" | "BOLETO";
}

export interface PricingOutput {
  minimumHourlyRate: number;
  recommendedHourlyRate: number;
  targetMonthlyGrossRevenue: number;
  monthlyNetIncome: number;
  monthlyTaxProvision: number;
  monthlyGatewayCost: number;
  monthlyBusinessExpenses: number;
  effectiveTaxRatePercent: number;
  gatewayFeePercent: number;
  totalMonthlyBillableHours: number;
  fatorRStatus: {
    ratioPercent: number;
    qualifiesForAnexoIII: boolean;
    recommendedAnexo: "ANEXO_III" | "ANEXO_V";
    potentialTaxSavingsMonthly: number;
  };
}

export class PricingCalculatorService {
  public static calculate(input: PricingInput): PricingOutput {
    const personal = new Decimal(input.monthlyPersonalExpenses);
    const business = new Decimal(input.monthlyBusinessExpenses);
    const desiredNet = new Decimal(input.desiredNetIncome);

    // Salário líquido total almejado (pessoal + margem de segurança)
    const targetNetRequired = personal.plus(desiredNet);

    // Avaliação Fator R
    const fatorR = TaxEngineService.calculateFatorR(
      targetNetRequired.times(12).times(new Decimal(input.payrollRatioFatorR).dividedBy(100)),
      input.annualRevenueRBT12
    );

    // Alíquota de imposto efetiva
    const { effectiveRatePercent } = TaxEngineService.calculateEffectiveTaxRate(
      input.annualRevenueRBT12,
      input.simplesNacionalType
    );

    // Taxa do gateway
    const sampleGateway = MonetaryService.calculateGatewayFee(1000, input.gatewayType);
    const gatewayRatePercent = sampleGateway.feePercent;

    // Alíquota combinada de deduções percentuais
    const totalDeductionPercent = effectiveRatePercent.plus(gatewayRatePercent);
    const retentionFactor = new Decimal(1).minus(totalDeductionPercent.dividedBy(100));

    // Faturamento Bruto Mensal Necessário = (Net Desejado + Custos Fixos) / (1 - %Deduções)
    const targetGrossMonthly = targetNetRequired.plus(business).dividedBy(retentionFactor);

    // Horas faturáveis no mês
    const annualHours = new Decimal(input.billableHoursPerWeek).times(input.weeksWorkedPerYear);
    const monthlyHours = annualHours.dividedBy(12);

    // Valor mínimo da hora técnica
    const minimumHourlyRate = targetGrossMonthly.dividedBy(monthlyHours);
    // Recomendada (com margem de risco de 15% para imprevistos/atrasos)
    const recommendedHourlyRate = minimumHourlyRate.times("1.15");

    // Provisões mensais
    const taxProvision = targetGrossMonthly.times(effectiveRatePercent).dividedBy(100);
    const gatewayCost = targetGrossMonthly.times(gatewayRatePercent).dividedBy(100);

    // Economia mensal caso enquadre no Anexo III
    const { effectiveRatePercent: anexoVRat } = TaxEngineService.calculateEffectiveTaxRate(input.annualRevenueRBT12, "ANEXO_V");
    const { effectiveRatePercent: anexoIIIRat } = TaxEngineService.calculateEffectiveTaxRate(input.annualRevenueRBT12, "ANEXO_III");
    const taxDiff = anexoVRat.minus(anexoIIIRat);
    const potentialTaxSavingsMonthly = targetGrossMonthly.times(taxDiff).dividedBy(100);

    return {
      minimumHourlyRate: MonetaryService.toMoney(minimumHourlyRate).toNumber(),
      recommendedHourlyRate: MonetaryService.toMoney(recommendedHourlyRate).toNumber(),
      targetMonthlyGrossRevenue: MonetaryService.toMoney(targetGrossMonthly).toNumber(),
      monthlyNetIncome: MonetaryService.toMoney(targetNetRequired).toNumber(),
      monthlyTaxProvision: MonetaryService.toMoney(taxProvision).toNumber(),
      monthlyGatewayCost: MonetaryService.toMoney(gatewayCost).toNumber(),
      monthlyBusinessExpenses: MonetaryService.toMoney(business).toNumber(),
      effectiveTaxRatePercent: effectiveRatePercent.toNumber(),
      gatewayFeePercent: gatewayRatePercent.toNumber(),
      totalMonthlyBillableHours: MonetaryService.toMoney(monthlyHours).toNumber(),
      fatorRStatus: {
        ratioPercent: fatorR.ratioPercent.toNumber(),
        qualifiesForAnexoIII: fatorR.qualifiesForAnexoIII,
        recommendedAnexo: fatorR.recommendedAnexo,
        potentialTaxSavingsMonthly: MonetaryService.toMoney(potentialTaxSavingsMonthly).toNumber(),
      },
    };
  }
}
