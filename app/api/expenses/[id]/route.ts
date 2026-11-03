import { Database } from "@/lib/db";
import { updateExpenseSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { NotFoundError } from "@/core/errors/app-error";

export const PUT = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const id = params?.id || (new URL(req.url).pathname.split("/").at(-1) ?? "");
    const body = await req.json();
    const parsed = updateExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const state = Database.getState();
    const idx = state.expenses.findIndex((e) => e.id === id && e.user_id === session.userId);
    if (idx === -1) {
      return ApiResponse.error(new NotFoundError("Despesa", id));
    }

    state.expenses[idx] = { ...state.expenses[idx], ...parsed.data };
    return ApiResponse.ok({ expense: state.expenses[idx] });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

export const DELETE = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const id = params?.id || (new URL(req.url).pathname.split("/").at(-1) ?? "");
    const state = Database.getState();
    const idx = state.expenses.findIndex((e) => e.id === id && e.user_id === session.userId);
    if (idx === -1) {
      return ApiResponse.error(new NotFoundError("Despesa", id));
    }

    state.expenses.splice(idx, 1);
    return ApiResponse.ok({ ok: true });
  } catch (err) {
    return ApiResponse.error(err);
  }
});
