import { IInvoiceRepository } from '../../src/domain/repositories/invoice-repository.interface';
import { Invoice } from '../../src/domain/entities/invoice.entity';
import { InvoiceStatusType } from '../../src/domain/value-objects/invoice-status.vo';

export class MockInvoiceRepository implements IInvoiceRepository {
  public invoices: Map<string, Invoice> = new Map();

  public async findById(id: string): Promise<Invoice | null> {
    return this.invoices.get(id) || null;
  }

  public async findByUserId(
    userId: string,
    filters?: { status?: InvoiceStatusType; dueDateFrom?: Date; dueDateTo?: Date },
  ): Promise<Invoice[]> {
    const list = Array.from(this.invoices.values()).filter((inv) => inv.userId === userId);

    return list.filter((inv) => {
      if (filters?.status && inv.status.getValue() !== filters.status) return false;
      if (filters?.dueDateFrom && inv.dueDate < filters.dueDateFrom) return false;
      if (filters?.dueDateTo && inv.dueDate > filters.dueDateTo) return false;
      return true;
    });
  }

  public async save(invoice: Invoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }

  public async update(invoice: Invoice): Promise<void> {
    this.invoices.set(invoice.id, invoice);
  }
}
