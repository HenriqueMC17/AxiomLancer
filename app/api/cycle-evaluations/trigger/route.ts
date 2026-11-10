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
 * POST /api/cycle-evaluations/trigger
 * Dispara manualmente uma avaliacao de ciclo para um cliente especifico.
 * Requer autenticacao JWT (freelancer autenticado).
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const cycle = await service.triggerCycleEvaluation(session.userId, body);
    return ApiResponse.ok({ success: true, data: cycle }, 201);
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});