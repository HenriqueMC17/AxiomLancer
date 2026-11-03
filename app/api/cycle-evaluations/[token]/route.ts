import { NextRequest, NextResponse } from "next/server";
import { CycleEvaluationService } from "@/core/services/cycle-evaluation.service";
import { AppError } from "@/core/errors/app-error";

const service = new CycleEvaluationService();

/**
 * GET /api/cycle-evaluations/[token]
 * Rota PUBLICA: Retorna os dados do ciclo para renderizacao do formulario de feedback.
 * Acessada pelo cliente via link de e-mail — nao requer JWT.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const cycle = await service.getByToken(token);
    return NextResponse.json({
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
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
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
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}