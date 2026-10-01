import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { OutboxPublisherService } from './outbox-publisher.service';
import { ConvexHttpSyncSink } from './convex-sync-sink';
import { PrismaOutboxRepository } from '../database/repositories/prisma-outbox.repository';
import { prisma } from '../database/prisma.client';

export interface OutboxWorkerOptions {
  pollIntervalMs?: number;
  batchSize?: number;
  enabled?: boolean;
}

export class OutboxWorker {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(
    private readonly publisherService: OutboxPublisherService,
    private readonly pollIntervalMs: number = 5000,
    private readonly batchSize: number = 50,
  ) {}

  public start(): void {
    if (this.timer) return;
    this.timer = setInterval(async () => {
      if (this.isRunning) return;
      this.isRunning = true;
      try {
        await this.publisherService.dispatchPending(this.batchSize);
      } catch (err) {
        console.error('[OutboxWorker] Erro no ciclo de despacho:', err);
      } finally {
        this.isRunning = false;
      }
    }, this.pollIntervalMs);

    if (this.timer && typeof this.timer.unref === 'function') {
      this.timer.unref();
    }
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  public async dispatchNow(batchSize?: number) {
    return this.publisherService.dispatchPending(batchSize || this.batchSize);
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    outboxWorker: OutboxWorker;
  }
}

const outboxWorkerPluginAsync: FastifyPluginAsync<OutboxWorkerOptions> = async (fastify, options) => {
  const pollIntervalMs = options.pollIntervalMs || Number(process.env.OUTBOX_POLL_INTERVAL_MS) || 5000;
  const batchSize = options.batchSize || Number(process.env.OUTBOX_BATCH_SIZE) || 50;
  const isEnabled = options.enabled !== undefined ? options.enabled : process.env.NODE_ENV !== 'test';

  const outboxRepository = new PrismaOutboxRepository(prisma);
  const syncSink = new ConvexHttpSyncSink();
  const publisherService = new OutboxPublisherService(outboxRepository, syncSink);
  const worker = new OutboxWorker(publisherService, pollIntervalMs, batchSize);

  fastify.decorate('outboxWorker', worker);

  fastify.addHook('onReady', async () => {
    if (isEnabled) {
      worker.start();
    }
  });

  fastify.addHook('onClose', async () => {
    worker.stop();
  });

  // Rota administrativa/interna para forçar flush imediato do outbox
  fastify.post('/api/v1/internal/outbox/dispatch', async (request, reply) => {
    const report = await worker.dispatchNow();
    return reply.status(200).send({
      success: true,
      message: 'Despacho do Transactional Outbox executado.',
      data: report,
    });
  });
};

export const outboxWorkerPlugin = fp(outboxWorkerPluginAsync, {
  name: 'outbox-worker-plugin',
});
