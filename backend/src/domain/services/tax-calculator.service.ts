import { Decimal } from 'decimal.js';
import { Money } from '../value-objects/money.vo';
import { TaxBreakdown, TaxComponentInput } from '../value-objects/tax-breakdown.vo';
import { InvalidTaxRateError, InvalidMoneyError } from '../errors/domain.error';

export interface TaxCalculationResult {
  grossAmount: Money;
  taxRatePercent: Decimal;
  taxRateDecimal: Decimal; // Ex: 0.0600 para 6%
  taxAmount: Money;
  netAmount: Money;
  breakdown: TaxBreakdown;
}

export class TaxCalculatorService {
  /**
   * Realiza o cálculo determinístico de impostos sobre o valor bruto.
   * Regra Central: Valor Líquido = Valor Bruto - Impostos
   * Invariante Absoluta: grossAmount === netAmount + taxAmount
   *
   * @param grossAmount Valor bruto da prestação de serviços
   * @param taxRatePercent Alíquota percentual (ex: "6.0" ou 6% ou Decimal(6))
   */
  public calculateNetValue(
    grossAmount: Money,
    taxRatePercent: string | Decimal,
  ): TaxCalculationResult {
    if (grossAmount.isNegative()) {
      throw new InvalidMoneyError('O valor bruto não pode ser negativo.');
    }

    const rateDec = taxRatePercent instanceof Decimal ? taxRatePercent : new Decimal(taxRatePercent);

    if (rateDec.isNegative() || rateDec.greaterThan(100)) {
      throw new InvalidTaxRateError('A alíquota de imposto deve estar entre 0% e 100%.');
    }

    // Se o valor bruto for zero, todos os montantes resultantes são zero
    if (grossAmount.isZero()) {
      const zeroBreakdown = TaxBreakdown.fromSingleRate(Money.zero(), rateDec);
      return {
        grossAmount: Money.zero(),
        taxRatePercent: rateDec,
        taxRateDecimal: rateDec.dividedBy(100),
        taxAmount: Money.zero(),
        netAmount: Money.zero(),
        breakdown: zeroBreakdown,
      };
    }

    // Cálculo exato: Imposto = Bruto * (Alíquota / 100)
    const breakdown = TaxBreakdown.fromSingleRate(grossAmount, rateDec);
    const taxAmount = breakdown.getTotalTaxAmount();

    // Regra pétrea: Valor Líquido = Valor Bruto - Impostos
    const netAmount = grossAmount.subtract(taxAmount);

    // Verificação de segurança da invariante contábil (Fail Fast)
    const reconstitutedGross = netAmount.add(taxAmount);
    if (!reconstitutedGross.equals(grossAmount)) {
      throw new Error(
        `Falha na integridade aritmética: Bruto (${grossAmount.toDatabaseDecimal()}) ` +
        `diverge da soma Líquido + Imposto (${reconstitutedGross.toDatabaseDecimal()}).`
      );
    }

    return {
      grossAmount,
      taxRatePercent: rateDec,
      taxRateDecimal: rateDec.dividedBy(100),
      taxAmount,
      netAmount,
      breakdown,
    };
  }

  /**
   * Realiza o cálculo analítico com múltiplos componentes fiscais (ISS, PIS, COFINS, IRRF, CSLL).
   * Assegura que o arredondamento seja estritamente reconciliado no total final.
   */
  public calculateDetailedBreakdown(
    grossAmount: Money,
    components: TaxComponentInput[],
  ): TaxCalculationResult {
    if (grossAmount.isNegative()) {
      throw new InvalidMoneyError('O valor bruto não pode ser negativo.');
    }

    const breakdown = TaxBreakdown.fromComponents(grossAmount, components);
    const taxAmount = breakdown.getTotalTaxAmount();
    const netAmount = grossAmount.subtract(taxAmount);

    const reconstitutedGross = netAmount.add(taxAmount);
    if (!reconstitutedGross.equals(grossAmount)) {
      throw new Error('Falha na integridade aritmética do breakdown detalhado.');
    }

    return {
      grossAmount,
      taxRatePercent: breakdown.getEffectiveRatePercent(),
      taxRateDecimal: breakdown.getEffectiveRateDecimal(),
      taxAmount,
      netAmount,
      breakdown,
    };
  }
}
