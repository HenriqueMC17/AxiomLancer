import { DeduplicationJournal as PrismaJournalModel } from '@prisma/client';
import { DeduplicationJournal, DeduplicationStatus } from '../../../domain/entities/deduplication-journal.entity';
import { IdempotencyKeyVO } from '../../../domain/value-objects/idempotency-key.vo';

export class DeduplicationMapper {
  public static toDomain(raw: PrismaJournalModel | Record<string, unknown>): DeduplicationJournal {
    const rawAny = raw as Record<string, unknown>;
    const key = (rawAny['idempotencyKey'] as string) || (rawAny['eventId'] as string) || 'DEFAULT_KEY';
    return new DeduplicationJournal({
      id: (rawAny['id'] as string) || (rawAny['eventId'] as string) || key,
      idempotencyKey: IdempotencyKeyVO.from(key),
      eventType: (rawAny['eventType'] as string) || 'BILLING_TRIGGER',
      status: (rawAny['status'] as DeduplicationStatus) || 'COMPLETED',
      lockedUntil: (rawAny['lockedUntil'] as Date) || (rawAny['processedAt'] as Date) || new Date(),
      responsePayload: (rawAny['responsePayload'] as Record<string, unknown>) || null,
      errorMessage: (rawAny['errorMessage'] as string) || null,
      executionCount: (rawAny['executionCount'] as number) || 1,
      createdAt: (rawAny['createdAt'] as Date) || (rawAny['processedAt'] as Date) || new Date(),
      updatedAt: (rawAny['updatedAt'] as Date) || (rawAny['processedAt'] as Date) || new Date(),
    });
  }

  public static toPersistence(entity: DeduplicationJournal): Record<string, unknown> {
    return {
      eventId: entity.idempotencyKey.getValue(),
      invoiceId: entity.id,
      triggerDay: new Date(),
      processedAt: entity.createdAt,
    };
  }
}
