import { randomUUID } from 'crypto';
import { IUnitOfWork } from '../ports/unit-of-work.interface';
import { LedgerPostingService } from '../../domain/services/ledger-posting.service';
import { EntityNotFoundError, DomainError } from '../../domain/errors/domain.error';
import { OutboxEvent } from '../../domain/entities/outbox-event.entity';

export interface SettleInvoiceInputDTO {
  invoiceId: string;
  userId: string;
  paidAt?: string;
}

export interface SettleInvoiceOutputDTO {
  invoiceId: string;
  status: string;
  paidAt: string;
  netDeposited: string;
  taxReservedInSafe: string;
  receivablesCleared: string;
}

export class SettleInvoiceUseCase {
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly ledgerPostingService: LedgerPostingService = new LedgerPostingService(),
  ) {}

  public async execute(input: SettleInvoiceInputDTO): Promise<SettleInvoiceOutputDTO> {
    const paymentDate = input.paidAt ? new Date(input.paidAt) : new Date();

    return await this.uow.executeInTransaction(async (txUow) => {
      const invoice = await txUow.invoiceRepository.findById(input.invoiceId);
      if (!invoice) {
        throw new EntityNotFoundError('Invoice', input.invoiceId);
      }

      if (invoice.userId !== input.userId) {
        throw new DomainError('Acesso não autorizado à fatura informada.');
      }

      // Transiciona a fatura para PAID
      invoice.markAsPaid(paymentDate);
      await txUow.invoiceRepository.update(invoice);

      // Busca saldos contábeis para atualizar o Ledger com partidas dobradas
      const currentBank = await txUow.ledgerRepository.getAccountBalance(input.userId, 'ASSET');
      const currentTaxSafe = await txUow.ledgerRepository.getAccountBalance(input.userId, 'TAX_RESERVE');
      const currentReceivables = await txUow.ledgerRepository.getAccountBalance(input.userId, 'ASSET');

      const correlationId = randomUUID();
      const batch = this.ledgerPostingService.createInvoicePaidEntries(
        invoice,
        currentBank,
        currentTaxSafe,
        currentReceivables,
        correlationId,
        () => randomUUID(),
      );

      await txUow.ledgerRepository.saveBatch(batch.transactions);

      // Registra evento transacional no Outbox para sincronização com Convex Cloud
      const outboxEvent = new OutboxEvent({
        id: randomUUID(),
        userId: invoice.userId,
        aggregateType: 'INVOICE',
        aggregateId: invoice.id,
        eventType: 'INVOICE_SETTLED',
        payload: {
          invoiceId: invoice.id,
          userId: invoice.userId,
          status: 'PAID',
          paidAt: invoice.paidAt!.toISOString(),
          netDeposited: invoice.netAmount.toDatabaseDecimal(),
          taxReservedInSafe: invoice.taxAmount.toDatabaseDecimal(),
          receivablesCleared: invoice.grossAmount.toDatabaseDecimal(),
        },
        createdAt: new Date(),
      });

      await txUow.outboxRepository.save(outboxEvent);

      return {
        invoiceId: invoice.id,
        status: invoice.status.getValue(),
        paidAt: invoice.paidAt!.toISOString(),
        netDeposited: invoice.netAmount.toDatabaseDecimal(),
        taxReservedInSafe: invoice.taxAmount.toDatabaseDecimal(),
        receivablesCleared: invoice.grossAmount.toDatabaseDecimal(),
      };
    });
  }
}
