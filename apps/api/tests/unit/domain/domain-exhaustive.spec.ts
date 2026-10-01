import { describe, it, expect } from 'vitest';
import { Money } from '../../../src/domain/value-objects/money.vo';
import { TaxBreakdown } from '../../../src/domain/value-objects/tax-breakdown.vo';
import { InvoiceStatusVO } from '../../../src/domain/value-objects/invoice-status.vo';
import { LedgerEntryTypeVO } from '../../../src/domain/value-objects/ledger-entry.vo';
import { IdempotencyKeyVO } from '../../../src/domain/value-objects/idempotency-key.vo';
import { User } from '../../../src/domain/entities/user.entity';
import { Expense } from '../../../src/domain/entities/expense.entity';
import { LedgerTransaction } from '../../../src/domain/entities/ledger-transaction.entity';
import { DeduplicationJournal } from '../../../src/domain/entities/deduplication-journal.entity';
import { Invoice } from '../../../src/domain/entities/invoice.entity';
import { TaxCalculatorService } from '../../../src/domain/services/tax-calculator.service';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { LedgerPostingService } from '../../../src/domain/services/ledger-posting.service';
import {
  DomainError,
  InvalidMoneyError,
  InvalidTaxRateError,
  InvoiceStateError,
  LedgerImbalanceError,
  EntityNotFoundError,
  DuplicateExecutionError,
} from '../../../src/domain/errors/domain.error';
import { Decimal } from 'decimal.js';
import { randomUUID } from 'crypto';

