import { describe, it, expect, vi } from 'vitest';
import { ConvexHttpSyncSink } from '../../../src/infrastructure/outbox/convex-sync-sink';
import { OutboxEvent } from '../../../src/domain/entities/outbox-event.entity';

describe('ConvexHttpSyncSink', () => {
  const dummyEvent = new OutboxEvent({
    id: 'evt-test-123',
    userId: '11111111-1111-1111-1111-111111111111',
    eventType: 'INVOICE_CREATED',
    aggregateType: 'Invoice',
    aggregateId: 'inv-test-123',
    payload: { id: 'inv-test-123', grossAmount: '5000.00' },
  });

  it('deve simular sucesso resiliente quando CONVEX_URL nao estiver configurada (offline mode)', async () => {
    const sink = new ConvexHttpSyncSink('');
    const result = await sink.publish(dummyEvent);

    expect(result.success).toBe(true);
    expect(result.remoteId).toContain('offline-simulated');
  });

  it('deve despachar para a API HTTP do Convex quando CONVEX_URL estiver configurada', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ value: { docId: 'convex-doc-xyz' } }),
    });

    const sink = new ConvexHttpSyncSink(
      'https://my-app.convex.cloud',
      'secret-deploy-key',
      mockFetch as unknown as typeof fetch,
    );

    const result = await sink.publish(dummyEvent);

    expect(result.success).toBe(true);
    expect(result.remoteId).toBe('convex-doc-xyz');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://my-app.convex.cloud/api/mutation',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer secret-deploy-key',
        }),
      }),
    );
  });

  it('deve tratar resposta de erro do Convex com retorno seguro', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Mutation Error',
    });

    const sink = new ConvexHttpSyncSink(
      'https://my-app.convex.cloud',
      'key',
      mockFetch as unknown as typeof fetch,
    );

    const result = await sink.publish(dummyEvent);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Convex HTTP 500: Internal Mutation Error');
  });
});
