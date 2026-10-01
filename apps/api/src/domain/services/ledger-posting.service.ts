import { LedgerTransaction } from '../entities/ledger-transaction.entity';
import { Invoice } from '../entities/invoice.entity';
import { Expense } from '../entities/expense.entity';
import { LedgerEntryTypeVO } from '../value-objects/ledger-entry.vo';
import { Money } from '../value-objects/money.vo';
import { LedgerImbalanceError, DomainError } from '../errors/domain.error';

export interface DoubleEntryTransactionBatch {
  correlationId: string;
  transactions: LedgerTransaction[];
  totalDebit: Money;
  totalCredit: Money;
}

export class LedgerPostingService {
  /**
   * Gera partidas dobradas para emissão de fatura (Reconhecimento de Receita por Competência)
   *
   * DÉBITO: ASSET (Contas a Receber) = GrossAmount
   * CRÉDITO: REVENUE (Receita de Serviços) = NetAmount
   * CRÉDITO: TAX_RESERVE (Provisão Tributária) = TaxAmount
   */
  public createInvoiceIssuedEntries(
    invoice: Invoice,
    currentAssetBalance: Money,
    currentRevenueBalance: Money,
    currentTaxReserveBalance: Money,
    correlationId: string,
    idGenerator: () => string,
  ): DoubleEntryTransactionBatch {
    if (!invoice.status.isIssued()) {
      throw new DomainError('Lançamentos de emissão só podem ser gerados para faturas com status ISSUED.');
    }

    const transactions: LedgerTransaction[] = [];

    // 1. Débito em Contas a Receber (Ativo)
    const newAssetBalance = currentAssetBalance.add(invoice.grossAmount);
    transactions.push(
      new LedgerTransaction({
        id: idGenerator(),
        userId: invoice.userId,
        invoiceId: invoice.id,
        entryType: LedgerEntryTypeVO.debit(),
        accountCategory: 'ASSET',
        amount: invoice.grossAmount,
        balanceAfter: newAssetBalance,
        description: `Emissão de Fatura #${invoice.id.substring(0, 8)} - Contas a Receber`,
        correlationId,
      })
    );

    // 2. Crédito em Receita de Serviços (Resultado)
    const newRevenueBalance = currentRevenueBalance.add(invoice.netAmount);
    transactions.push(
      new LedgerTransaction({
        id: idGenerator(),
        userId: invoice.userId,
        invoiceId: invoice.id,
        entryType: LedgerEntryTypeVO.credit(),
        accountCategory: 'REVENUE',
        amount: invoice.netAmount,
        balanceAfter: newRevenueBalance,
        description: `Emissão de Fatura #${invoice.id.substring(0, 8)} - Receita Líquida Reconhecida`,
        correlationId,
      })
    );

    // 3. Crédito em Provisão de Impostos (Passivo/Reserva)
    if (invoice.taxAmount.isPositive()) {
      const newTaxBalance = currentTaxReserveBalance.add(invoice.taxAmount);
      transactions.push(
        new LedgerTransaction({
          id: idGenerator(),
          userId: invoice.userId,
          invoiceId: invoice.id,
          entryType: LedgerEntryTypeVO.credit(),
          accountCategory: 'TAX_RESERVE',
          amount: invoice.taxAmount,
          balanceAfter: newTaxBalance,
          description: `Emissão de Fatura #${invoice.id.substring(0, 8)} - Split Tributário Provisionado`,
          correlationId,
        })
      );
    }

    this.assertDoubleEntryBalance(transactions);

    return {
      correlationId,
      transactions,
      totalDebit: invoice.grossAmount,
      totalCredit: invoice.netAmount.add(invoice.taxAmount),
    };
  }

