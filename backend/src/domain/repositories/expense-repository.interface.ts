import { Expense } from '../entities/expense.entity';

export interface IExpenseRepository {
  findById(id: string): Promise<Expense | null>;
  findByUserId(userId: string, filters?: { category?: string; dateFrom?: Date; dateTo?: Date }): Promise<Expense[]>;
  save(expense: Expense): Promise<void>;
}
