import { Queue } from 'bullmq';
import { IQueueService, BillingJobPayload } from '../../application/ports/queue-service.interface';
import { redisConfig } from './redis.connection';

export const BILLING_QUEUE_NAME = 'billing-schedule-triggers';

export class BullMQBillingQueue implements IQueueService {
  private readonly queue: Queue<BillingJobPayload>;

  constructor() {
    this.queue = new Queue<BillingJobPayload>(BILLING_QUEUE_NAME, {
      connection: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });
  }

  public async enqueueBillingReminder(payload: BillingJobPayload, delayMs?: number): Promise<string> {
    // Job ID determinístico para reforçar a deduplicação na borda da fila
    const jobId = `job_${payload.invoiceId}_day_${payload.triggerDay}`;

    const job = await this.queue.add('process-billing-trigger', payload, {
      jobId,
      delay: delayMs,
    });

    return job.id || jobId;
  }

  public async close(): Promise<void> {
    await this.queue.close();
  }
}
