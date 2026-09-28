import { LedgerTransaction as PrismaLedgerModel } from '@prisma/client';
import { LedgerTransaction } from '../../../domain/entities/ledger-transaction.entity';
import { LedgerEntryTypeVO, AccountCategory } from '../../../domain/value-objects/ledger-entry.vo';
import { Money } from '../../../domain/value-objects/money.vo';

export class LedgerMapper {
  public static toDomain(raw: PrismaLedgerModel): LedgerTransaction {
    return new LedgerTransaction({
      id: raw.id,
      userId: raw.userId,
      invoiceId: raw.invoiceId,
      expenseId: raw.expenseId,
      entryType: LedgerEntryTypeVO.from(raw.entryType),
      accountCategory: raw.accountCategory as AccountCategory,
      amount: Money.from(raw.amount.toString()),
      balanceAfter: Money.from(raw.balanceAfter.toString()),
      description: raw.description,
      correlationId: raw.correlationId,
      transactionDate: raw.transactionDate,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(entity: LedgerTransaction): Record<string, unknown> {
    return {
      id: entity.id,
      userId: entity.userId,
      invoiceId: entity.invoiceId || null,
      expenseId: entity.expenseId || null,
      entryType: entity.entryType.getValue(),
      accountCategory: entity.accountCategory,
      amount: entity.amount.toDatabaseDecimal(),
      balanceAfter: entity.balanceAfter.toDatabaseDecimal(),
      description: entity.description,
      correlationId: entity.correlationId || null,
      transactionDate: entity.transactionDate,
      createdAt: entity.createdAt,
    };
  }
}
