import { LedgerTransaction as PrismaLedgerModel } from '@prisma/client';
import { LedgerTransaction } from '../../../domain/entities/ledger-transaction.entity';
import { LedgerEntryTypeVO, AccountCategory } from '../../../domain/value-objects/ledger-entry.vo';
import { Money } from '../../../domain/value-objects/money.vo';

export class LedgerMapper {
  public static toDomain(raw: PrismaLedgerModel): LedgerTransaction {
    const isCredit = raw.type === 'INCOME' || raw.type === 'REFUND';
    return new LedgerTransaction({
      id: raw.id,
      userId: raw.userId,
      invoiceId: raw.invoiceId,
      expenseId: raw.expenseId,
      entryType: LedgerEntryTypeVO.from(isCredit ? 'CREDIT' : 'DEBIT'),
      accountCategory: 'ASSET' as AccountCategory,
      amount: Money.from(raw.amount.toString()),
      balanceAfter: Money.from(raw.amount.toString()),
      description: raw.externalId || 'Transação Contábil Ledger',
      correlationId: raw.externalId,
      transactionDate: raw.occurredAt,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(entity: LedgerTransaction): Record<string, unknown> {
    const isCredit = entity.entryType.getValue() === 'CREDIT';
    return {
      id: entity.id,
      occurredAt: entity.transactionDate || entity.createdAt,
      userId: entity.userId,
      invoiceId: entity.invoiceId || null,
      expenseId: entity.expenseId || null,
      type: isCredit ? 'INCOME' : 'EXPENSE',
      amount: entity.amount.toDatabaseDecimal(),
      externalId: entity.correlationId || null,
      createdAt: entity.createdAt,
    };
  }
}
