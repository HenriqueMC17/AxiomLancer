import { IInvoiceRepository } from '../../domain/repositories/invoice-repository.interface';
import { ILedgerRepository } from '../../domain/repositories/ledger-repository.interface';
import { IExpenseRepository } from '../../domain/repositories/expense-repository.interface';
import { IDeduplicationJournalRepository } from '../../domain/repositories/deduplication-journal-repository.interface';

export interface IUnitOfWork {
  invoiceRepository: IInvoiceRepository;
  ledgerRepository: ILedgerRepository;
  expenseRepository: IExpenseRepository;
  deduplicationJournalRepository: IDeduplicationJournalRepository;

  /**
   * Executa uma sequência de operações dentro de uma transação ACID estrita no PostgreSQL.
   * Se qualquer operação falhar, sofre rollback completo.
   */
  executeInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
