import { DeduplicationJournal as PrismaJournalModel } from '@prisma/client';
import { DeduplicationJournal, DeduplicationStatus } from '../../../domain/entities/deduplication-journal.entity';
import { IdempotencyKeyVO } from '../../../domain/value-objects/idempotency-key.vo';

export class DeduplicationMapper {
  public static toDomain(raw: PrismaJournalModel): DeduplicationJournal {
    return new DeduplicationJournal({
      id: raw.id,
      idempotencyKey: IdempotencyKeyVO.from(raw.idempotencyKey),
      eventType: raw.eventType,
      status: raw.status as DeduplicationStatus,
      lockedUntil: raw.lockedUntil,
      responsePayload: (raw.responsePayload as Record<string, unknown>) || null,
      errorMessage: raw.errorMessage,
      executionCount: raw.executionCount,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(entity: DeduplicationJournal): Record<string, unknown> {
    return {
      id: entity.id,
      idempotencyKey: entity.idempotencyKey.getValue(),
      eventType: entity.eventType,
      status: entity.status,
      lockedUntil: entity.lockedUntil,
      responsePayload: entity.responsePayload || null,
      errorMessage: entity.errorMessage || null,
      executionCount: entity.executionCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
