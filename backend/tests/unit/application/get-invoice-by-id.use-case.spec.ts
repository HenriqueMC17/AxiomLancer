import { describe, it, expect, beforeEach } from 'vitest';
import { GetInvoiceByIdUseCase } from '../../../src/application/use-cases/get-invoice-by-id.use-case';
import { MockInvoiceRepository } from '../../mocks/mock-invoice-repository';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { EntityNotFoundError } from '../../../src/domain/errors/domain.error';
import { randomUUID } from 'crypto';

describe('GetInvoiceByIdUseCase (Clean Architecture Decoupled Query)', () => {
  let invoiceRepo: MockInvoiceRepository;
  let useCase: GetInvoiceByIdUseCase;
  const invoiceService = new InvoiceGenerationService();

  const invoiceId = randomUUID();
  const userId = randomUUID();

  beforeEach(async () => {
    invoiceRepo = new MockInvoiceRepository();
    useCase = new GetInvoiceByIdUseCase(invoiceRepo);

    const invoice = invoiceService.generate({
      id: invoiceId,
      userId,
      clientName: 'Enterprise Client Tech',
      clientEmail: 'contact@enterprise.com',
      clientTaxId: '12345678000195',
      items: [{ description: 'Cloud Architecture Sprint', quantity: 1, unitPrice: '15000.00' }],
      dueDate: new Date('2026-11-15'),
      taxRatePercent: '6.00',
      issueImmediately: true,
    });
    await invoiceRepo.save(invoice);
  });

  it('deve buscar e retornar os dados da fatura desacoplado da infraestrutura', async () => {
    const result = await useCase.execute(invoiceId);

    expect(result.id).toBe(invoiceId);
    expect(result.clientName).toBe('Enterprise Client Tech');
    expect(result.grossAmount).toBe('15000.00');
    expect(result.netAmount).toBe('14100.00');
    expect(result.taxAmount).toBe('900.00');
    expect(result.status).toBe('ISSUED');
  });

  it('deve lançar EntityNotFoundError caso a fatura não exista', async () => {
    await expect(useCase.execute(randomUUID())).rejects.toThrow(EntityNotFoundError);
  });
});
