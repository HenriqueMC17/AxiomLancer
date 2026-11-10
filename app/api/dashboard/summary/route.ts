import { withAuth } from "@/app/api/_lib/withAuth";
import { Database } from "@/lib/db";
import { DashboardSummaryService } from "@/core/services/dashboard-summary.service";
import { ApiResponse } from "@/lib/api-response";

/**
 * GET /api/dashboard/summary
 * Consolida Entradas (Invoices) e Saidas Operacionais (OPEX), calculando Margem de Lucro Real com precisao decimal.js.
 * Zero Trust: Isolamento estrito por session.userId.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const state = Database.getState();
    const userInvoices = state.invoices.filter((i) => i.user_id === session.userId);
    const userExpenses = state.expenses.filter((e) => e.user_id === session.userId);

    const summary = DashboardSummaryService.calculateSummary(userInvoices, userExpenses);

    return ApiResponse.ok({
      ok: true,
      summary,
    });
  } catch (err) {
    return ApiResponse.error(err);
  }
});