describe('Exhaustive Domain Layer & Mathematical Edge Cases (100% Coverage Target)', () => {
  describe('Money Value Object Edge Cases', () => {
    it('deve cobrir métodos de formatação, abs e comparações adicionais', () => {
      const positive = Money.from('250.75');
      const negative = Money.from('-50.25');

      expect(positive.toFormattedString('BRL')).toBe('BRL 250.75');
      expect(negative.abs().toDatabaseDecimal()).toBe('50.25');
      expect(positive.toFixed(1)).toBe('250.8');

      // from com Money existente
      const cloned = Money.from(positive);
      expect(cloned.equals(positive)).toBe(true);

      // from com Decimal
      const fromDec = Money.from(new Decimal('10.50'));
      expect(fromDec.toDatabaseDecimal()).toBe('10.50');

      // Tipos inválidos
      expect(() => Money.from(123 as unknown as string)).toThrow(InvalidMoneyError);

      // Fator inválido em multiply
      expect(() => positive.multiply(new Decimal(NaN))).toThrow(InvalidMoneyError);
    });
  });

  describe('TaxBreakdown VO Edge Cases', () => {
    it('deve cobrir toJSON, getEffectiveRateDecimal e validações de alíquotas cumulativas', () => {
      const gross = Money.from('1000.00');
      const single = TaxBreakdown.fromSingleRate(gross, '6.00');

      expect(single.getEffectiveRateDecimal().toFixed(4)).toBe('0.0600');
      const json = single.toJSON();
      expect(json.effectiveRatePercent).toBe('6.0000');
      expect(json.totalTaxAmount).toBe('60.00');

      // Alíquota inválida em fromSingleRate
      expect(() => TaxBreakdown.fromSingleRate(gross, '-5')).toThrow(InvalidTaxRateError);
      expect(() => TaxBreakdown.fromSingleRate(gross, '105')).toThrow(InvalidTaxRateError);

      // Componentes com soma > 100%
      expect(() =>
        TaxBreakdown.fromComponents(gross, [
          { name: 'A', ratePercent: '60' },
          { name: 'B', ratePercent: '50' },
        ]),
      ).toThrow(InvalidTaxRateError);

      // Componente negativo
      expect(() =>
        TaxBreakdown.fromComponents(gross, [{ name: 'A', ratePercent: '-1' }]),
      ).toThrow(InvalidTaxRateError);
    });
  });

  describe('InvoiceStatusVO Transitions & Edge Cases', () => {
    it('deve cobrir todos os estados e transições', () => {
      const draft = InvoiceStatusVO.draft();
      expect(draft.isDraft()).toBe(true);
      expect(draft.isTerminal()).toBe(false);

      const issued = InvoiceStatusVO.issued();
      expect(issued.isIssued()).toBe(true);

      const paid = InvoiceStatusVO.paid();
      expect(paid.isPaid()).toBe(true);
      expect(paid.isTerminal()).toBe(true);

      const overdue = InvoiceStatusVO.overdue();
      expect(overdue.isOverdue()).toBe(true);

      const cancelled = InvoiceStatusVO.cancelled();
      expect(cancelled.isCancelled()).toBe(true);
      expect(cancelled.isTerminal()).toBe(true);

      // from()
      expect(InvoiceStatusVO.from('draft').isDraft()).toBe(true);
      expect(() => InvoiceStatusVO.from('INVALID_STATUS')).toThrow(InvoiceStateError);

      // canTransitionTo
      expect(draft.canTransitionTo('ISSUED')).toBe(true);
      expect(draft.canTransitionTo('PAID')).toBe(false);
      expect(issued.canTransitionTo('CANCELLED')).toBe(true);
      expect(overdue.canTransitionTo('CANCELLED')).toBe(true);
    });
  });

  describe('LedgerEntryTypeVO & IdempotencyKeyVO Edge Cases', () => {
    it('deve cobrir LedgerEntryTypeVO methods e validação', () => {
      const debit = LedgerEntryTypeVO.debit();
      expect(debit.isDebit()).toBe(true);
      expect(debit.isCredit()).toBe(false);
      expect(debit.getValue()).toBe('DEBIT');

      const credit = LedgerEntryTypeVO.credit();
      expect(credit.isCredit()).toBe(true);
      expect(credit.isDebit()).toBe(false);

      expect(LedgerEntryTypeVO.from('credit').isCredit()).toBe(true);
      expect(() => LedgerEntryTypeVO.from('OTHER')).toThrow();
    });

    it('deve cobrir IdempotencyKeyVO equals', () => {
      const k1 = IdempotencyKeyVO.from('key-1');
      const k2 = IdempotencyKeyVO.from('key-1');
      const k3 = IdempotencyKeyVO.from('key-2');

      expect(k1.equals(k2)).toBe(true);
      expect(k1.equals(k3)).toBe(false);
    });
  });

  describe('User & Expense & DeduplicationJournal Entities', () => {
    it('deve cobrir User entity props e getters', () => {
      const now = new Date();
      const user = new User({
        id: randomUUID(),
        email: 'freelancer@axiomlancer.io',
        passwordHash: 'hash123',
        name: 'Carlos Dev',
        taxId: '12345678901',
        taxRegime: 'SIMPLES_NACIONAL',
        defaultTaxRate: new Decimal('0.0600'),
        createdAt: now,
        updatedAt: now,
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('freelancer@axiomlancer.io');
      expect(user.name).toBe('Carlos Dev');
      expect(user.taxId).toBe('12345678901');
      expect(user.taxRegime).toBe('SIMPLES_NACIONAL');
      expect(user.defaultTaxRate.toFixed(4)).toBe('0.0600');
      expect(user.createdAt).toEqual(now);
      expect(user.updatedAt).toEqual(now);
    });

    it('deve cobrir Expense entity props e getters', () => {
      const now = new Date();
      const expense = new Expense({
        id: randomUUID(),
        userId: randomUUID(),
        description: 'Figma Pro Team',
        category: 'DESIGN_SOFTWARE',
        amount: Money.from('75.00'),
        taxDeductible: true,
        date: now,
        receiptUrl: 'https://storage.axiomlancer.io/receipts/1.pdf',
        createdAt: now,
        updatedAt: now,
      });

      expect(expense.description).toBe('Figma Pro Team');
      expect(expense.category).toBe('DESIGN_SOFTWARE');
      expect(expense.amount.toDatabaseDecimal()).toBe('75.00');
      expect(expense.taxDeductible).toBe(true);
      expect(expense.date).toEqual(now);
      expect(expense.receiptUrl).toBe('https://storage.axiomlancer.io/receipts/1.pdf');
      expect(expense.createdAt).toEqual(now);
      expect(expense.updatedAt).toEqual(now);
    });

    it('deve cobrir LedgerTransaction validação de montante positivo e getters', () => {
      const tx = new LedgerTransaction({
        id: randomUUID(),
        userId: randomUUID(),
        invoiceId: randomUUID(),
        expenseId: null,
        entryType: LedgerEntryTypeVO.debit(),
        accountCategory: 'ASSET',
        amount: Money.from('500.00'),
        balanceAfter: Money.from('1500.00'),
        description: 'Entrada bancária',
        correlationId: 'corr-1',
      });

      expect(tx.id).toBeDefined();
      expect(tx.userId).toBeDefined();
      expect(tx.invoiceId).toBeDefined();
      expect(tx.expenseId).toBeNull();
      expect(tx.entryType.isDebit()).toBe(true);
      expect(tx.accountCategory).toBe('ASSET');
      expect(tx.amount.toDatabaseDecimal()).toBe('500.00');
      expect(tx.balanceAfter.toDatabaseDecimal()).toBe('1500.00');
      expect(tx.description).toBe('Entrada bancária');
      expect(tx.correlationId).toBe('corr-1');
      expect(tx.transactionDate).toBeInstanceOf(Date);
      expect(tx.createdAt).toBeInstanceOf(Date);

      // Rejeita valor zero ou negativo
      expect(
        () =>
          new LedgerTransaction({
            id: randomUUID(),
            userId: randomUUID(),
            entryType: LedgerEntryTypeVO.debit(),
            accountCategory: 'ASSET',
            amount: Money.zero(),
            balanceAfter: Money.zero(),
            description: 'Inválido',
          }),
      ).toThrow('estritamente positivo');
    });

    it('deve cobrir DeduplicationJournal getters, isFailed e renewLock', () => {
      const now = new Date();
      const lockedUntil = new Date(now.getTime() + 60000);
      const journal = new DeduplicationJournal({
        id: randomUUID(),
        idempotencyKey: IdempotencyKeyVO.from('test-key'),
        eventType: 'TEST_EVENT',
        status: 'PROCESSING',
        lockedUntil,
      });

      expect(journal.eventType).toBe('TEST_EVENT');
      expect(journal.isLocked(now)).toBe(true);
      expect(journal.isFailed()).toBe(false);
      expect(journal.executionCount).toBe(1);

      journal.markAsFailed('Erro de rede');
      expect(journal.isFailed()).toBe(true);
      expect(journal.errorMessage).toBe('Erro de rede');

      const nextLock = new Date(now.getTime() + 120000);
      journal.renewLock(nextLock);
      expect(journal.status).toBe('PROCESSING');
      expect(journal.executionCount).toBe(2);
      expect(journal.lockedUntil).toEqual(nextLock);
    });

    it('deve cobrir Invoice violação de invariante no construtor', () => {
      // Forçar tentativa de criar fatura onde Bruto != Líquido + Imposto
      expect(
        () =>
          new Invoice({
            id: randomUUID(),
            userId: randomUUID(),
            clientName: 'Fake Corp',
            clientEmail: 'fake@corp.com',
            clientTaxId: '12345678000100',
            grossAmount: Money.from('1000.00'),
            taxRate: new Decimal('0.0600'),
            taxAmount: Money.from('100.00'), // 100
            netAmount: Money.from('800.00'),  // 800 -> 100 + 800 = 900 != 1000!
            status: InvoiceStatusVO.draft(),
            dueDate: new Date(),
            items: [],
          }),
      ).toThrow('Violação de integridade na fatura');
    });
  });

  describe('Domain Errors Representation', () => {
    it('deve instanciar todas as classes de erro com seus códigos semânticos', () => {
      const notFound = new EntityNotFoundError('Invoice', 'uuid-1');
      expect(notFound.code).toBe('ENTITY_NOT_FOUND');
      expect(notFound.message).toContain('Invoice');

      const dup = new DuplicateExecutionError('key-x');
      expect(dup.code).toBe('DUPLICATE_EXECUTION_LOCKED');

      const imbalance = new LedgerImbalanceError('100.00', '90.00');
      expect(imbalance.code).toBe('LEDGER_IMBALANCE');
      expect(imbalance.message).toContain('Débito (100.00)');
    });
  });

  describe('InvoiceGenerationService Additional Validations', () => {
    const service = new InvoiceGenerationService();

    it('deve validar ausência de id, userId, clientName, dueDate inválida', () => {
      const valid = {
        id: randomUUID(),
        userId: randomUUID(),
        clientName: 'Cliente',
        clientEmail: 'c@c.com',
        clientTaxId: '12345678000100',
        items: [{ description: 'Dev', quantity: 1, unitPrice: '100.00' }],
        dueDate: new Date(),
      };

      expect(() => service.generate({ ...valid, id: '' })).toThrow('identificador');
      expect(() => service.generate({ ...valid, userId: ' ' })).toThrow('emitente');
      expect(() => service.generate({ ...valid, clientName: '' })).toThrow('nome do cliente');
      expect(() => service.generate({ ...valid, dueDate: new Date('invalid') })).toThrow('data de vencimento');
    });

    it('deve gerar fatura utilizando breakdown analítico detalhado', () => {
      const invoice = service.generate({
        id: randomUUID(),
        userId: randomUUID(),
        clientName: 'Enterprise Client',
        clientEmail: 'corp@enterprise.io',
        clientTaxId: '12345678000100',
        items: [{ description: 'Enterprise Audit', quantity: 1, unitPrice: '10000.00' }],
        dueDate: new Date('2026-12-01'),
        taxComponents: [
          { name: 'ISS', ratePercent: '4.00' },
          { name: 'IRRF', ratePercent: '1.50' },
        ],
      });

      expect(invoice.grossAmount.toDatabaseDecimal()).toBe('10000.00');
      expect(invoice.taxAmount.toDatabaseDecimal()).toBe('550.00');
      expect(invoice.netAmount.toDatabaseDecimal()).toBe('9450.00');
      expect(invoice.taxBreakdown).toBeDefined();
    });
  });

  describe('LedgerPostingService Edge Cases', () => {
    const ledgerService = new LedgerPostingService();
    const invoiceService = new InvoiceGenerationService();

    it('deve rejeitar lançamentos de emissão para faturas que não estejam ISSUED', () => {
      const draftInvoice = invoiceService.generate({
        id: randomUUID(),
        userId: randomUUID(),
        clientName: 'Client',
        clientEmail: 'c@c.com',
        clientTaxId: '12345678000100',
        items: [{ description: 'Item', quantity: 1, unitPrice: '100.00' }],
        dueDate: new Date(),
        issueImmediately: false, // DRAFT
      });

      expect(() =>
        ledgerService.createInvoiceIssuedEntries(
          draftInvoice,
          Money.zero(),
          Money.zero(),
          Money.zero(),
          'corr-1',
          () => randomUUID(),
        ),
      ).toThrow('status ISSUED');
    });

    it('deve rejeitar lançamentos de liquidação para faturas que não estejam PAID', () => {
      const issuedInvoice = invoiceService.generate({
        id: randomUUID(),
        userId: randomUUID(),
        clientName: 'Client',
        clientEmail: 'c@c.com',
        clientTaxId: '12345678000100',
        items: [{ description: 'Item', quantity: 1, unitPrice: '100.00' }],
        dueDate: new Date(),
        issueImmediately: true, // ISSUED
      });

      expect(() =>
        ledgerService.createInvoicePaidEntries(
          issuedInvoice,
          Money.zero(),
          Money.zero(),
          Money.zero(),
          'corr-1',
          () => randomUUID(),
        ),
      ).toThrow('status PAID');
    });
  });
});
