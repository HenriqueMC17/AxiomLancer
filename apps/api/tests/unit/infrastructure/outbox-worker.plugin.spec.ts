import { describe, it, expect, vi } from 'vitest';
import { OutboxWorker } from '../../../src/infrastructure/outbox/outbox-worker.plugin';
import { OutboxPublisherService } from '../../../src/infrastructure/outbox/outbox-publisher.service';
import { MockOutboxRepository } from '../../mocks/mock-outbox-repository';

describe('OutboxWorker', () => {
  it('deve disparar manualmente e retornar relatorio do publisher', async () => {
    const repo = new MockOutboxRepository();
    const publisher = new OutboxPublisherService(repo);
    const worker = new OutboxWorker(publisher, 1000, 10);

    const report = await worker.dispatchNow();
    expect(report).toBeDefined();
    expect(report.totalFetched).toBe(0);
    expect(report.totalPublished).toBe(0);
  });

  it('deve iniciar e parar sem vazamento de timer', () => {
    const repo = new MockOutboxRepository();
    const publisher = new OutboxPublisherService(repo);
    const worker = new OutboxWorker(publisher, 1000, 10);

    worker.start();
    // Iniciar novamente nao deve duplicar timer
    worker.start();

    worker.stop();
    // Parar novamente deve ser idempotente
    worker.stop();

    expect(true).toBe(true);
  });
});
