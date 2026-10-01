import { IUnitOfWork } from '../../src/application/ports/unit-of-work.interface';
import { IInvoiceRepository } from '../../src/domain/repositories/invoice-repository.interface';
import { ILedgerRepository } from '../../src/domain/repositories/ledger-repository.interface';
import { IExpenseRepository } from '../../src/domain/repositories/expense-repository.interface';
import { IDeduplicationJournalRepository } from '../../src/domain/repositories/deduplication-journal-repository.interface';
import { MockInvoiceRepository } from './mock-invoice-repository';
import { MockLedgerRepository } from './mock-ledger-repository';
import { MockDeduplicationRepository } from './mock-deduplication-repository';

export class MockUnitOfWork implements IUnitOfWork {
  public invoiceRepository: IInvoiceRepository;
  public ledgerRepository: ILedgerRepository;
  public expenseRepository: IExpenseRepository;
  public deduplicationJournalRepository: IDeduplicationJournalRepository;

  constructor() {
    this.invoiceRepository = new MockInvoiceRepository();
    this.ledgerRepository = new MockLedgerRepository();
    this.expenseRepository = {
      findById: async () => null,
      findByUserId: async () => [],
      save: async () => {},
    };
    this.deduplicationJournalRepository = new MockDeduplicationRepository();
  }

  public async executeInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    // Em testes unitários, executa diretamente no escopo com a integridade mockada
    return await work(this);
  }
}
