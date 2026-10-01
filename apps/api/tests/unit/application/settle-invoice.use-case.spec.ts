import { describe, it, expect, beforeEach } from 'vitest';
import { SettleInvoiceUseCase } from '../../../src/application/use-cases/settle-invoice.use-case';
import { MockUnitOfWork } from '../../mocks/mock-unit-of-work';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { EntityNotFoundError, DomainError } from '../../../src/domain/errors/domain.error';
import { randomUUID } from 'crypto';

describe('SettleInvoiceUseCase (Payment Receipt & Virtual Safe Split)', () => {
  let uow: MockUnitOfWork;
  let useCase: SettleInvoiceUseCase;
  const invoiceService = new InvoiceGenerationService();

  const userId = randomUUID();
  const invoiceId = randomUUID();

  beforeEach(async () => {
    uow = new MockUnitOfWork();
    useCase = new SettleInvoiceUseCase(uow);

    const invoice = invoiceService.generate({
      id: invoiceId,
      userId,
      clientName: 'Alpha Tech',
      clientEmail: 'pay@alphatech.com',
      clientTaxId: '12345678000100',
      items: [{ description: 'Core Ledger Implementation', quantity: 1, unitPrice: '20000.00' }],
      dueDate: new Date('2026-10-15'),
      taxRatePercent: '6.00', // Bruto = 20000.00, Imposto = 1200.00, Líquido = 18800.00
      issueImmediately: true,
    });
    await uow.invoiceRepository.save(invoice);
  });

  it('deve liquidar a fatura, atualizar para PAID e registrar o split contábil no Ledger', async () => {
    const output = await useCase.execute({
      invoiceId,
      userId,
      paidAt: '2026-10-10T14:00:00.000Z',
    });

    expect(output.invoiceId).toBe(invoiceId);
    expect(output.status).toBe('PAID');
    expect(output.netDeposited).toBe('18800.00');
    expect(output.taxReservedInSafe).toBe('1200.00');
    expect(output.receivablesCleared).toBe('20000.00');

    // Verifica estado da fatura no repositório
    const updatedInvoice = await uow.invoiceRepository.findById(invoiceId);
    expect(updatedInvoice?.status.isPaid()).toBe(true);
    expect(updatedInvoice?.paidAt).toBeDefined();

    // Verifica lançamentos no Ledger (Baixa de títulos, entrada bancária e reserva fiscal)
    const txs = await uow.ledgerRepository.findByUserId(userId);
    expect(txs.length).toBe(3);
  });

  it('deve rejeitar tentativa de liquidação por outro usuário', async () => {
    const anotherUser = randomUUID();

    await expect(
      useCase.execute({
        invoiceId,
        userId: anotherUser,
      }),
    ).rejects.toThrow('Acesso não autorizado à fatura informada.');
  });

  it('deve lançar EntityNotFoundError para fatura inexistente', async () => {
    await expect(
      useCase.execute({
        invoiceId: randomUUID(),
        userId,
      }),
    ).rejects.toThrow(EntityNotFoundError);
  });
});
