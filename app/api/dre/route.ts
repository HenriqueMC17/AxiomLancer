import { Database } from "@/lib/db";
import { DREService } from "@/core/services/dre.service";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";

/**
 * GET /api/dre
 * Demonstrativo de Resultados do Exercicio (DRE) consolidado.
 * Zero Trust: Isolamento estrito de dados por session.userId.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const state = Database.getState();
    const userInvoices = state.invoices.filter((i) => i.user_id === session.userId);
    const userExpenses = state.expenses.filter((e) => e.user_id === session.userId);

    const dre = DREService.generateDRE(userInvoices, userExpenses);
    return ApiResponse.ok({ ok: true, dre });
  } catch (err) {
    return ApiResponse.error(err);
  }
});