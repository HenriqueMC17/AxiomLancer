import { IOutboxRepository } from '../../src/domain/repositories/outbox-repository.interface';
import { OutboxEvent } from '../../src/domain/entities/outbox-event.entity';

export class MockOutboxRepository implements IOutboxRepository {
  public events: OutboxEvent[] = [];

  public async save(event: OutboxEvent): Promise<void> {
    this.events.push(event);
  }

  public async fetchPendingEvents(limit: number = 50): Promise<OutboxEvent[]> {
    return this.events.filter((e) => !e.isProcessed()).slice(0, limit);
  }

  public async markAsProcessed(eventId: string, processedAt: Date = new Date()): Promise<void> {
    const event = this.events.find((e) => e.id === eventId);
    if (event) {
      event.markAsProcessed(processedAt);
    }
  }
}
