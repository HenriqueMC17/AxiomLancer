import { describe, it, expect, beforeEach } from 'vitest';
import { ProcessBillingTriggerUseCase } from '../../../src/application/use-cases/process-billing-trigger.use-case';
import { MockDeduplicationRepository } from '../../mocks/mock-deduplication-repository';
import { MockInvoiceRepository } from '../../mocks/mock-invoice-repository';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { DuplicateExecutionError } from '../../../src/domain/errors/domain.error';
import { randomUUID } from 'crypto';

describe('ProcessBillingTriggerUseCase (Strict Idempotency, Atomic Lock & Anti-Spam)', () => {
  let deduplicationRepo: MockDeduplicationRepository;
  let invoiceRepo: MockInvoiceRepository;
  let useCase: ProcessBillingTriggerUseCase;
  const invoiceService = new InvoiceGenerationService();

  const invoiceId = randomUUID();
  const userId = randomUUID();

  beforeEach(async () => {
    deduplicationRepo = new MockDeduplicationRepository();
    invoiceRepo = new MockInvoiceRepository();
    useCase = new ProcessBillingTriggerUseCase(deduplicationRepo, invoiceRepo);

    // Cria fatura prévia no repositório
    const invoice = invoiceService.generate({
      id: invoiceId,
      userId,
      clientName: 'Startup Alpha',
      clientEmail: 'cfo@alpha.dev',
      clientTaxId: '12345678000100',
      items: [{ description: 'SaaS Platform Development', quantity: 1, unitPrice: '12000.00' }],
      dueDate: new Date('2026-10-20'),
      taxRatePercent: '6.00',
      issueImmediately: true,
    });
    await invoiceRepo.save(invoice);
  });

  it('deve processar o primeiro disparo com sucesso gravando bloqueio atômico no DeduplicationJournal', async () => {
    const output = await useCase.execute({
      invoiceId,
      triggerDay: -3, // 3 dias antes do vencimento
      channel: 'WHATSAPP',
    });

    expect(output.status).toBe('PROCESSED');
    expect(output.idempotencyKey).toBe(`BILLING_TRIGGER:${invoiceId}:DAY_-3`);
    expect(output.invoiceId).toBe(invoiceId);

    // Verifica se foi gravado no DeduplicationJournal com COMPLETED
    const journalRecord = await deduplicationRepo.findByKey(output.idempotencyKey);
    expect(journalRecord).toBeDefined();
    expect(journalRecord?.isCompleted()).toBe(true);
  });

  it('deve retornar replay do cache sem duplicar envio caso a mesma chave seja disparada novamente (Anti-Spam)', async () => {
    // 1º Disparo
    await useCase.execute({
      invoiceId,
      triggerDay: -3,
      channel: 'EMAIL',
    });

    // 2º Disparo idêntico (ex: retry acidental ou falha de timeout no webhook)
    const replayOutput = await useCase.execute({
      invoiceId,
      triggerDay: -3,
      channel: 'EMAIL',
    });

    expect(replayOutput.status).toBe('REPLAYED_FROM_CACHE');
    expect(replayOutput.message).toContain('Lembrete de cobrança já processado anteriormente');
  });

  it('deve lançar DuplicateExecutionError caso ocorra tentativa concorrente com lock ativo', async () => {
    const key = `BILLING_TRIGGER:${invoiceId}:DAY_0`;

    // Simula lock ativo por outra thread
    await deduplicationRepo.acquireLock(key, 'BILLING_SCHEDULE_TRIGGER', 300);

    // Segunda chamada concorrente deve ser bloqueada
    await expect(
      useCase.execute({
        invoiceId,
        triggerDay: 0,
        channel: 'PIX_DYNAMIC',
      }),
    ).rejects.toThrow(DuplicateExecutionError);
  });

  it('deve ativar o Safe Mode caso a fatura já se encontre PAGA (evita cobrança indevida)', async () => {
    const invoice = await invoiceRepo.findById(invoiceId);
    invoice?.markAsPaid();
    await invoiceRepo.update(invoice!);

    const output = await useCase.execute({
      invoiceId,
      triggerDay: 5, // 5 dias após o vencimento
      channel: 'WHATSAPP',
    });

    expect(output.status).toBe('SKIPPED_SAFE_MODE');
    expect(output.message).toContain("fatura com status 'PAID'");
  });

  it('deve marcar o DeduplicationJournal como FAILED caso ocorra erro no processamento', async () => {
    const unknownInvoiceId = randomUUID();

    await expect(
      useCase.execute({
        invoiceId: unknownInvoiceId,
        triggerDay: 0,
        channel: 'EMAIL',
      }),
    ).rejects.toThrow();

    const journal = await deduplicationRepo.findByKey(`BILLING_TRIGGER:${unknownInvoiceId}:DAY_0`);
    expect(journal).toBeDefined();
    expect(journal?.isFailed()).toBe(true);
    expect(journal?.errorMessage).toBeDefined();
  });
});
