import { PrismaClient, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  IDeduplicationJournalRepository,
  LockAcquisitionResult,
} from '../../../domain/repositories/deduplication-journal-repository.interface';
import { DeduplicationJournal } from '../../../domain/entities/deduplication-journal.entity';
import { DeduplicationMapper } from '../mappers/deduplication.mapper';

export class PrismaDeduplicationRepository implements IDeduplicationJournalRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  public async findByKey(idempotencyKey: string): Promise<DeduplicationJournal | null> {
    const raw = await this.prisma.deduplicationJournal.findUnique({
      where: { idempotencyKey },
    });
    return raw ? DeduplicationMapper.toDomain(raw) : null;
  }

  /**
   * Aquisição Atômica e Determinística de Lock de Idempotência no PostgreSQL
   * Implementa Compare-and-Swap (CAS) para eliminar Race Conditions (TOCTOU).
   */
  public async acquireLock(
    idempotencyKey: string,
    eventType: string,
    lockTtlSeconds: number,
  ): Promise<LockAcquisitionResult> {
    const now = new Date();
    const lockedUntil = new Date(now.getTime() + lockTtlSeconds * 1000);

    const existing = await this.prisma.deduplicationJournal.findUnique({
      where: { idempotencyKey },
    });

    if (!existing) {
      // 1. Tentativa de inserção atômica inicial
      try {
        const created = await this.prisma.deduplicationJournal.create({
          data: {
            id: randomUUID(),
            idempotencyKey,
            eventType,
            status: 'PROCESSING',
            lockedUntil,
            executionCount: 1,
            createdAt: now,
            updatedAt: now,
          },
        });

        return {
          acquired: true,
          record: DeduplicationMapper.toDomain(created),
          isCompleted: false,
        };
      } catch (err: unknown) {
        // Concorrência estrita: colisão na Unique Constraint P2002
        const recheck = await this.prisma.deduplicationJournal.findUnique({
          where: { idempotencyKey },
        });

        if (recheck?.status === 'COMPLETED') {
          return {
            acquired: false,
            record: DeduplicationMapper.toDomain(recheck),
            isCompleted: true,
            cachedResponse: (recheck.responsePayload as Record<string, unknown>) || null,
          };
        }

        return {
          acquired: false,
          record: DeduplicationMapper.toDomain(recheck!),
          isCompleted: false,
        };
      }
    }

    // 2. Se já foi processado com sucesso, retorna replay seguro do cache (Anti-Spam)
    if (existing.status === 'COMPLETED') {
      return {
        acquired: false,
        record: DeduplicationMapper.toDomain(existing),
        isCompleted: true,
        cachedResponse: (existing.responsePayload as Record<string, unknown>) || null,
      };
    }

    // 3. Se estiver em processamento ativo dentro do TTL de concessão, bloqueia a execução concorrente
    if (existing.status === 'PROCESSING' && existing.lockedUntil.getTime() > now.getTime()) {
      return {
        acquired: false,
        record: DeduplicationMapper.toDomain(existing),
        isCompleted: false,
      };
    }

    // 4. Se o lock expirou ou se estava FAILED, executa renovação com UPDATE CONDICIONAL ATÔMICO (CAS)
    // Isso garante que se 2 workers tentarem renovar simultaneamente, exatamente 1 terá count === 1
    const updateResult = await this.prisma.deduplicationJournal.updateMany({
      where: {
        idempotencyKey,
        OR: [
          { status: 'FAILED' },
          { status: 'PROCESSING', lockedUntil: { lte: now } },
        ],
      },
      data: {
        status: 'PROCESSING',
        lockedUntil,
        executionCount: { increment: 1 },
        updatedAt: now,
      },
    });

    if (updateResult.count === 0) {
      // Outro worker concorrente adquiriu o lock um instante antes
      const latest = await this.prisma.deduplicationJournal.findUnique({
        where: { idempotencyKey },
      });
      return {
        acquired: false,
        record: DeduplicationMapper.toDomain(latest!),
        isCompleted: latest?.status === 'COMPLETED',
        cachedResponse: (latest?.responsePayload as Record<string, unknown>) || null,
      };
    }

    // Lock adquirido com exclusividade garantida pelo PostgreSQL
    const fresh = await this.prisma.deduplicationJournal.findUnique({
      where: { idempotencyKey },
    });

    return {
      acquired: true,
      record: DeduplicationMapper.toDomain(fresh!),
      isCompleted: false,
    };
  }

  public async save(journal: DeduplicationJournal): Promise<void> {
    const data = DeduplicationMapper.toPersistence(journal);
    await this.prisma.deduplicationJournal.create({
      data: data as unknown as Prisma.DeduplicationJournalCreateInput,
    });
  }

  public async update(journal: DeduplicationJournal): Promise<void> {
    const data = DeduplicationMapper.toPersistence(journal);
    await this.prisma.deduplicationJournal.update({
      where: { idempotencyKey: journal.idempotencyKey.getValue() },
      data: data as unknown as Prisma.DeduplicationJournalUpdateInput,
    });
  }
}
