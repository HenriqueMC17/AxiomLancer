import { describe, it, expect } from 'vitest';
import { Money } from '../../../src/domain/value-objects/money.vo';
import { InvalidMoneyError } from '../../../src/domain/errors/domain.error';
import { Decimal } from 'decimal.js';

describe('Money Value Object (Zero Float Flaws & Strict Precision)', () => {
  it('deve eliminar a clássica anomalia de ponto flutuante do JavaScript (0.1 + 0.2)', () => {
    // No JS puro: 0.1 + 0.2 === 0.30000000000000004
    const m1 = Money.from('0.10');
    const m2 = Money.from('0.20');
    const result = m1.add(m2);

    expect(result.toDatabaseDecimal()).toBe('0.30');
    expect(result.equals(Money.from('0.30'))).toBe(true);
  });

  it('deve somar e subtrair valores monetários com precisão exata', () => {
    const a = Money.from('1500.55');
    const b = Money.from('499.45');

    const sum = a.add(b);
    expect(sum.toDatabaseDecimal()).toBe('2000.00');

    const sub = a.subtract(b);
    expect(sub.toDatabaseDecimal()).toBe('1001.10');
  });

  it('deve multiplicar e dividir preservando duas casas decimais e arredondamento HALF_UP', () => {
    const price = Money.from('100.00');

    // 100 * 1.055 = 105.50
    const multiplied = price.multiply('1.055');
    expect(multiplied.toDatabaseDecimal()).toBe('105.50');

    // Divisão de 100 por 3 = 33.33333... -> normalizado para 33.33
    const divided = price.divide('3');
    expect(divided.toDatabaseDecimal()).toBe('33.33');
  });

  it('deve calcular porcentagem determinística', () => {
    const total = Money.from('10000.00');
    // 6% de 10.000,00 = 600,00
    const tax = total.percentage('6.0');
    expect(tax.toDatabaseDecimal()).toBe('600.00');

    // 13.45% de 3.333,33 = 448.332885 -> 448.33
    const complexTotal = Money.from('3333.33');
    const complexTax = complexTotal.percentage('13.45');
    expect(complexTax.toDatabaseDecimal()).toBe('448.33');
  });

  it('deve converter corretamente para centavos inteiros (BigInt)', () => {
    const money = Money.from('1234.56');
    expect(money.toCentavos()).toBe(BigInt(123456));

    const fromCentavos = Money.fromCentavos(BigInt(123456));
    expect(fromCentavos.toDatabaseDecimal()).toBe('1234.56');

    const fromCentavosStr = Money.fromCentavos('123456');
    expect(fromCentavosStr.toDatabaseDecimal()).toBe('1234.56');

    // Rejeita centavos fracionados (Zero Float)
    expect(() => Money.fromCentavos('1234.56')).toThrow(InvalidMoneyError);
  });

  it('deve comparar grandezas monetárias com exatidão', () => {
    const small = Money.from('10.00');
    const large = Money.from('100.00');
    const duplicate = Money.from('10.00');

    expect(small.lessThan(large)).toBe(true);
    expect(large.greaterThan(small)).toBe(true);
    expect(small.equals(duplicate)).toBe(true);
    expect(small.greaterThanOrEqual(duplicate)).toBe(true);
    expect(small.lessThanOrEqual(large)).toBe(true);
    expect(small.toDecimal().toFixed(2)).toBe('10.00');
  });

  it('deve rejeitar valores malformados, NaN ou caracteres inválidos', () => {
    expect(() => Money.from('abc')).toThrow(InvalidMoneyError);
    expect(() => Money.from('')).toThrow(InvalidMoneyError);
    expect(() => Money.from('12.34.56')).toThrow(InvalidMoneyError);
    expect(() => Money.from(new Decimal(NaN))).toThrow(InvalidMoneyError);
  });

  it('deve rejeitar divisão por zero', () => {
    const m = Money.from('100.00');
    expect(() => m.divide('0')).toThrow(InvalidMoneyError);
  });

  it('deve identificar zero, positivo e negativo', () => {
    expect(Money.zero().isZero()).toBe(true);
    expect(Money.from('10.00').isPositive()).toBe(true);
    expect(Money.from('-5.00').isNegative()).toBe(true);
  });
});
