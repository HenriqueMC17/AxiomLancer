import { Database } from "@/lib/db";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";

/**
 * GET /api/billing-rules
 * Retorna as reguas de cobranca ativas configuradas para o usuario autenticado.
 * Zero Trust: Isolamento estrito por session.userId.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const state = Database.getState();
    const userRules = state.rules.filter((r) => !r.user_id || r.user_id === session.userId);
    return ApiResponse.ok({ rules: userRules });
  } catch (err) {
    return ApiResponse.error(err);
  }
});