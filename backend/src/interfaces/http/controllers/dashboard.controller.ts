import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { GetDashboardSummaryUseCase } from '../../../application/use-cases/get-dashboard-summary.use-case';

export class DashboardController {
  constructor(private readonly getDashboardSummaryUseCase: GetDashboardSummaryUseCase) {}

  public registerRoutes(app: FastifyInstance): void {
    // 1. Resumo Completo do Dashboard (Telemetria, BI, Faturas e Ledger)
    app.get(
      '/api/v1/dashboard/summary',
      async (request: FastifyRequest<{ Querystring: { userId?: string } }>, reply: FastifyReply) => {
        const userId = request.query.userId || '00000000-0000-0000-0000-000000000001';
        const summary = await this.getDashboardSummaryUseCase.execute(userId);

        return reply.status(200).send({
          success: true,
          data: summary,
        });
      },
    );

    // 2. Métricas Chave Isoladas para HUD/Widgets
    app.get(
      '/api/v1/dashboard/metrics',
      async (request: FastifyRequest<{ Querystring: { userId?: string } }>, reply: FastifyReply) => {
        const userId = request.query.userId || '00000000-0000-0000-0000-000000000001';
        const summary = await this.getDashboardSummaryUseCase.execute(userId);

        return reply.status(200).send({
          success: true,
          data: summary.metrics,
        });
      },
    );
  }
}
