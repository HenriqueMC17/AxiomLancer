import { describe, it, expect } from 'vitest';
import { OutboxEvent } from '../../../src/domain/entities/outbox-event.entity';

describe('OutboxEvent Domain Entity', () => {
  it('deve instanciar um evento não processado por padrão', () => {
    const event = new OutboxEvent({
      id: 'evt-1',
      userId: 'usr-1',
      aggregateType: 'INVOICE',
      aggregateId: 'inv-1',
      eventType: 'INVOICE_CREATED',
      payload: { amount: '15000.00' },
    });

    expect(event.id).toBe('evt-1');
    expect(event.userId).toBe('usr-1');
    expect(event.aggregateType).toBe('INVOICE');
    expect(event.aggregateId).toBe('inv-1');
    expect(event.eventType).toBe('INVOICE_CREATED');
    expect(event.payload).toEqual({ amount: '15000.00' });
    expect(event.createdAt).toBeInstanceOf(Date);
    expect(event.processedAt).toBeNull();
    expect(event.isProcessed()).toBe(false);
  });

  it('deve marcar o evento como processado com timestamp', () => {
    const event = new OutboxEvent({
      id: 'evt-2',
      userId: 'usr-1',
      aggregateType: 'INVOICE',
      aggregateId: 'inv-2',
      eventType: 'INVOICE_SETTLED',
      payload: { status: 'PAID' },
    });

    const processedTime = new Date('2026-10-01T20:00:00Z');
    event.markAsProcessed(processedTime);

    expect(event.isProcessed()).toBe(true);
    expect(event.processedAt).toEqual(processedTime);
  });
});
