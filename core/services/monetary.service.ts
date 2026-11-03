import Decimal from "decimal.js";

// Configuração de precisão de 20 dígitos significativos e arredondamento financeiro ROUND_HALF_UP
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export class MonetaryService {
  /**
   * Arredonda com precisão monetária de 2 casas decimais (DECIMAL 12,2)
   */
  public static toMoney(val: Decimal.Value): Decimal {
    return new Decimal(val).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }

  /**
   * Formata para moeda brasileira BRL (R$ 1.234,56) de forma determinística
   */
  public static formatBRL(val: Decimal.Value): string {
    const dec = this.toMoney(val);
    const parts = dec.toFixed(2).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1];
    return `R$ ${integerPart},${decimalPart}`;
  }

  /**
   * Calcula o split de imposto (gross -> net + tax_provisioned)
   */
  public static calculateTaxSplit(
    grossValue: Decimal.Value,
    taxRatePercent: Decimal.Value
  ): {
    gross: Decimal;
    taxRate: Decimal;
    taxProvisioned: Decimal;
    netValue: Decimal;
  } {
    const gross = this.toMoney(grossValue);
    const taxRate = new Decimal(taxRatePercent);
    const taxProvisioned = this.toMoney(gross.times(taxRate).dividedBy(100));
    const netValue = this.toMoney(gross.minus(taxProvisioned));

    return {
      gross,
      taxRate,
      taxProvisioned,
      netValue,
    };
  }

  /**
   * Calcula taxa de gateway de pagamento
   */
  public static calculateGatewayFee(
    grossValue: Decimal.Value,
    gateway: "PIX" | "CREDIT_CARD" | "BOLETO"
  ): {
    feePercent: Decimal;
    fixedFee: Decimal;
    totalFee: Decimal;
    netReceived: Decimal;
  } {
    const gross = this.toMoney(grossValue);
    let feePercent: Decimal;
    let fixedFee: Decimal;

    switch (gateway) {
      case "PIX":
        feePercent = new Decimal("0.99"); // 0.99% PIX dinâmico
        fixedFee = new Decimal("0.00");
        break;
      case "CREDIT_CARD":
        feePercent = new Decimal("3.49"); // 3.49% Cartão à vista
        fixedFee = new Decimal("0.49");
        break;
      case "BOLETO":
        feePercent = new Decimal("0.00");
        fixedFee = new Decimal("2.49");
        break;
    }

    const percentageFee = this.toMoney(gross.times(feePercent).dividedBy(100));
    const totalFee = this.toMoney(percentageFee.plus(fixedFee));
    const netReceived = this.toMoney(gross.minus(totalFee));

    return {
      feePercent,
      fixedFee,
      totalFee,
      netReceived,
    };
  }

  /**
   * Calcula o Take Rate do AxiomLancer (taxa sobre faturas inadimplentes recuperadas)
   * Modelo: retido estritamente sobre faturas recuperadas pelo motor
   */
  public static calculateTakeRate(
    recoveredGrossAmount: Decimal.Value,
    takeRatePercent: Decimal.Value = 5.0
  ): {
    recoveredGross: Decimal;
    takeRatePercent: Decimal;
    commissionAmount: Decimal;
    freelancerNetRecovered: Decimal;
  } {
    const recoveredGross = this.toMoney(recoveredGrossAmount);
    const rate = new Decimal(takeRatePercent);
    const commissionAmount = this.toMoney(recoveredGross.times(rate).dividedBy(100));
    const freelancerNetRecovered = this.toMoney(recoveredGross.minus(commissionAmount));

    return {
      recoveredGross,
      takeRatePercent: rate,
      commissionAmount,
      freelancerNetRecovered,
    };
  }
}
