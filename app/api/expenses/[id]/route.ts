import { updateExpenseSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { NotFoundError } from "@/core/errors/app-error";
import { InMemoryExpenseRepository } from "@/infrastructure/repositories/in-memory/in-memory-expense.repository";

const expenseRepo = new InMemoryExpenseRepository();

export const PUT = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const id = params?.id || (new URL(req.url).pathname.split("/").at(-1) ?? "");
    const body = await req.json();
    const parsed = updateExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const updated = await expenseRepo.update(id, session.userId, parsed.data);
    if (!updated) {
      return ApiResponse.error(new NotFoundError("Despesa", id));
    }

    return ApiResponse.ok({ expense: updated });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

export const DELETE = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const id = params?.id || (new URL(req.url).pathname.split("/").at(-1) ?? "");
    const deleted = await expenseRepo.delete(id, session.userId);
    if (!deleted) {
      return ApiResponse.error(new NotFoundError("Despesa", id));
    }

    return ApiResponse.ok({ ok: true });
  } catch (err) {
    return ApiResponse.error(err);
  }
});