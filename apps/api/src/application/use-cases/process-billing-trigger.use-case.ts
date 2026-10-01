import { IDeduplicationJournalRepository } from '../../domain/repositories/deduplication-journal-repository.interface';
import { IInvoiceRepository } from '../../domain/repositories/invoice-repository.interface';
import { IdempotencyKeyVO } from '../../domain/value-objects/idempotency-key.vo';
import { DuplicateExecutionError, EntityNotFoundError } from '../../domain/errors/domain.error';
import { ProcessBillingTriggerInputDTO, ProcessBillingTriggerOutputDTO } from '../dtos/billing-trigger.dto';

export class ProcessBillingTriggerUseCase {
  constructor(
    private readonly deduplicationRepository: IDeduplicationJournalRepository,
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  public async execute(input: ProcessBillingTriggerInputDTO): Promise<ProcessBillingTriggerOutputDTO> {
    // 1. Geração da Chave de Idempotência Estrita: "BILLING_TRIGGER:{invoiceId}:DAY_{triggerDay}"
    const idempotencyKeyVo = IdempotencyKeyVO.forBillingTrigger(input.invoiceId, input.triggerDay);
    const key = idempotencyKeyVo.getValue();
    const lockTtl = input.lockTtlSeconds ?? 300; // 5 minutos de lock padrão

    // 2. Aquisição Atômica do Bloqueio na tabela de auditoria DeduplicationJournal
    const lockResult = await this.deduplicationRepository.acquireLock(
      key,
      'BILLING_SCHEDULE_TRIGGER',
      lockTtl,
    );

    // 3. Se a operação já foi concluída anteriormente, retorna o resultado idempotente sem reenviar (Anti-Spam)
    if (lockResult.isCompleted && lockResult.cachedResponse) {
      return {
        idempotencyKey: key,
        status: 'REPLAYED_FROM_CACHE',
        invoiceId: input.invoiceId,
        channel: input.channel,
        deliveredAt: (lockResult.cachedResponse.deliveredAt as string) || new Date().toISOString(),
        recipientEmail: (lockResult.cachedResponse.recipientEmail as string) || '',
        amountDue: (lockResult.cachedResponse.amountDue as string) || '',
        message: 'Lembrete de cobrança já processado anteriormente. Replay idempotente retornado com segurança.',
      };
    }

    // 4. Se não conseguiu o lock e está em processamento por outra thread/worker, barra a execução
    if (!lockResult.acquired) {
      throw new DuplicateExecutionError(
        key,
        `Tentativa de envio concorrente bloqueada para fatura '${input.invoiceId}' no gatilho '${input.triggerDay}'.`,
      );
    }

    const journal = lockResult.record;

    try {
      // 5. Busca e validação da fatura
      const invoice = await this.invoiceRepository.findById(input.invoiceId);
      if (!invoice) {
        throw new EntityNotFoundError('Invoice', input.invoiceId);
      }

      // Safe Mode: Não disparar cobrança caso a fatura já esteja PAGA ou CANCELADA
      if (invoice.status.isPaid() || invoice.status.isCancelled()) {
        const skippedPayload = {
          invoiceId: invoice.id,
          reason: `Fatura já se encontra em estado final: ${invoice.status.getValue()}. Cobrança ignorada.`,
          skippedAt: new Date().toISOString(),
        };

        journal.markAsCompleted(skippedPayload);
        await this.deduplicationRepository.update(journal);

        return {
          idempotencyKey: key,
          status: 'SKIPPED_SAFE_MODE',
          invoiceId: invoice.id,
          channel: input.channel,
          deliveredAt: new Date().toISOString(),
          recipientEmail: invoice.clientEmail,
          amountDue: invoice.grossAmount.toDatabaseDecimal(),
          message: `Cobrança dispensada: fatura com status '${invoice.status.getValue()}'.`,
        };
      }

      // 6. Simulação do Envio pelo Canal Selecionado (WhatsApp, Email ou PIX Dinâmico)
      const now = new Date();
      const outputPayload: ProcessBillingTriggerOutputDTO = {
        idempotencyKey: key,
        status: 'PROCESSED',
        invoiceId: invoice.id,
        channel: input.channel,
        deliveredAt: now.toISOString(),
        recipientEmail: invoice.clientEmail,
        amountDue: invoice.grossAmount.toDatabaseDecimal(),
        message: `Lembrete de cobrança para fatura #${invoice.id.substring(0, 8)} enviado com sucesso via ${input.channel}.`,
      };

      // 7. Gravação de conclusão e cache no DeduplicationJournal (liberação atômica)
      journal.markAsCompleted(outputPayload as unknown as Record<string, unknown>, now);
      await this.deduplicationRepository.update(journal);

      return outputPayload;
    } catch (err: unknown) {
      // Grava o erro no DeduplicationJournal para auditoria
      const errorMessage = err instanceof Error ? err.message : String(err);
      journal.markAsFailed(errorMessage);
      await this.deduplicationRepository.update(journal);
      throw err;
    }
  }
}
