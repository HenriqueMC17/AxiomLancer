import { PrismaClient, Prisma } from '@prisma/client';
import { IUnitOfWork } from '../../application/ports/unit-of-work.interface';
import { IInvoiceRepository } from '../../domain/repositories/invoice-repository.interface';
import { ILedgerRepository } from '../../domain/repositories/ledger-repository.interface';
import { IExpenseRepository } from '../../domain/repositories/expense-repository.interface';
import { IDeduplicationJournalRepository } from '../../domain/repositories/deduplication-journal-repository.interface';
import { IOutboxRepository } from '../../domain/repositories/outbox-repository.interface';
import { PrismaInvoiceRepository } from './repositories/prisma-invoice.repository';
import { PrismaLedgerRepository } from './repositories/prisma-ledger.repository';
import { PrismaExpenseRepository } from './repositories/prisma-expense.repository';
import { PrismaDeduplicationRepository } from './repositories/prisma-deduplication.repository';
import { PrismaOutboxRepository } from './repositories/prisma-outbox.repository';
import { prisma as defaultPrisma } from './prisma.client';

export class PrismaUnitOfWork implements IUnitOfWork {
  public invoiceRepository: IInvoiceRepository;
  public ledgerRepository: ILedgerRepository;
  public expenseRepository: IExpenseRepository;
  public deduplicationJournalRepository: IDeduplicationJournalRepository;
  public outboxRepository: IOutboxRepository;

  constructor(private readonly client: PrismaClient | Prisma.TransactionClient = defaultPrisma) {
    this.invoiceRepository = new PrismaInvoiceRepository(this.client);
    this.ledgerRepository = new PrismaLedgerRepository(this.client);
    this.expenseRepository = new PrismaExpenseRepository(this.client);
    this.deduplicationJournalRepository = new PrismaDeduplicationRepository(this.client);
    this.outboxRepository = new PrismaOutboxRepository(this.client);
  }

  /**
   * Executa um bloco de operações atômicas sob transação ACID estrita no PostgreSQL
   */
  public async executeInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    if ('$transaction' in this.client) {
      return await (this.client as PrismaClient).$transaction(
        async (tx: Prisma.TransactionClient) => {
          const transactionalUow = new PrismaUnitOfWork(tx);
          return await work(transactionalUow);
        },
        {
          maxWait: 5000,
          timeout: 10000,
        },
      );
    }

    // Se já estiver dentro de uma transação aninhada
    return await work(this);
  }
}
