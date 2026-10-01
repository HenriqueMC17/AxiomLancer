import { OutboxEvent as PrismaOutboxEvent } from '@prisma/client';
import { OutboxEvent } from '../../../domain/entities/outbox-event.entity';

export class OutboxMapper {
  public static toDomain(raw: PrismaOutboxEvent): OutboxEvent {
    return new OutboxEvent({
      id: raw.id,
      userId: raw.userId,
      aggregateType: raw.aggregateType,
      aggregateId: raw.aggregateId,
      eventType: raw.eventType,
      payload: (raw.payload as Record<string, unknown>) || {},
      createdAt: raw.createdAt,
      processedAt: raw.processedAt,
    });
  }

  public static toPersistence(domain: OutboxEvent): any {
    return {
      id: domain.id,
      userId: domain.userId,
      aggregateType: domain.aggregateType,
      aggregateId: domain.aggregateId,
      eventType: domain.eventType,
      payload: domain.payload,
      createdAt: domain.createdAt,
      processedAt: domain.processedAt ?? null,
    };
  }
}
