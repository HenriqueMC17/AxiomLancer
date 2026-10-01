import { describe, it, expect, beforeEach } from 'vitest';
import {
  OutboxPublisherService,
  InMemorySyncSink,
  IRealtimeSyncSink,
} from '../../../src/infrastructure/outbox/outbox-publisher.service';
import { MockOutboxRepository } from '../../mocks/mock-outbox-repository';
import { OutboxEvent } from '../../../src/domain/entities/outbox-event.entity';

describe('OutboxPublisherService (Reliable CQRS Realtime Dispatcher)', () => {
  let repo: MockOutboxRepository;
  let sink: InMemorySyncSink;
  let service: OutboxPublisherService;

  beforeEach(() => {
    repo = new MockOutboxRepository();
    sink = new InMemorySyncSink();
    service = new OutboxPublisherService(repo, sink);
  });

  it('deve despachar eventos pendentes com sucesso e marcá-los como processados', async () => {
    const event1 = new OutboxEvent({
      id: 'evt-101',
      userId: 'usr-1',
      aggregateType: 'INVOICE',
      aggregateId: 'inv-101',
      eventType: 'INVOICE_CREATED',
      payload: { grossAmount: '12000.00' },
    });

    const event2 = new OutboxEvent({
      id: 'evt-102',
      userId: 'usr-1',
      aggregateType: 'INVOICE',
      aggregateId: 'inv-102',
      eventType: 'INVOICE_SETTLED',
      payload: { status: 'PAID' },
    });

    await repo.save(event1);
    await repo.save(event2);

    const report = await service.dispatchPending();

    expect(report.totalFetched).toBe(2);
    expect(report.totalPublished).toBe(2);
    expect(report.totalFailed).toBe(0);
    expect(sink.receivedEvents).toHaveLength(2);

    // Verifica se os eventos foram marcados como processados no repositório
    const remainingPending = await repo.fetchPendingEvents();
    expect(remainingPending).toHaveLength(0);
    expect(event1.isProcessed()).toBe(true);
    expect(event2.isProcessed()).toBe(true);
  });

  it('deve isolar falhas de rede no sink sem interromper os demais eventos', async () => {
    const eventOk = new OutboxEvent({
      id: 'evt-ok',
      userId: 'usr-1',
      aggregateType: 'INVOICE',
      aggregateId: 'inv-ok',
      eventType: 'INVOICE_CREATED',
      payload: {},
    });

    const eventFail = new OutboxEvent({
      id: 'evt-fail',
      userId: 'usr-1',
      aggregateType: 'INVOICE',
      aggregateId: 'inv-fail',
      eventType: 'INVOICE_CREATED',
      payload: {},
    });

    await repo.save(eventFail);
    await repo.save(eventOk);

    // Sink customizado que falha apenas para 'evt-fail'
    const flakySink: IRealtimeSyncSink = {
      publish: async (event) => {
        if (event.id === 'evt-fail') {
          return { success: false, error: 'Convex Cloud Timeout' };
        }
        return { success: true, remoteId: 'remote-1' };
      },
    };

    const flakyService = new OutboxPublisherService(repo, flakySink);
    const report = await flakyService.dispatchPending();

    expect(report.totalFetched).toBe(2);
    expect(report.totalPublished).toBe(1);
    expect(report.totalFailed).toBe(1);
    expect(report.errors[0].eventId).toBe('evt-fail');
    expect(report.errors[0].error).toBe('Convex Cloud Timeout');

    // 'evt-fail' deve permanecer pendente para retentativa posterior
    const remainingPending = await repo.fetchPendingEvents();
    expect(remainingPending).toHaveLength(1);
    expect(remainingPending[0].id).toBe('evt-fail');
  });
});
