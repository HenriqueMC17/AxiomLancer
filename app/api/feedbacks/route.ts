import { z } from "zod";
import { withAuth } from "@/app/api/_lib/withAuth";
import { Database } from "@/lib/db";
import { ScoreRecalculationWorker } from "@/infrastructure/jobs/score-recalculation.worker";
import { ProjectFeedback } from "@/core/domain/types";
import { ApiResponse } from "@/lib/api-response";
import { NotFoundError } from "@/core/errors/app-error";

const createFeedbackSchema = z.object({
  project_id: z.string().min(1, "ID do projeto obrigatorio"),
  score: z.number().min(0, "O score minimo e 0.00").max(5, "O score maximo e 5.00"),
  comments: z.string().optional(),
});

/**
 * GET /api/feedbacks
 * Retorna os feedbacks de projetos do usuario autenticado.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const feedbacks = Database.getFeedbacks(session.userId);
    return ApiResponse.ok({ feedbacks });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/feedbacks
 * Submete nova avaliacao de projeto e dispara atualizacao assincrona em background (BullMQ Pattern).
 * Zero Trust: Validacao estrita de posse do projeto pelo session.userId.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const parsed = createFeedbackSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const state = Database.getState();
    const project = state.projects.find((p) => p.id === parsed.data.project_id);
    if (!project || project.user_id !== session.userId) {
      throw new NotFoundError("Projeto", parsed.data.project_id);
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

    return ApiResponse.ok(
      {
        feedback: newFeedback,
        message: "Feedback submetido com sucesso. Recalculo do score enfileirado em background.",
      },
      201
    );
  } catch (err) {
    return ApiResponse.error(err);
  }
});