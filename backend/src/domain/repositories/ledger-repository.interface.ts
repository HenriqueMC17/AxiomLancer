import { LedgerTransaction } from '../entities/ledger-transaction.entity';
import { AccountCategory } from '../value-objects/ledger-entry.vo';
import { Money } from '../value-objects/money.vo';

export interface ILedgerRepository {
  findById(id: string): Promise<LedgerTransaction | null>;
  findByUserId(userId: string, filters?: { category?: AccountCategory; fromDate?: Date; toDate?: Date }): Promise<LedgerTransaction[]>;
  findByCorrelationId(correlationId: string): Promise<LedgerTransaction[]>;
  getAccountBalance(userId: string, category: AccountCategory): Promise<Money>;
  getConsolidatedBalance(userId: string): Promise<Money>;
  save(transaction: LedgerTransaction): Promise<void>;
  saveBatch(transactions: LedgerTransaction[]): Promise<void>;
}
