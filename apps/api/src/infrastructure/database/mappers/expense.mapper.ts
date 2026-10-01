import { Expense as PrismaExpenseModel } from '@prisma/client';
import { Expense } from '../../../domain/entities/expense.entity';
import { Money } from '../../../domain/value-objects/money.vo';

export class ExpenseMapper {
  public static toDomain(raw: PrismaExpenseModel): Expense {
    return new Expense({
      id: raw.id,
      userId: raw.userId,
      description: raw.description,
      category: raw.category,
      amount: Money.from(raw.amount.toString()),
      taxDeductible: false,
      date: raw.dueDate || raw.createdAt,
      receiptUrl: null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt || undefined,
    });
  }

  public static toPersistence(entity: Expense): Record<string, unknown> {
    return {
      id: entity.id,
      userId: entity.userId,
      description: entity.description,
      category: entity.category,
      amount: entity.amount.toDatabaseDecimal(),
      dueDate: entity.date,
      status: 'PENDING',
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
