import { OutboxEvent } from '../entities/outbox-event.entity';

export interface IOutboxRepository {
  save(event: OutboxEvent): Promise<void>;
  fetchPendingEvents(limit?: number): Promise<OutboxEvent[]>;
  markAsProcessed(eventId: string, processedAt?: Date): Promise<void>;
}
