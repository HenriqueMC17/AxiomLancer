import { PrismaClient, Prisma } from '@prisma/client';
import { IOutboxRepository } from '../../../domain/repositories/outbox-repository.interface';
import { OutboxEvent } from '../../../domain/entities/outbox-event.entity';
import { OutboxMapper } from '../mappers/outbox.mapper';

export class PrismaOutboxRepository implements IOutboxRepository {
  constructor(private readonly client: PrismaClient | Prisma.TransactionClient) {}

  public async save(event: OutboxEvent): Promise<void> {
    const data = OutboxMapper.toPersistence(event);
    await (this.client as any).outboxEvent.create({
      data,
    });
  }

  public async fetchPendingEvents(limit: number = 50): Promise<OutboxEvent[]> {
    const rawEvents = await (this.client as any).outboxEvent.findMany({
      where: {
        processedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
    });

    return rawEvents.map(OutboxMapper.toDomain);
  }

  public async markAsProcessed(eventId: string, processedAt: Date = new Date()): Promise<void> {
    await (this.client as any).outboxEvent.update({
      where: {
        id: eventId,
      },
      data: {
        processedAt,
      },
    });
  }
}
