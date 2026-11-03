import { Expense } from "@/core/domain/types";

/**
 * Port (interface) para o repositorio de Despesas Profissionais e OPEX.
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 */
export interface IExpenseRepository {
  listByUser(userId: string): Promise<Expense[]>;
  findById(id: string, userId: string): Promise<Expense | null>;
  create(expense: Expense): Promise<Expense>;
  update(id: string, userId: string, data: Partial<Expense>): Promise<Expense | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
