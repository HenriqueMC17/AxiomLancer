import { describe, it, expect, beforeEach } from 'vitest';
import { CreateInvoiceUseCase } from '../../../src/application/use-cases/create-invoice.use-case';
import { MockUnitOfWork } from '../../mocks/mock-unit-of-work';
import { randomUUID } from 'crypto';

describe('CreateInvoiceUseCase (ACID Transaction & Ledger Integration)', () => {
  let uow: MockUnitOfWork;
  let useCase: CreateInvoiceUseCase;

  beforeEach(() => {
    uow = new MockUnitOfWork();
    useCase = new CreateInvoiceUseCase(uow);
  });

  it('deve criar a fatura e persistir simultaneamente os lançamentos balanceados no Ledger e o evento no Outbox', async () => {
    const userId = randomUUID();

    const output = await useCase.execute({
      userId,
      clientName: 'Design Systems Inc',
      clientEmail: 'billing@designsys.com',
      clientTaxId: '11222333000144',
      items: [
        { description: 'Figma Token Architecture', quantity: 1, unitPrice: '5000.00' },
        { description: 'Angular UI Integration', quantity: 2, unitPrice: '2500.00' },
      ], // Bruto = 10000.00
      dueDate: '2026-10-30',
      taxRatePercent: '6.00', // Imposto = 600.00, Líquido = 9400.00
      issueImmediately: true,
    });

    expect(output.id).toBeDefined();
    expect(output.grossAmount).toBe('10000.00');
    expect(output.taxAmount).toBe('600.00');
    expect(output.netAmount).toBe('9400.00');
    expect(output.status).toBe('ISSUED');

    // 1. Verifica se a fatura foi gravada no repositório de faturas
    const savedInvoice = await uow.invoiceRepository.findById(output.id);
    expect(savedInvoice).toBeDefined();
    expect(savedInvoice?.clientName).toBe('Design Systems Inc');

    // 2. Verifica se as transações contábeis foram gravadas no Ledger
    const ledgerList = await uow.ledgerRepository.findByUserId(userId);
    expect(ledgerList.length).toBe(3); // Débito Ativo, Crédito Receita, Crédito Reserva Fiscal

    const totalDebit = ledgerList
      .filter((tx) => tx.entryType.isDebit())
      .reduce((acc, tx) => acc.add(tx.amount), (await import('../../../src/domain/value-objects/money.vo')).Money.zero());

    const totalCredit = ledgerList
      .filter((tx) => tx.entryType.isCredit())
      .reduce((acc, tx) => acc.add(tx.amount), (await import('../../../src/domain/value-objects/money.vo')).Money.zero());

    expect(totalDebit.toDatabaseDecimal()).toBe('10000.00');
    expect(totalCredit.toDatabaseDecimal()).toBe('10000.00');

    // 3. Verifica se o evento transacional do Outbox foi gravado para sincronização CQRS
    const pendingEvents = await uow.outboxRepository.fetchPendingEvents();
    expect(pendingEvents.length).toBe(1);
    expect(pendingEvents[0].eventType).toBe('INVOICE_CREATED');
    expect(pendingEvents[0].aggregateId).toBe(output.id);
    expect(pendingEvents[0].userId).toBe(userId);
    expect(pendingEvents[0].payload['clientName']).toBe('Design Systems Inc');
  });
});
