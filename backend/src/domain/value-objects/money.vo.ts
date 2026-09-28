import { Decimal } from 'decimal.js';
import { InvalidMoneyError } from '../errors/domain.error';

// Configuração global de precisão para operações monetárias enterprise
Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
});

export class Money {
  private readonly value: Decimal;

  private constructor(val: Decimal) {
    if (val.isNaN() || !val.isFinite()) {
      throw new InvalidMoneyError('Valor monetário não pode ser NaN ou infinito.');
    }
    // Sempre normaliza para 2 casas decimais no padrão financeiro bancário/fiscal
    this.value = val.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }

  /**
   * Cria instância de Money a partir de string, Decimal ou outro Money.
   * Evita intencionalmente o tipo number nativo para eliminar imprecisão de IEEE 754.
   */
  public static from(input: string | Decimal | Money): Money {
    if (input instanceof Money) {
      return input;
    }

    if (input instanceof Decimal) {
      return new Money(input);
    }

    if (typeof input === 'string') {
      const sanitized = input.trim();
      if (sanitized === '' || !/^-?\d+(\.\d+)?$/.test(sanitized)) {
        throw new InvalidMoneyError(`Formato numérico inválido: "${input}". Use strings decimais como "1500.50".`);
      }
      return new Money(new Decimal(sanitized));
    }

    throw new InvalidMoneyError('Tipo de entrada inválido para Money. Utilize string ou Decimal.');
  }

  /**
   * Instância de valor zero (0.00)
   */
  public static zero(): Money {
    return new Money(new Decimal(0));
  }

  /**
   * Cria a partir de centavos inteiros (ex: 150050 centavos = R$ 1500.50).
   * Restrito a bigint ou string inteira para risco zero de injeção de floats IEEE 754.
   */
  public static fromCentavos(centavos: bigint | string): Money {
    const str = typeof centavos === 'bigint' ? centavos.toString() : centavos.trim();
    if (!/^-?\d+$/.test(str)) {
      throw new InvalidMoneyError(`Centavos devem ser um valor inteiro estrito sem frações: "${centavos}".`);
    }
    const dec = new Decimal(str).dividedBy(100);
    return new Money(dec);
  }

  public add(other: Money): Money {
    return new Money(this.value.plus(other.value));
  }

  public subtract(other: Money): Money {
    return new Money(this.value.minus(other.value));
  }

  public multiply(factor: Decimal | string): Money {
    const factorDec = factor instanceof Decimal ? factor : new Decimal(factor);
    if (factorDec.isNaN() || !factorDec.isFinite()) {
      throw new InvalidMoneyError('Fator de multiplicação inválido.');
    }
    return new Money(this.value.times(factorDec));
  }

  public divide(divisor: Decimal | string): Money {
    const divisorDec = divisor instanceof Decimal ? divisor : new Decimal(divisor);
    if (divisorDec.isZero()) {
      throw new InvalidMoneyError('Divisão por zero não permitida no cálculo monetário.');
    }
    return new Money(this.value.dividedBy(divisorDec));
  }

  /**
   * Calcula percentual sobre o valor (ex: rate = 6% -> ratePercent = 6 ou 0.06)
   * Se for percentual nominal (ex: 6.5 para 6.5%), passe ratePercent = "6.5" e isNominal = true
   */
  public percentage(ratePercent: Decimal | string, isNominal: boolean = true): Money {
    const rate = ratePercent instanceof Decimal ? ratePercent : new Decimal(ratePercent);
    const multiplier = isNominal ? rate.dividedBy(100) : rate;
    return new Money(this.value.times(multiplier));
  }

  public abs(): Money {
    return new Money(this.value.abs());
  }

  public equals(other: Money): boolean {
    return this.value.equals(other.value);
  }

  public greaterThan(other: Money): boolean {
    return this.value.greaterThan(other.value);
  }

  public greaterThanOrEqual(other: Money): boolean {
    return this.value.greaterThanOrEqualTo(other.value);
  }

  public lessThan(other: Money): boolean {
    return this.value.lessThan(other.value);
  }

  public lessThanOrEqual(other: Money): boolean {
    return this.value.lessThanOrEqualTo(other.value);
  }

  public isZero(): boolean {
    return this.value.isZero();
  }

  public isPositive(): boolean {
    return this.value.isPositive() && !this.value.isZero();
  }

  public isNegative(): boolean {
    return this.value.isNegative() && !this.value.isZero();
  }

  public toDecimal(): Decimal {
    return this.value;
  }

  public toFixed(places: number = 2): string {
    return this.value.toFixed(places);
  }

  public toDatabaseDecimal(): string {
    return this.value.toFixed(2);
  }

  public toCentavos(): bigint {
    return BigInt(this.value.times(100).toFixed(0));
  }

  public toFormattedString(currency: string = 'BRL'): string {
    return `${currency} ${this.value.toFixed(2)}`;
  }
}
