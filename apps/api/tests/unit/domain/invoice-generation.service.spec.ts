import { describe, it, expect } from 'vitest';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { DomainError, InvalidMoneyError, InvoiceStateError } from '../../../src/domain/errors/domain.error';

describe('InvoiceGenerationService & Invoice Entity (Pure Domain Logic)', () => {
  const service = new InvoiceGenerationService();

  const validCommand = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    userId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    clientName: 'Acme Software Labs',
    clientEmail: 'finance@acmelabs.io',
    clientTaxId: '12.345.678/0001-90',
    items: [
      { description: 'Arquitetura Backend Fastify', quantity: 1, unitPrice: '8000.00' },
      { description: 'Implementação Core Ledger', quantity: 2, unitPrice: '3500.00' },
    ], // Bruto = 8000 + 7000 = 15000.00
    dueDate: new Date('2026-10-15'),
    taxRatePercent: '6.00', // 6% = 900.00 -> Líquido = 14100.00
    issueImmediately: true,
  };

  it('deve gerar uma fatura consistente com os cálculos determinísticos e itens consolidados', () => {
    const invoice = service.generate(validCommand);

    expect(invoice.id).toBe(validCommand.id);
    expect(invoice.userId).toBe(validCommand.userId);
    expect(invoice.clientName).toBe('Acme Software Labs');
    expect(invoice.clientTaxId).toBe('12345678000190'); // Dígitos sanitizados
    expect(invoice.grossAmount.toDatabaseDecimal()).toBe('15000.00');
    expect(invoice.taxAmount.toDatabaseDecimal()).toBe('900.00');
    expect(invoice.netAmount.toDatabaseDecimal()).toBe('14100.00');
    expect(invoice.status.isIssued()).toBe(true);
    expect(invoice.items.length).toBe(2);
    expect(invoice.items[0].total).toBe('8000.00');
    expect(invoice.items[1].total).toBe('7000.00');
  });

  it('deve respeitar a máquina de estados (FSM) no ciclo de vida da fatura', () => {
    const draftCommand = { ...validCommand, issueImmediately: false };
    const invoice = service.generate(draftCommand);

    expect(invoice.status.isDraft()).toBe(true);

    // DRAFT -> ISSUED
    invoice.issue();
    expect(invoice.status.isIssued()).toBe(true);
    expect(invoice.issuedAt).toBeDefined();

    // ISSUED -> PAID
    const paidAt = new Date('2026-10-10');
    invoice.markAsPaid(paidAt);
    expect(invoice.status.isPaid()).toBe(true);
    expect(invoice.paidAt).toEqual(paidAt);

    // Tentativa ilegal: PAID -> CANCELLED (Estado terminal deve ser protegido)
    expect(() => invoice.cancel()).toThrow(InvoiceStateError);
  });

  it('deve permitir transição para OVERDUE e subsequentemente PAID', () => {
    const invoice = service.generate(validCommand);
    expect(invoice.status.isIssued()).toBe(true);

    invoice.markAsOverdue();
    expect(invoice.status.isOverdue()).toBe(true);

    invoice.markAsPaid();
    expect(invoice.status.isPaid()).toBe(true);
  });

  it('deve rejeitar cliente com CPF/CNPJ de formato incorreto', () => {
    const invalidCommand = { ...validCommand, clientTaxId: '123' };
    expect(() => service.generate(invalidCommand)).toThrow(DomainError);
  });

  it('deve rejeitar e-mail de cliente malformado', () => {
    const invalidCommand = { ...validCommand, clientEmail: 'email-sem-arroba.com' };
    expect(() => service.generate(invalidCommand)).toThrow(DomainError);
  });

  it('deve rejeitar faturas sem itens ou com quantidade zerada', () => {
    const emptyItemsCommand = { ...validCommand, items: [] };
    expect(() => service.generate(emptyItemsCommand)).toThrow(DomainError);

    const zeroQuantityCommand = {
      ...validCommand,
      items: [{ description: 'Dev', quantity: 0, unitPrice: '100.00' }],
    };
    expect(() => service.generate(zeroQuantityCommand)).toThrow(DomainError);
  });

  it('deve rejeitar itens com preço unitário negativo ou zerado', () => {
    const negativePriceCommand = {
      ...validCommand,
      items: [{ description: 'Dev', quantity: 1, unitPrice: '-50.00' }],
    };
    expect(() => service.generate(negativePriceCommand)).toThrow(InvalidMoneyError);
  });
});
