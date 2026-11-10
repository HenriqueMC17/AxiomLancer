import { NextRequest } from "next/server";
import { CycleEvaluationService } from "@/core/services/cycle-evaluation.service";
import { InMemoryCycleEvaluationRepository } from "@/infrastructure/repositories/in-memory/in-memory-cycle-evaluation.repository";
import { InMemoryContractRepository } from "@/infrastructure/repositories/in-memory/in-memory-contract.repository";
import { ApiResponse } from "@/lib/api-response";

const service = new CycleEvaluationService(
  new InMemoryCycleEvaluationRepository(),
  new InMemoryContractRepository()
);

/**
 * GET /api/cycle-evaluations/[token]
 * Rota PUBLICA: Retorna os dados do ciclo para renderizacao do formulario de feedback.
 * Acessada pelo cliente via link de e-mail - nao requer JWT.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const cycle = await service.getByToken(token);
    return ApiResponse.ok({
      success: true,
      data: {
        id: cycle.id,
        cycle_identifier: cycle.cycle_identifier,
        trigger_type: cycle.trigger_type,
        status: cycle.status,
        client_id: cycle.client_id,
        invitation_sent_at: cycle.invitation_sent_at,
        completed_at: cycle.completed_at,
      },
    });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
}

/**
 * POST /api/cycle-evaluations/[token]
 * Rota PUBLICA: Recebe a submissao do formulario de feedback do cliente.
 * Valida via Zod antes de persistir (Fail Fast).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const result = await service.submitFeedback({ ...body, invitation_token: token });
    return ApiResponse.ok({ success: true, data: result });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
}