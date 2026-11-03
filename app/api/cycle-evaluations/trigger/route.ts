import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { CycleEvaluationService } from "@/core/services/cycle-evaluation.service";
import { AppError } from "@/core/errors/app-error";

const service = new CycleEvaluationService();

/**
 * POST /api/cycle-evaluations/trigger
 * Dispara manualmente uma avaliacao de ciclo para um cliente especifico.
 * Requer autenticacao JWT (freelancer autenticado).
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const cycle = await service.triggerCycleEvaluation(session.userId, body);
    return NextResponse.json({ success: true, data: cycle }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});