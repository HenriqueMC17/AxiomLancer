import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  processBillingTriggerSchema,
  ProcessBillingTriggerInput,
} from '../schemas/billing-trigger.schema';
import { ProcessBillingTriggerUseCase } from '../../../application/use-cases/process-billing-trigger.use-case';

export class BillingTriggerController {
  constructor(private readonly processBillingTriggerUseCase: ProcessBillingTriggerUseCase) {}

  public registerRoutes(app: FastifyInstance): void {
    app.post(
      '/api/v1/billing/trigger',
      async (
        request: FastifyRequest<{ Body: ProcessBillingTriggerInput }>,
        reply: FastifyReply,
      ) => {
        // Validação Fail Fast com Zod
        const validated = processBillingTriggerSchema.parse(request.body);

        const result = await this.processBillingTriggerUseCase.execute(validated);

        const statusCode = result.status === 'REPLAYED_FROM_CACHE' ? 200 : 201;

        return reply.status(statusCode).send({
          success: true,
          data: result,
        });
      },
    );
  }
}