  /**
   * Gera partidas dobradas para liquidação de fatura (Pagamento recebido)
   *
   * DÉBITO: ASSET (Conta Bancária Líquida) = NetAmount
   * DÉBITO: ASSET (Cofre Virtual Tributário) = TaxAmount
   * CRÉDITO: ASSET (Baixa de Contas a Receber) = GrossAmount
   */
  public createInvoicePaidEntries(
    invoice: Invoice,
    currentBankBalance: Money,
    currentTaxSafeBalance: Money,
    currentReceivablesBalance: Money,
    correlationId: string,
    idGenerator: () => string,
  ): DoubleEntryTransactionBatch {
    if (!invoice.status.isPaid()) {
      throw new DomainError('Lançamentos de liquidação só podem ser gerados para faturas com status PAID.');
    }

    const transactions: LedgerTransaction[] = [];

    // 1. Débito no Banco (Dinheiro disponível)
    const newBankBalance = currentBankBalance.add(invoice.netAmount);
    transactions.push(
      new LedgerTransaction({
        id: idGenerator(),
        userId: invoice.userId,
        invoiceId: invoice.id,
        entryType: LedgerEntryTypeVO.debit(),
        accountCategory: 'ASSET',
        amount: invoice.netAmount,
        balanceAfter: newBankBalance,
        description: `Liquidação Fatura #${invoice.id.substring(0, 8)} - Disponibilidade Bancária`,
        correlationId,
      })
    );

    // 2. Débito no Cofre Virtual de Impostos (Split automático no recebimento)
    if (invoice.taxAmount.isPositive()) {
      const newTaxSafeBalance = currentTaxSafeBalance.add(invoice.taxAmount);
      transactions.push(
        new LedgerTransaction({
          id: idGenerator(),
          userId: invoice.userId,
          invoiceId: invoice.id,
          entryType: LedgerEntryTypeVO.debit(),
          accountCategory: 'TAX_RESERVE',
          amount: invoice.taxAmount,
          balanceAfter: newTaxSafeBalance,
          description: `Liquidação Fatura #${invoice.id.substring(0, 8)} - Split Tributário Retido em Cofre`,
          correlationId,
        })
      );
    }

    // 3. Crédito em Contas a Receber (Baixa do Título)
    const newReceivablesBalance = currentReceivablesBalance.subtract(invoice.grossAmount);
    transactions.push(
      new LedgerTransaction({
        id: idGenerator(),
        userId: invoice.userId,
        invoiceId: invoice.id,
        entryType: LedgerEntryTypeVO.credit(),
        accountCategory: 'ASSET',
        amount: invoice.grossAmount,
        balanceAfter: newReceivablesBalance,
        description: `Liquidação Fatura #${invoice.id.substring(0, 8)} - Baixa de Contas a Receber`,
        correlationId,
      })
    );

    this.assertDoubleEntryBalance(transactions);

    return {
      correlationId,
      transactions,
      totalDebit: invoice.netAmount.add(invoice.taxAmount),
      totalCredit: invoice.grossAmount,
    };
  }

  /**
   * Gera partidas dobradas para despesa operacional
   */
  public createExpenseEntries(
    expense: Expense,
    currentExpenseBalance: Money,
    currentBankBalance: Money,
    correlationId: string,
    idGenerator: () => string,
  ): DoubleEntryTransactionBatch {
    const transactions: LedgerTransaction[] = [];

    // Débito em Despesa (DRE)
    const newExpenseBalance = currentExpenseBalance.add(expense.amount);
    transactions.push(
      new LedgerTransaction({
        id: idGenerator(),
        userId: expense.userId,
        expenseId: expense.id,
        entryType: LedgerEntryTypeVO.debit(),
        accountCategory: 'EXPENSE',
        amount: expense.amount,
        balanceAfter: newExpenseBalance,
        description: `Despesa: ${expense.description} [${expense.category}]`,
        correlationId,
      })
    );

    // Crédito em Banco (Redução de Ativo)
    const newBankBalance = currentBankBalance.subtract(expense.amount);
    transactions.push(
      new LedgerTransaction({
        id: idGenerator(),
        userId: expense.userId,
        expenseId: expense.id,
        entryType: LedgerEntryTypeVO.credit(),
        accountCategory: 'ASSET',
        amount: expense.amount,
        balanceAfter: newBankBalance,
        description: `Pagamento Despesa: ${expense.description}`,
        correlationId,
      })
    );

    this.assertDoubleEntryBalance(transactions);

    return {
      correlationId,
      transactions,
      totalDebit: expense.amount,
      totalCredit: expense.amount,
    };
  }

  /**
   * Valida a invariante fundamental da contabilidade: Total Débitos === Total Créditos
   */
  private assertDoubleEntryBalance(transactions: LedgerTransaction[]): void {
    let totalDebit = Money.zero();
    let totalCredit = Money.zero();

    for (const tx of transactions) {
      if (tx.entryType.isDebit()) {
        totalDebit = totalDebit.add(tx.amount);
      } else {
        totalCredit = totalCredit.add(tx.amount);
      }
    }

    if (!totalDebit.equals(totalCredit)) {
      throw new LedgerImbalanceError(totalDebit.toDatabaseDecimal(), totalCredit.toDatabaseDecimal());
    }
  }
}
