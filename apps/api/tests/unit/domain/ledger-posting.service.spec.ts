import { describe, it, expect } from 'vitest';
import { LedgerPostingService } from '../../../src/domain/services/ledger-posting.service';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { Expense } from '../../../src/domain/entities/expense.entity';
import { Money } from '../../../src/domain/value-objects/money.vo';
import { randomUUID } from 'crypto';

describe('LedgerPostingService (Double-Entry Bookkeeping & Tax Split)', () => {
  const ledgerService = new LedgerPostingService();
  const invoiceService = new InvoiceGenerationService();

  const invoice = invoiceService.generate({
    id: randomUUID(),
    userId: randomUUID(),
    clientName: 'Cliente Beta Corp',
    clientEmail: 'beta@corp.com',
    clientTaxId: '98765432000199',
    items: [{ description: 'Consultoria Cloud', quantity: 1, unitPrice: '10000.00' }],
    dueDate: new Date('2026-11-01'),
    taxRatePercent: '6.00', // Bruto = 10000.00, Imposto = 600.00, Líquido = 9400.00
    issueImmediately: true,
  });

  it('deve gerar partidas dobradas balanceadas na emissão da fatura (Competência)', () => {
    const correlationId = randomUUID();
    const batch = ledgerService.createInvoiceIssuedEntries(
      invoice,
      Money.zero(), // Saldo anterior de Ativo
      Money.zero(), // Saldo anterior de Receita
      Money.zero(), // Saldo anterior de Reserva Tributária
      correlationId,
      () => randomUUID(),
    );

    expect(batch.correlationId).toBe(correlationId);
    expect(batch.transactions.length).toBe(3); // 1 Débito (Ativo) e 2 Créditos (Receita + Reserva)

    // Débitos = R$ 10.000,00 | Créditos = R$ 9.400,00 + R$ 600,00 = R$ 10.000,00
    expect(batch.totalDebit.toDatabaseDecimal()).toBe('10000.00');
    expect(batch.totalCredit.toDatabaseDecimal()).toBe('10000.00');
    expect(batch.totalDebit.equals(batch.totalCredit)).toBe(true);

    const debitTx = batch.transactions.find((tx) => tx.entryType.isDebit());
    expect(debitTx?.accountCategory).toBe('ASSET');
    expect(debitTx?.amount.toDatabaseDecimal()).toBe('10000.00');

    const revenueTx = batch.transactions.find((tx) => tx.accountCategory === 'REVENUE');
    expect(revenueTx?.amount.toDatabaseDecimal()).toBe('9400.00');

    const taxTx = batch.transactions.find((tx) => tx.accountCategory === 'TAX_RESERVE');
    expect(taxTx?.amount.toDatabaseDecimal()).toBe('600.00');
  });

  it('deve gerar partidas dobradas balanceadas na liquidação da fatura (Split Tributário Automático)', () => {
    // Transiciona para PAID
    invoice.markAsPaid();

    const correlationId = randomUUID();
    const batch = ledgerService.createInvoicePaidEntries(
      invoice,
      Money.from('5000.00'), // Saldo Bancário
      Money.zero(),          // Saldo Cofre Fiscal
      Money.from('10000.00'),// Contas a Receber
      correlationId,
      () => randomUUID(),
    );

    // Débitos = Banco Líquido (9400) + Cofre Fiscal (600) = 10000.00
    // Créditos = Baixa Contas a Receber (10000.00)
    expect(batch.totalDebit.toDatabaseDecimal()).toBe('10000.00');
    expect(batch.totalCredit.toDatabaseDecimal()).toBe('10000.00');
    expect(batch.totalDebit.equals(batch.totalCredit)).toBe(true);

    const bankTx = batch.transactions.find(
      (tx) => tx.entryType.isDebit() && tx.accountCategory === 'ASSET' && tx.description.includes('Bancária'),
    );
    expect(bankTx?.amount.toDatabaseDecimal()).toBe('9400.00');
    expect(bankTx?.balanceAfter.toDatabaseDecimal()).toBe('14400.00'); // 5000 + 9400

    const taxSafeTx = batch.transactions.find((tx) => tx.accountCategory === 'TAX_RESERVE');
    expect(taxSafeTx?.amount.toDatabaseDecimal()).toBe('600.00');
  });

  it('deve gerar partidas dobradas balanceadas para despesa operacional', () => {
    const expense = new Expense({
      id: randomUUID(),
      userId: invoice.userId,
      description: 'Assinatura AWS & Vercel',
      category: 'INFRAESTRUTURA',
      amount: Money.from('450.00'),
      taxDeductible: true,
      date: new Date(),
    });

    const correlationId = randomUUID();
    const batch = ledgerService.createExpenseEntries(
      expense,
      Money.zero(),          // Despesa acumulada
      Money.from('10000.00'),// Saldo em banco
      correlationId,
      () => randomUUID(),
    );

    expect(batch.totalDebit.toDatabaseDecimal()).toBe('450.00');
    expect(batch.totalCredit.toDatabaseDecimal()).toBe('450.00');
    expect(batch.totalDebit.equals(batch.totalCredit)).toBe(true);

    const bankTx = batch.transactions.find((tx) => tx.accountCategory === 'ASSET');
    expect(bankTx?.balanceAfter.toDatabaseDecimal()).toBe('9550.00'); // 10000 - 450
  });
});
