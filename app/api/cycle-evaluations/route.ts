import { withAuth } from "@/app/api/_lib/withAuth";
import { CycleEvaluationService } from "@/core/services/cycle-evaluation.service";
import { InMemoryCycleEvaluationRepository } from "@/infrastructure/repositories/in-memory/in-memory-cycle-evaluation.repository";
import { InMemoryContractRepository } from "@/infrastructure/repositories/in-memory/in-memory-contract.repository";
import { ApiResponse } from "@/lib/api-response";

const service = new CycleEvaluationService(
  new InMemoryCycleEvaluationRepository(),
  new InMemoryContractRepository()
);

/**
 * GET /api/cycle-evaluations
 * Lista todas as avaliacoes de ciclo do freelancer autenticado.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const cycles = await service.listByUser(session.userId);
    return ApiResponse.ok({ success: true, data: cycles });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});