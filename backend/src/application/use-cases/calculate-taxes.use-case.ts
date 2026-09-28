import { TaxCalculatorService } from '../../domain/services/tax-calculator.service';
import { Money } from '../../domain/value-objects/money.vo';
import { CalculateTaxesInputDTO, CalculateTaxesOutputDTO } from '../dtos/tax-calculation.dto';

export class CalculateTaxesUseCase {
  constructor(private readonly taxCalculator: TaxCalculatorService = new TaxCalculatorService()) {}

  public async execute(input: CalculateTaxesInputDTO): Promise<CalculateTaxesOutputDTO> {
    const gross = Money.from(input.grossAmount);

    let result;
    if (input.taxComponents && input.taxComponents.length > 0) {
      result = this.taxCalculator.calculateDetailedBreakdown(gross, input.taxComponents);
    } else {
      const rate = input.taxRatePercent ?? '0.00';
      result = this.taxCalculator.calculateNetValue(gross, rate);
    }

    return {
      grossAmount: result.grossAmount.toDatabaseDecimal(),
      taxAmount: result.taxAmount.toDatabaseDecimal(),
      netAmount: result.netAmount.toDatabaseDecimal(),
      effectiveTaxRatePercent: result.taxRatePercent.toFixed(4),
      effectiveTaxRateDecimal: result.taxRateDecimal.toFixed(4),
      breakdown: {
        components: result.breakdown.getComponents().map((c) => ({
          name: c.name,
          ratePercent: c.ratePercent,
          amount: c.amount.toDatabaseDecimal(),
        })),
      },
    };
  }
}
