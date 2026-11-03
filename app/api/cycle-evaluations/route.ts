import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { CycleEvaluationService } from "@/core/services/cycle-evaluation.service";
import { AppError } from "@/core/errors/app-error";

const service = new CycleEvaluationService();

/**
 * GET /api/cycle-evaluations
 * Lista todas as avaliacoes de ciclo do freelancer autenticado.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const cycles = await service.listByUser(session.userId);
    return NextResponse.json({ success: true, data: cycles }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});