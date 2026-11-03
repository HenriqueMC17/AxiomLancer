import { Database } from "@/lib/db";
import { Expense } from "@/core/domain/types";
import { createExpenseSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";

/**
 * GET /api/expenses
 * Retorna as despesas operacionais vinculadas exclusivamente ao session.userId.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const state = Database.getState();
    const userExpenses = state.expenses.filter((e) => e.user_id === session.userId);
    return ApiResponse.ok({ expenses: userExpenses });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/expenses
 * Registra nova despesa operacional associada estritamente ao session.userId.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const parsed = createExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const state = Database.getState();
    const newExpense: Expense = {
      id: "exp_" + Date.now(),
      user_id: session.userId,
      description: parsed.data.description,
      category: parsed.data.category,
      amount: parsed.data.amount,
      due_date: parsed.data.due_date,
      status: "PENDING",
      is_fixed: parsed.data.is_fixed ?? false,
      created_at: new Date().toISOString(),
    };

    state.expenses.unshift(newExpense);
    return ApiResponse.ok({ expense: newExpense }, 201);
  } catch (err) {
    return ApiResponse.error(err);
  }
});
