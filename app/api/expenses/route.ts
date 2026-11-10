import { Expense } from "@/core/domain/types";
import { createExpenseSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { InMemoryExpenseRepository } from "@/infrastructure/repositories/in-memory/in-memory-expense.repository";

const expenseRepo = new InMemoryExpenseRepository();

/**
 * GET /api/expenses
 * Retorna as despesas operacionais vinculadas exclusivamente ao session.userId.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const expenses = await expenseRepo.listByUser(session.userId);
    return ApiResponse.ok({ expenses });
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

    const created = await expenseRepo.create(newExpense);
    return ApiResponse.ok({ expense: created }, 201);
  } catch (err) {
    return ApiResponse.error(err);
  }
});