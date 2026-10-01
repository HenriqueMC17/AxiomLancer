import { IOutboxRepository } from '../../domain/repositories/outbox-repository.interface';
import { OutboxEvent } from '../../domain/entities/outbox-event.entity';

export interface IRealtimeSyncSink {
  publish(event: OutboxEvent): Promise<{ success: boolean; remoteId?: string; error?: string }>;
}

export class InMemorySyncSink implements IRealtimeSyncSink {
  public receivedEvents: OutboxEvent[] = [];

  public async publish(event: OutboxEvent): Promise<{ success: boolean; remoteId?: string }> {
    this.receivedEvents.push(event);
    return { success: true, remoteId: `sink-${event.id}` };
  }
}

export interface OutboxDispatchReport {
  totalFetched: number;
  totalPublished: number;
  totalFailed: number;
  errors: Array<{ eventId: string; error: string }>;
}

export class OutboxPublisherService {
  constructor(
    private readonly outboxRepository: IOutboxRepository,
    private readonly syncSink: IRealtimeSyncSink = new InMemorySyncSink(),
  ) {}

  /**
   * Varre a tabela de outbox no PostgreSQL, despacha os eventos pendentes para
   * a esteira reativa do Convex Cloud e marca os registros processados.
   */
  public async dispatchPending(batchSize: number = 50): Promise<OutboxDispatchReport> {
    const pendingEvents = await this.outboxRepository.fetchPendingEvents(batchSize);
    let publishedCount = 0;
    let failedCount = 0;
    const errors: Array<{ eventId: string; error: string }> = [];

    for (const event of pendingEvents) {
      try {
        const result = await this.syncSink.publish(event);
        if (result.success) {
          await this.outboxRepository.markAsProcessed(event.id, new Date());
          publishedCount++;
        } else {
          failedCount++;
          errors.push({
            eventId: event.id,
            error: result.error || 'Falha desconhecida no sink reativo.',
          });
        }
      } catch (err: unknown) {
        failedCount++;
        errors.push({
          eventId: event.id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return {
      totalFetched: pendingEvents.length,
      totalPublished: publishedCount,
      totalFailed: failedCount,
      errors,
    };
  }
}
