import { Worker, Job } from 'bullmq';
import { BillingJobPayload } from '../../application/ports/queue-service.interface';
import { BILLING_QUEUE_NAME } from './bullmq-billing.queue';
import { redisConfig } from './redis.connection';
import { ProcessBillingTriggerUseCase } from '../../application/use-cases/process-billing-trigger.use-case';
import { IDistributedLockService } from '../../application/ports/distributed-lock-service.interface';

export class BillingWorker {
  private worker: Worker<BillingJobPayload> | null = null;

  constructor(
    private readonly processBillingUseCase: ProcessBillingTriggerUseCase,
    private readonly distributedLockService?: IDistributedLockService,
  ) {}

  public start(): void {
    if (this.worker) return;

    this.worker = new Worker<BillingJobPayload>(
      BILLING_QUEUE_NAME,
      async (job: Job<BillingJobPayload>) => {
        const { invoiceId, triggerDay, channel, correlationId } = job.data;
        const lockResource = `billing_job:${invoiceId}:day_${triggerDay}`;

        const executeTask = async () => {
          return await this.processBillingUseCase.execute({
            invoiceId,
            triggerDay,
            channel,
            correlationId,
            lockTtlSeconds: 300,
          });
        };

        // Se o serviço de Lock Distribuído estiver configurado, envolve a execução em lock atômico Redis
        if (this.distributedLockService) {
          return await this.distributedLockService.withLock(lockResource, 60000, executeTask);
        }

        return await executeTask();
      },
      {
        connection: redisConfig,
        concurrency: 5,
      },
    );

    this.worker.on('completed', (job) => {
      console.log(`[BillingWorker] Job ${job.id} concluído com sucesso.`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[BillingWorker] Job ${job?.id} falhou: ${err.message}`);
    });
  }

  public async close(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.worker = null;
    }
  }
}
