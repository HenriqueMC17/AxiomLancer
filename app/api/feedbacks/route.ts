import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/app/api/_lib/withAuth";
import { Database } from "@/lib/db";
import { ScoreRecalculationWorker } from "@/infrastructure/jobs/score-recalculation.worker";
import { ProjectFeedback } from "@/core/domain/types";

const createFeedbackSchema = z.object({
  project_id: z.string().min(1, "ID do projeto obrigatorio"),
  score: z.number().min(0).max(5, "O score deve estar entre 0.00 e 5.00"),
  comments: z.string().optional(),
});

/**
 * POST /api/feedbacks
 * Submete nova avaliacao de projeto e dispara atualizacao assincrona em background (BullMQ Pattern).
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const parsed = createFeedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload invalido", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newFeedback: ProjectFeedback = {
      id: `fb_${Date.now()}`,
      user_id: session.userId,
      project_id: parsed.data.project_id,
      score: parsed.data.score,
      comments: parsed.data.comments,
      created_at: new Date().toISOString(),
    };

    // Grava feedback no banco
    Database.addFeedback(newFeedback);

    // Disparo Assincrono em Background (Non-blocking): Recalcula o score sem degradar a latencia da API
    ScoreRecalculationWorker.enqueue({
      userId: session.userId,
      triggeredBy: "PROJECT_FEEDBACK",
      sourceId: newFeedback.id,
    });

    return NextResponse.json(
      {
        feedback: newFeedback,
        message: "Feedback submetido com sucesso. Recalculo do score enfileirado em background.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});