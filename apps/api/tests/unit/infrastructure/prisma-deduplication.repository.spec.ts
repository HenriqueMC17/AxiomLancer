import { describe, it, expect, vi } from 'vitest';
import { PrismaDeduplicationRepository } from '../../../src/infrastructure/database/repositories/prisma-deduplication.repository';
import { PrismaClient } from '@prisma/client';

describe('PrismaDeduplicationRepository (PostgreSQL Atomic CAS & Deduplication)', () => {
  it('deve adquirir novo lock criando registro quando chave não existir', async () => {
    const mockPrisma = {
      deduplicationJournal: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockImplementation((args) => Promise.resolve({
          ...args.data,
          id: 'uuid-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      },
    } as unknown as PrismaClient;

    const repo = new PrismaDeduplicationRepository(mockPrisma);
    const result = await repo.acquireLock('BILLING:INV-1:DAY_0', 'TEST', 300);

    expect(result.acquired).toBe(true);
    expect(result.isCompleted).toBe(false);
    expect(mockPrisma.deduplicationJournal.create).toHaveBeenCalled();
  });

  it('deve retornar replay do cache sem adquirir lock se já estiver COMPLETED', async () => {
    const mockPrisma = {
      deduplicationJournal: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'uuid-1',
          idempotencyKey: 'BILLING:INV-1:DAY_0',
          eventType: 'TEST',
          status: 'COMPLETED',
          lockedUntil: new Date(),
          responsePayload: { status: 'SENT', deliveredAt: '2026-09-27' },
          executionCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    } as unknown as PrismaClient;

    const repo = new PrismaDeduplicationRepository(mockPrisma);
    const result = await repo.acquireLock('BILLING:INV-1:DAY_0', 'TEST', 300);

    expect(result.acquired).toBe(false);
    expect(result.isCompleted).toBe(true);
    expect(result.cachedResponse).toEqual({ status: 'SENT', deliveredAt: '2026-09-27' });
  });

  it('deve renovar atomicamente via CAS (updateMany condicional) quando lock expirou', async () => {
    const pastDate = new Date(Date.now() - 10000);
    const mockPrisma = {
      deduplicationJournal: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce({
            id: 'uuid-1',
            idempotencyKey: 'BILLING:INV-EXPIRED',
            eventType: 'TEST',
            status: 'PROCESSING',
            lockedUntil: pastDate, // Expirado
            executionCount: 1,
            createdAt: pastDate,
            updatedAt: pastDate,
          })
          .mockResolvedValueOnce({
            id: 'uuid-1',
            idempotencyKey: 'BILLING:INV-EXPIRED',
            eventType: 'TEST',
            status: 'PROCESSING',
            lockedUntil: new Date(Date.now() + 300000),
            executionCount: 2,
            createdAt: pastDate,
            updatedAt: new Date(),
          }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }), // CAS bem-sucedido
      },
    } as unknown as PrismaClient;

    const repo = new PrismaDeduplicationRepository(mockPrisma);
    const result = await repo.acquireLock('BILLING:INV-EXPIRED', 'TEST', 300);

    expect(result.acquired).toBe(true);
    expect(mockPrisma.deduplicationJournal.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          idempotencyKey: 'BILLING:INV-EXPIRED',
        }),
      }),
    );
  });

  it('deve rejeitar lock se outro processo concorrente vencer o CAS (updateMany.count === 0)', async () => {
    const pastDate = new Date(Date.now() - 10000);
    const mockPrisma = {
      deduplicationJournal: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce({
            id: 'uuid-1',
            idempotencyKey: 'BILLING:INV-RACE',
            eventType: 'TEST',
            status: 'PROCESSING',
            lockedUntil: pastDate,
            executionCount: 1,
            createdAt: pastDate,
            updatedAt: pastDate,
          })
          .mockResolvedValueOnce({
            id: 'uuid-1',
            idempotencyKey: 'BILLING:INV-RACE',
            eventType: 'TEST',
            status: 'PROCESSING',
            lockedUntil: new Date(Date.now() + 300000),
            executionCount: 2,
            createdAt: pastDate,
            updatedAt: new Date(),
          }),
        updateMany: vi.fn().mockResolvedValue({ count: 0 }), // Perdeu a corrida para outro worker!
      },
    } as unknown as PrismaClient;

    const repo = new PrismaDeduplicationRepository(mockPrisma);
    const result = await repo.acquireLock('BILLING:INV-RACE', 'TEST', 300);

    // Deve bloquear a execução pois perdeu o CAS
    expect(result.acquired).toBe(false);
  });
});
