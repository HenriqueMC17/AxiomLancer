import { randomUUID } from 'crypto';
import { IUnitOfWork } from '../ports/unit-of-work.interface';
import { InvoiceGenerationService } from '../../domain/services/invoice-generation.service';
import { LedgerPostingService } from '../../domain/services/ledger-posting.service';
import { CreateInvoiceInputDTO, InvoiceResponseDTO } from '../dtos/invoice.dto';
import { Money } from '../../domain/value-objects/money.vo';

export class CreateInvoiceUseCase {
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly invoiceGenerationService: InvoiceGenerationService = new InvoiceGenerationService(),
    private readonly ledgerPostingService: LedgerPostingService = new LedgerPostingService(),
  ) {}

  public async execute(input: CreateInvoiceInputDTO): Promise<InvoiceResponseDTO> {
    const invoiceId = randomUUID();
    const dueDate = new Date(input.dueDate);

    // Geração determinística da entidade pura Invoice
    const invoice = this.invoiceGenerationService.generate({
      id: invoiceId,
      userId: input.userId,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientTaxId: input.clientTaxId,
      items: input.items,
      dueDate,
      description: input.description,
      taxRatePercent: input.taxRatePercent,
      taxComponents: input.taxComponents,
      issueImmediately: input.issueImmediately ?? true,
    });

    // Persistência Transacional Estrita (ACID)
    await this.uow.executeInTransaction(async (txUow) => {
      // 1. Salva a fatura
      await txUow.invoiceRepository.save(invoice);

      // 2. Se a fatura foi emitida, realiza os lançamentos de partida dobrada no Ledger
      if (invoice.status.isIssued()) {
        const currentAsset = await txUow.ledgerRepository.getAccountBalance(input.userId, 'ASSET');
        const currentRevenue = await txUow.ledgerRepository.getAccountBalance(input.userId, 'REVENUE');
        const currentTax = await txUow.ledgerRepository.getAccountBalance(input.userId, 'TAX_RESERVE');

        const correlationId = randomUUID();
        const batch = this.ledgerPostingService.createInvoiceIssuedEntries(
          invoice,
          currentAsset,
          currentRevenue,
          currentTax,
          correlationId,
          () => randomUUID(),
        );

        await txUow.ledgerRepository.saveBatch(batch.transactions);
      }
    });

    return {
      id: invoice.id,
      userId: invoice.userId,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientTaxId: invoice.clientTaxId,
      grossAmount: invoice.grossAmount.toDatabaseDecimal(),
      taxRate: invoice.taxRate.toFixed(4),
      taxAmount: invoice.taxAmount.toDatabaseDecimal(),
      netAmount: invoice.netAmount.toDatabaseDecimal(),
      status: invoice.status.getValue(),
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      issuedAt: invoice.issuedAt ? invoice.issuedAt.toISOString() : null,
      paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
      cancelledAt: invoice.cancelledAt ? invoice.cancelledAt.toISOString() : null,
      description: invoice.description || null,
      items: invoice.items.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
      taxBreakdown: invoice.taxBreakdown ? (invoice.taxBreakdown.toJSON() as Record<string, unknown>) : null,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    };
  }
}
