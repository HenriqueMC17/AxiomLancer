import { PrismaClient, Prisma } from '@prisma/client';
import { ILedgerRepository } from '../../../domain/repositories/ledger-repository.interface';
import { LedgerTransaction } from '../../../domain/entities/ledger-transaction.entity';
import { AccountCategory } from '../../../domain/value-objects/ledger-entry.vo';
import { Money } from '../../../domain/value-objects/money.vo';
import { LedgerMapper } from '../mappers/ledger.mapper';

export class PrismaLedgerRepository implements ILedgerRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  public async findById(id: string): Promise<LedgerTransaction | null> {
    const raw = await this.prisma.ledgerTransaction.findUnique({
      where: { id },
    });
    return raw ? LedgerMapper.toDomain(raw) : null;
  }

  public async findByUserId(
    userId: string,
    filters?: { category?: AccountCategory; fromDate?: Date; toDate?: Date },
  ): Promise<LedgerTransaction[]> {
    const where: Prisma.LedgerTransactionWhereInput = { userId };

    if (filters?.category) {
      where.accountCategory = filters.category;
    }

    if (filters?.fromDate || filters?.toDate) {
      where.transactionDate = {};
      if (filters.fromDate) where.transactionDate.gte = filters.fromDate;
      if (filters.toDate) where.transactionDate.lte = filters.toDate;
    }

    const rawList = await this.prisma.ledgerTransaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
    });

    return rawList.map(LedgerMapper.toDomain);
  }

  public async findByCorrelationId(correlationId: string): Promise<LedgerTransaction[]> {
    const rawList = await this.prisma.ledgerTransaction.findMany({
      where: { correlationId },
      orderBy: { createdAt: 'asc' },
    });
    return rawList.map(LedgerMapper.toDomain);
  }

  public async getAccountBalance(userId: string, category: AccountCategory): Promise<Money> {
    const lastTransaction = await this.prisma.ledgerTransaction.findFirst({
      where: { userId, accountCategory: category },
      orderBy: { createdAt: 'desc' },
    });

    return lastTransaction ? Money.from(lastTransaction.balanceAfter.toString()) : Money.zero();
  }

  public async getConsolidatedBalance(userId: string): Promise<Money> {
    const assetBalance = await this.getAccountBalance(userId, 'ASSET');
    const taxReserve = await this.getAccountBalance(userId, 'TAX_RESERVE');
    // Saldo disponível = Ativo bancário/caixa
    return assetBalance.subtract(taxReserve);
  }

  public async save(transaction: LedgerTransaction): Promise<void> {
    const data = LedgerMapper.toPersistence(transaction);
    await this.prisma.ledgerTransaction.create({
      data: data as unknown as Prisma.LedgerTransactionCreateInput,
    });
  }

  public async saveBatch(transactions: LedgerTransaction[]): Promise<void> {
    const dataList = transactions.map(LedgerMapper.toPersistence);
    await this.prisma.ledgerTransaction.createMany({
      data: dataList as unknown as Prisma.LedgerTransactionCreateManyInput[],
    });
  }
}
