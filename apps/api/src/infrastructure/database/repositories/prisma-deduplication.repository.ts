import { PrismaClient, Prisma } from '@prisma/client';
import {
  IDeduplicationJournalRepository,
  LockAcquisitionResult,
} from '../../../domain/repositories/deduplication-journal-repository.interface';
import { DeduplicationJournal } from '../../../domain/entities/deduplication-journal.entity';
import { DeduplicationMapper } from '../mappers/deduplication.mapper';

export class PrismaDeduplicationRepository implements IDeduplicationJournalRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  public async findByKey(idempotencyKey: string): Promise<DeduplicationJournal | null> {
    const raw = await (this.prisma as any).deduplicationJournal.findUnique({
      where: { idempotencyKey, eventId: idempotencyKey },
    });
    return raw ? DeduplicationMapper.toDomain(raw) : null;
  }

  public async acquireLock(
    idempotencyKey: string,
    eventType: string,
    lockTtlSeconds: number,
  ): Promise<LockAcquisitionResult> {
    const now = new Date();
    const lockedUntil = new Date(now.getTime() + lockTtlSeconds * 1000);

    const existing: any = await (this.prisma as any).deduplicationJournal.findUnique({
      where: { idempotencyKey, eventId: idempotencyKey },
    });

    if (!existing) {
      try {
        const created = await (this.prisma as any).deduplicationJournal.create({
          data: {
            id: idempotencyKey,
            idempotencyKey,
            eventId: idempotencyKey,
            invoiceId: idempotencyKey.includes(':') ? idempotencyKey.split(':')[0] : '00000000-0000-0000-0000-000000000000',
            eventType,
            status: 'PROCESSING',
            lockedUntil,
            executionCount: 1,
            createdAt: now,
            updatedAt: now,
            processedAt: now,
            triggerDay: now,
          },
        });

        return {
          acquired: true,
          record: DeduplicationMapper.toDomain(created),
          isCompleted: false,
        };
      } catch {
        const recheck: any = await (this.prisma as any).deduplicationJournal.findUnique({
          where: { idempotencyKey, eventId: idempotencyKey },
        });

        if (!recheck) {
          throw new Error(`Falha ao registrar deduplicação para a chave ${idempotencyKey}`);
        }

        return {
          acquired: false,
          record: DeduplicationMapper.toDomain(recheck),
          isCompleted: recheck.status === 'COMPLETED',
          cachedResponse: recheck.responsePayload || null,
        };
      }
    }

    if (existing.status === 'COMPLETED') {
      return {
        acquired: false,
        record: DeduplicationMapper.toDomain(existing),
        isCompleted: true,
        cachedResponse: existing.responsePayload || null,
      };
    }

    // Se estiver em processamento mas o lock expirou, tenta renovar via CAS atômico
    if (existing.status === 'PROCESSING' && existing.lockedUntil && new Date(existing.lockedUntil) < now) {
      const updated = await (this.prisma as any).deduplicationJournal.updateMany({
        where: {
          idempotencyKey,
          status: 'PROCESSING',
          lockedUntil: existing.lockedUntil,
        },
        data: {
          lockedUntil,
          executionCount: (existing.executionCount || 1) + 1,
          updatedAt: now,
        },
      });

      if (updated.count === 1) {
        const refreshed: any = await (this.prisma as any).deduplicationJournal.findUnique({
          where: { idempotencyKey, eventId: idempotencyKey },
        });

        return {
          acquired: true,
          record: DeduplicationMapper.toDomain(refreshed || existing),
          isCompleted: false,
        };
      }

      return {
        acquired: false,
        record: DeduplicationMapper.toDomain(existing),
        isCompleted: false,
      };
    }

    return {
      acquired: false,
      record: DeduplicationMapper.toDomain(existing),
      isCompleted: false,
    };
  }

  public async save(journal: DeduplicationJournal): Promise<void> {
    const data = DeduplicationMapper.toPersistence(journal);
    await (this.prisma as any).deduplicationJournal.create({
      data,
    });
  }

  public async update(journal: DeduplicationJournal): Promise<void> {
    await (this.prisma as any).deduplicationJournal.update({
      where: { eventId: journal.idempotencyKey.getValue(), idempotencyKey: journal.idempotencyKey.getValue() },
      data: {
        processedAt: new Date(),
      },
    });
  }
}
