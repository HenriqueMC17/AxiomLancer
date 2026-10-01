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
        try {
          const summary = await this.getDashboardSummaryUseCase.execute(userId);
          return reply.status(200).send({
            success: true,
            data: summary,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes("Can't reach database server") || message.includes('P1001')) {
            app.log.warn('[BFF] PostgreSQL offline em localhost:5432. Retornando projeção para desenvolvimento local.');
            return reply.status(200).send({
              success: true,
              data: GetDashboardSummaryUseCase.getFallbackSummary(),
              _meta: { offlineMode: true, message: 'Banco PostgreSQL offline em localhost:5432' },
            });
          }
          throw err;
        }
      },
    );

    // 2. Métricas Chave Isoladas para HUD/Widgets
    app.get(
      '/api/v1/dashboard/metrics',
      async (request: FastifyRequest<{ Querystring: { userId?: string } }>, reply: FastifyReply) => {
        const userId = request.query.userId || '00000000-0000-0000-0000-000000000001';
        try {
          const summary = await this.getDashboardSummaryUseCase.execute(userId);
          return reply.status(200).send({
            success: true,
            data: summary.metrics,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes("Can't reach database server") || message.includes('P1001')) {
            const fallback = GetDashboardSummaryUseCase.getFallbackSummary();
            return reply.status(200).send({
              success: true,
              data: fallback.metrics,
              _meta: { offlineMode: true, message: 'Banco PostgreSQL offline em localhost:5432' },
            });
          }
          throw err;
        }
      },
    );
  }
}
