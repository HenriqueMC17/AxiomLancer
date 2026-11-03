import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { Database } from "@/lib/db";
import { ReputationScoreService } from "@/core/services/reputation-score.service";

const service = new ReputationScoreService();

/**
 * GET /api/profile/score
 * Retorna o score consolidado do freelancer, media de projetos e ciclos de avaliacao.
 */
export const GET = withAuth(async (_req, { session }) => {
  const feedbacks = Database.getFeedbacks(session.userId);
  const cycles = Database.getCycleEvaluations(session.userId);

  const calculation = service.calculateOverallScore(feedbacks, cycles);

  return NextResponse.json({
    score: calculation.overallScore,
    details: calculation,
  });
});