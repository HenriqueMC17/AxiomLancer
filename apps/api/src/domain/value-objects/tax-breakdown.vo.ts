import { Decimal } from 'decimal.js';
import { Money } from './money.vo';
import { InvalidTaxRateError } from '../errors/domain.error';

export interface TaxComponentInput {
  name: string;
  ratePercent: string | Decimal; // Ex: "2.0" para 2.0%
}

export interface TaxComponentCalculated {
  name: string;
  ratePercent: string;
  amount: Money;
}

export class TaxBreakdown {
  private readonly components: ReadonlyArray<TaxComponentCalculated>;
  private readonly totalTaxAmount: Money;
  private readonly effectiveRatePercent: Decimal;

  private constructor(
    components: TaxComponentCalculated[],
    totalTaxAmount: Money,
    effectiveRatePercent: Decimal,
  ) {
    this.components = Object.freeze(components);
    this.totalTaxAmount = totalTaxAmount;
    this.effectiveRatePercent = effectiveRatePercent;
  }

  /**
   * Constrói breakdown a partir de uma alíquota única (ex: Simples Nacional 6.00%)
   */
  public static fromSingleRate(grossAmount: Money, ratePercent: string | Decimal): TaxBreakdown {
    const rateDec = ratePercent instanceof Decimal ? ratePercent : new Decimal(ratePercent);

    if (rateDec.isNegative() || rateDec.greaterThan(100)) {
      throw new InvalidTaxRateError('Alíquota deve estar entre 0% e 100%.');
    }

    const taxAmount = grossAmount.percentage(rateDec, true);

    const component: TaxComponentCalculated = {
      name: 'SIMPLES_NACIONAL',
      ratePercent: rateDec.toFixed(4),
      amount: taxAmount,
    };

    return new TaxBreakdown([component], taxAmount, rateDec);
  }

  /**
   * Constrói breakdown a partir de múltiplos componentes (ISS, PIS, COFINS, etc.)
   */
  public static fromComponents(grossAmount: Money, componentsInput: TaxComponentInput[]): TaxBreakdown {
    let cumulativeRate = new Decimal(0);
    const calculatedComponents: TaxComponentCalculated[] = [];
    let runningTotalTax = Money.zero();

    for (const comp of componentsInput) {
      const rateDec = comp.ratePercent instanceof Decimal ? comp.ratePercent : new Decimal(comp.ratePercent);

      if (rateDec.isNegative() || rateDec.greaterThan(100)) {
        throw new InvalidTaxRateError(`Alíquota '${comp.name}' deve estar entre 0% e 100%.`);
      }

      cumulativeRate = cumulativeRate.plus(rateDec);
      if (cumulativeRate.greaterThan(100)) {
        throw new InvalidTaxRateError('A soma de todas as alíquotas não pode exceder 100%.');
      }

      const compAmount = grossAmount.percentage(rateDec, true);
      runningTotalTax = runningTotalTax.add(compAmount);

      calculatedComponents.push({
        name: comp.name.toUpperCase().trim(),
        ratePercent: rateDec.toFixed(4),
        amount: compAmount,
      });
    }

    return new TaxBreakdown(calculatedComponents, runningTotalTax, cumulativeRate);
  }

  public getTotalTaxAmount(): Money {
    return this.totalTaxAmount;
  }

  public getEffectiveRatePercent(): Decimal {
    return this.effectiveRatePercent;
  }

  public getEffectiveRateDecimal(): Decimal {
    // Retorna a alíquota em formato fracionário (ex: 6% -> 0.0600)
    return this.effectiveRatePercent.dividedBy(100);
  }

  public getComponents(): ReadonlyArray<TaxComponentCalculated> {
    return this.components;
  }

  public toJSON(): Record<string, unknown> {
    return {
      effectiveRatePercent: this.effectiveRatePercent.toFixed(4),
      effectiveRateDecimal: this.getEffectiveRateDecimal().toFixed(4),
      totalTaxAmount: this.totalTaxAmount.toDatabaseDecimal(),
      components: this.components.map((c) => ({
        name: c.name,
        ratePercent: c.ratePercent,
        amount: c.amount.toDatabaseDecimal(),
      })),
    };
  }
}
