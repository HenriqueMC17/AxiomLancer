import { randomUUID } from 'crypto';
import {
  IDeduplicationJournalRepository,
  LockAcquisitionResult,
} from '../../src/domain/repositories/deduplication-journal-repository.interface';
import { DeduplicationJournal } from '../../src/domain/entities/deduplication-journal.entity';
import { IdempotencyKeyVO } from '../../src/domain/value-objects/idempotency-key.vo';

export class MockDeduplicationRepository implements IDeduplicationJournalRepository {
  public records: Map<string, DeduplicationJournal> = new Map();

  public async findByKey(idempotencyKey: string): Promise<DeduplicationJournal | null> {
    return this.records.get(idempotencyKey) || null;
  }

  public async acquireLock(
    idempotencyKey: string,
    eventType: string,
    lockTtlSeconds: number,
  ): Promise<LockAcquisitionResult> {
    const now = new Date();
    const existing = this.records.get(idempotencyKey);

    if (!existing) {
      const lockedUntil = new Date(now.getTime() + lockTtlSeconds * 1000);
      const record = new DeduplicationJournal({
        id: randomUUID(),
        idempotencyKey: IdempotencyKeyVO.from(idempotencyKey),
        eventType,
        status: 'PROCESSING',
        lockedUntil,
        executionCount: 1,
      });

      this.records.set(idempotencyKey, record);

      return {
        acquired: true,
        record,
        isCompleted: false,
      };
    }

    if (existing.isCompleted()) {
      return {
        acquired: false,
        record: existing,
        isCompleted: true,
        cachedResponse: existing.responsePayload || null,
      };
    }

    if (existing.isLocked(now)) {
      return {
        acquired: false,
        record: existing,
        isCompleted: false,
      };
    }

    // Lock expirou ou estava FAILED -> adquire lock renovando
    const lockedUntil = new Date(now.getTime() + lockTtlSeconds * 1000);
    existing.renewLock(lockedUntil, now);
    this.records.set(idempotencyKey, existing);

    return {
      acquired: true,
      record: existing,
      isCompleted: false,
    };
  }

  public async save(journal: DeduplicationJournal): Promise<void> {
    this.records.set(journal.idempotencyKey.getValue(), journal);
  }

  public async update(journal: DeduplicationJournal): Promise<void> {
    this.records.set(journal.idempotencyKey.getValue(), journal);
  }
}
