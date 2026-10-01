import { ILedgerRepository } from '../../src/domain/repositories/ledger-repository.interface';
import { LedgerTransaction } from '../../src/domain/entities/ledger-transaction.entity';
import { AccountCategory } from '../../src/domain/value-objects/ledger-entry.vo';
import { Money } from '../../src/domain/value-objects/money.vo';

export class MockLedgerRepository implements ILedgerRepository {
  public transactions: LedgerTransaction[] = [];

  public async findById(id: string): Promise<LedgerTransaction | null> {
    return this.transactions.find((tx) => tx.id === id) || null;
  }

  public async findByUserId(
    userId: string,
    filters?: { category?: AccountCategory; fromDate?: Date; toDate?: Date },
  ): Promise<LedgerTransaction[]> {
    return this.transactions.filter((tx) => {
      if (tx.userId !== userId) return false;
      if (filters?.category && tx.accountCategory !== filters.category) return false;
      if (filters?.fromDate && tx.transactionDate < filters.fromDate) return false;
      if (filters?.toDate && tx.transactionDate > filters.toDate) return false;
      return true;
    });
  }

  public async findByCorrelationId(correlationId: string): Promise<LedgerTransaction[]> {
    return this.transactions.filter((tx) => tx.correlationId === correlationId);
  }

  public async getAccountBalance(userId: string, category: AccountCategory): Promise<Money> {
    const list = this.transactions
      .filter((tx) => tx.userId === userId && tx.accountCategory === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return list.length > 0 ? list[0].balanceAfter : Money.zero();
  }

  public async getConsolidatedBalance(userId: string): Promise<Money> {
    const asset = await this.getAccountBalance(userId, 'ASSET');
    const tax = await this.getAccountBalance(userId, 'TAX_RESERVE');
    return asset.subtract(tax);
  }

  public async save(transaction: LedgerTransaction): Promise<void> {
    this.transactions.push(transaction);
  }

  public async saveBatch(transactions: LedgerTransaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }
}
