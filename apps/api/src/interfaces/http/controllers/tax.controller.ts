import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { calculateTaxesSchema, CalculateTaxesInput } from '../schemas/tax.schema';
import { CalculateTaxesUseCase } from '../../../application/use-cases/calculate-taxes.use-case';

export class TaxController {
  constructor(private readonly calculateTaxesUseCase: CalculateTaxesUseCase = new CalculateTaxesUseCase()) {}

  public registerRoutes(app: FastifyInstance): void {
    app.post(
      '/api/v1/taxes/calculate',
      async (request: FastifyRequest<{ Body: CalculateTaxesInput }>, reply: FastifyReply) => {
        // Validação Fail Fast com Zod
        const validated = calculateTaxesSchema.parse(request.body);

        const result = await this.calculateTaxesUseCase.execute({
          grossAmount: validated.grossAmount,
          taxRatePercent: validated.taxRatePercent,
          taxComponents: validated.taxComponents,
        });

        return reply.status(200).send({
          success: true,
          data: result,
        });
      },
    );
  }
}
