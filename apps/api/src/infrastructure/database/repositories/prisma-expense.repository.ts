import { PrismaClient, Prisma } from '@prisma/client';
import { IExpenseRepository } from '../../../domain/repositories/expense-repository.interface';
import { Expense } from '../../../domain/entities/expense.entity';
import { ExpenseMapper } from '../mappers/expense.mapper';

export class PrismaExpenseRepository implements IExpenseRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  public async findById(id: string): Promise<Expense | null> {
    const raw = await this.prisma.expense.findUnique({ where: { id } });
    return raw ? ExpenseMapper.toDomain(raw) : null;
  }

  public async findByUserId(
    userId: string,
    filters?: { category?: string; dateFrom?: Date; dateTo?: Date },
  ): Promise<Expense[]> {
    const where: Prisma.ExpenseWhereInput = { userId };
    if (filters?.category) where.category = filters.category;
    if (filters?.dateFrom || filters?.dateTo) {
      where.dueDate = {};
      if (filters.dateFrom) where.dueDate.gte = filters.dateFrom;
      if (filters.dateTo) where.dueDate.lte = filters.dateTo;
    }

    const rawList = await this.prisma.expense.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return rawList.map(ExpenseMapper.toDomain);
  }

  public async save(expense: Expense): Promise<void> {
    const data = ExpenseMapper.toPersistence(expense);
    await this.prisma.expense.create({
      data: data as unknown as Prisma.ExpenseCreateInput,
    });
  }
}
