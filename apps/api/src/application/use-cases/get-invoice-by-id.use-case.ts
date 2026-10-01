import { IInvoiceRepository } from '../../domain/repositories/invoice-repository.interface';
import { InvoiceResponseDTO } from '../dtos/invoice.dto';
import { EntityNotFoundError } from '../../domain/errors/domain.error';

export class GetInvoiceByIdUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  public async execute(invoiceId: string): Promise<InvoiceResponseDTO> {
    const invoice = await this.invoiceRepository.findById(invoiceId);

    if (!invoice) {
      throw new EntityNotFoundError('Invoice', invoiceId);
    }

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
