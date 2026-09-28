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
      taxDeductible: raw.taxDeductible,
      date: raw.date,
      receiptUrl: raw.receiptUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(entity: Expense): Record<string, unknown> {
    return {
      id: entity.id,
      userId: entity.userId,
      description: entity.description,
      category: entity.category,
      amount: entity.amount.toDatabaseDecimal(),
      taxDeductible: entity.taxDeductible,
      date: entity.date,
      receiptUrl: entity.receiptUrl || null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
