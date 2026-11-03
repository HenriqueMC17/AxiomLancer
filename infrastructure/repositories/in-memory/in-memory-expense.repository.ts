import { IExpenseRepository } from "@/core/domain/ports/repositories/expense.repository.port";
import { Expense } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryExpenseRepository implements IExpenseRepository {
  public async listByUser(userId: string): Promise<Expense[]> {
    const state = Database.getState();
    return state.expenses.filter((e) => e.user_id === userId);
  }

  public async findById(id: string, userId: string): Promise<Expense | null> {
    const state = Database.getState();
    const found = state.expenses.find((e) => e.id === id && e.user_id === userId);
    return found ? { ...found } : null;
  }

  public async create(expense: Expense): Promise<Expense> {
    const state = Database.getState();
    state.expenses.unshift({ ...expense });
    return { ...expense };
  }

  public async update(id: string, userId: string, data: Partial<Expense>): Promise<Expense | null> {
    const state = Database.getState();
    const idx = state.expenses.findIndex((e) => e.id === id && e.user_id === userId);
    if (idx === -1) return null;
    state.expenses[idx] = { ...state.expenses[idx], ...data };
    return { ...state.expenses[idx] };
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const state = Database.getState();
    const idx = state.expenses.findIndex((e) => e.id === id && e.user_id === userId);
    if (idx === -1) return false;
    state.expenses.splice(idx, 1);
    return true;
  }
}
