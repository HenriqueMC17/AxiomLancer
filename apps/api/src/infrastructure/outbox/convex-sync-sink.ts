import { IRealtimeSyncSink } from './outbox-publisher.service';
import { OutboxEvent } from '../../domain/entities/outbox-event.entity';

export class ConvexHttpSyncSink implements IRealtimeSyncSink {
  constructor(
    private readonly convexUrl: string = process.env.CONVEX_URL || '',
    private readonly deployKey: string = process.env.CONVEX_DEPLOY_KEY || '',
    private readonly customFetch?: typeof fetch,
  ) {}

  /**
   * Envia o evento do Outbox para a nuvem reativa do Convex via API de mutações HTTP.
   * Se nenhuma CONVEX_URL estiver definida (ex: desenvolvimento local isolado),
   * opera em modo resiliente sem falhar.
   */
  public async publish(event: OutboxEvent): Promise<{ success: boolean; remoteId?: string; error?: string }> {
    if (!this.convexUrl) {
      return { success: true, remoteId: `offline-simulated-${event.id}` };
    }

    const fetchFn = this.customFetch || fetch;

    try {
      const response = await fetchFn(`${this.convexUrl}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.deployKey ? { Authorization: `Bearer ${this.deployKey}` } : {}),
        },
        body: JSON.stringify({
          path: 'events:processOutboxEvent',
          args: {
            eventId: event.id,
            userId: event.userId,
            eventType: event.eventType,
            aggregateType: event.aggregateType,
            aggregateId: event.aggregateId,
            payload: event.payload,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Convex HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = (await response.json()) as { value?: { docId?: string; ledgerTxId?: string } };
      return {
        success: true,
        remoteId: data?.value?.docId || data?.value?.ledgerTxId || `remote-${event.id}`,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
