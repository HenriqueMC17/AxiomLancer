import { describe, it, expect } from 'vitest';
import { TaxCalculatorService } from '../../../src/domain/services/tax-calculator.service';
import { Money } from '../../../src/domain/value-objects/money.vo';
import { InvalidTaxRateError, InvalidMoneyError } from '../../../src/domain/errors/domain.error';

describe('TaxCalculatorService (Deterministic Tax & Invariant Verification)', () => {
  const service = new TaxCalculatorService();

  it('deve satisfazer a regra fundamental: Valor Líquido = Valor Bruto - Impostos', () => {
    const gross = Money.from('10000.00');
    const rate = '6.00'; // 6%

    const result = service.calculateNetValue(gross, rate);

    expect(result.grossAmount.toDatabaseDecimal()).toBe('10000.00');
    expect(result.taxAmount.toDatabaseDecimal()).toBe('600.00');
    expect(result.netAmount.toDatabaseDecimal()).toBe('9400.00');

    // Invariante inegociável
    expect(result.netAmount.equals(result.grossAmount.subtract(result.taxAmount))).toBe(true);
    expect(result.grossAmount.equals(result.netAmount.add(result.taxAmount))).toBe(true);
  });

  it('deve calcular impostos para valores fracionários com dízimas periódicas sem perder centavos', () => {
    // R$ 3.333,33 com alíquota de 13,45%
    // 3333.33 * 0.1345 = 448.332885 -> 448.33
    // Líquido = 3333.33 - 448.33 = 2885.00
    const gross = Money.from('3333.33');
    const rate = '13.45';

    const result = service.calculateNetValue(gross, rate);

    expect(result.taxAmount.toDatabaseDecimal()).toBe('448.33');
    expect(result.netAmount.toDatabaseDecimal()).toBe('2885.00');

    // Reconstituição exata do bruto
    const sum = result.netAmount.add(result.taxAmount);
    expect(sum.equals(gross)).toBe(true);
  });

  it('deve lidar corretamente com alíquota de 0% (Isenção / MEI)', () => {
    const gross = Money.from('5000.00');
    const result = service.calculateNetValue(gross, '0.00');

    expect(result.taxAmount.toDatabaseDecimal()).toBe('0.00');
    expect(result.netAmount.toDatabaseDecimal()).toBe('5000.00');
    expect(result.grossAmount.equals(result.netAmount)).toBe(true);
  });

  it('deve lidar com alíquota de 100% (caso extremo)', () => {
    const gross = Money.from('1000.00');
    const result = service.calculateNetValue(gross, '100.00');

    expect(result.taxAmount.toDatabaseDecimal()).toBe('1000.00');
    expect(result.netAmount.toDatabaseDecimal()).toBe('0.00');
  });

  it('deve lidar com valor bruto zerado (0.00)', () => {
    const gross = Money.zero();
    const result = service.calculateNetValue(gross, '6.00');

    expect(result.grossAmount.isZero()).toBe(true);
    expect(result.taxAmount.isZero()).toBe(true);
    expect(result.netAmount.isZero()).toBe(true);
  });

  it('deve calcular breakdown analítico detalhado (ISS, PIS, COFINS, IRRF, CSLL)', () => {
    const gross = Money.from('20000.00');
    const components = [
      { name: 'ISS', ratePercent: '3.00' },     // 600.00
      { name: 'PIS', ratePercent: '0.65' },     // 130.00
      { name: 'COFINS', ratePercent: '3.00' },  // 600.00
      { name: 'IRRF', ratePercent: '1.50' },    // 300.00
      { name: 'CSLL', ratePercent: '1.00' },    // 200.00
    ]; // Total = 9.15% -> 1830.00

    const result = service.calculateDetailedBreakdown(gross, components);

    expect(result.taxAmount.toDatabaseDecimal()).toBe('1830.00');
    expect(result.netAmount.toDatabaseDecimal()).toBe('18170.00');
    expect(result.taxRatePercent.toFixed(2)).toBe('9.15');

    // Valida cada componente individual
    const breakdownComponents = result.breakdown.getComponents();
    expect(breakdownComponents.length).toBe(5);
    expect(breakdownComponents.find((c) => c.name === 'ISS')?.amount.toDatabaseDecimal()).toBe('600.00');
    expect(breakdownComponents.find((c) => c.name === 'PIS')?.amount.toDatabaseDecimal()).toBe('130.00');

    // Invariante absoluta
    expect(result.grossAmount.equals(result.netAmount.add(result.taxAmount))).toBe(true);
  });

  it('deve lançar InvalidTaxRateError se a alíquota for negativa ou superior a 100%', () => {
    const gross = Money.from('1000.00');
    expect(() => service.calculateNetValue(gross, '-1.0')).toThrow(InvalidTaxRateError);
    expect(() => service.calculateNetValue(gross, '100.01')).toThrow(InvalidTaxRateError);
  });

  it('deve lançar InvalidMoneyError se o valor bruto for negativo no cálculo simples', () => {
    const negativeGross = Money.from('-100.00');
    expect(() => service.calculateNetValue(negativeGross, '6.00')).toThrow(InvalidMoneyError);
  });

  it('deve lançar InvalidMoneyError se o valor bruto for negativo no breakdown detalhado', () => {
    const negativeGross = Money.from('-50.00');
    expect(() =>
      service.calculateDetailedBreakdown(negativeGross, [{ name: 'ISS', ratePercent: '2.00' }]),
    ).toThrow(InvalidMoneyError);
  });
});
