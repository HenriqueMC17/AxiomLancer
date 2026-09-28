import { describe, it, expect } from 'vitest';
import { CalculateTaxesUseCase } from '../../../src/application/use-cases/calculate-taxes.use-case';

describe('CalculateTaxesUseCase', () => {
  const useCase = new CalculateTaxesUseCase();

  it('deve calcular impostos para o DTO de entrada', async () => {
    const output = await useCase.execute({
      grossAmount: '5000.00',
      taxRatePercent: '6.00',
    });

    expect(output.grossAmount).toBe('5000.00');
    expect(output.taxAmount).toBe('300.00');
    expect(output.netAmount).toBe('4700.00');
    expect(output.effectiveTaxRatePercent).toBe('6.0000');
    expect(output.effectiveTaxRateDecimal).toBe('0.0600');
  });

  it('deve calcular breakdown analítico quando componentes forem fornecidos', async () => {
    const output = await useCase.execute({
      grossAmount: '10000.00',
      taxComponents: [
        { name: 'ISS', ratePercent: '2.50' },
        { name: 'IRRF', ratePercent: '1.50' },
      ],
    });

    expect(output.grossAmount).toBe('10000.00');
    expect(output.taxAmount).toBe('400.00');
    expect(output.netAmount).toBe('9600.00');
    expect(output.breakdown.components.length).toBe(2);
  });
});
