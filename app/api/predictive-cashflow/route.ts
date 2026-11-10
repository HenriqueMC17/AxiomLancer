import { z } from "zod";
import { Database } from "@/lib/db";
import { PredictiveCashflowService } from "@/core/services/predictive-cashflow.service";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";

const querySchema = z.object({
  horizon: z.coerce.number().int().min(7, "Horizonte minimo de 7 dias").max(90, "Horizonte maximo de 90 dias").default(30),
});

/**
 * GET /api/predictive-cashflow
 * Projecao preditiva de fluxo de caixa baseada em historico, faturas e despesas.
 * Zero Trust: Isolamento estrito por session.userId e validacao de input via Zod.
 */
export const GET = withAuth(async (req, { session }) => {
  try {
    const { searchParams } = new URL(req.url);
    const rawHorizon = searchParams.get("horizon");
    const parsed = querySchema.safeParse({
      horizon: rawHorizon ?? 30,
    });

    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const state = Database.getState();
    const userInvoices = state.invoices.filter((i) => i.user_id === session.userId);
    const userExpenses = state.expenses.filter((e) => e.user_id === session.userId);
    const userClients = state.clients.filter((c) => c.user_id === session.userId);

    const result = PredictiveCashflowService.generateProjection(
      state.accountBalance,
      userInvoices,
      userExpenses,
      userClients,
      parsed.data.horizon
    );

    return ApiResponse.ok({ ok: true, ...result });
  } catch (err) {
    return ApiResponse.error(err);
  }
});