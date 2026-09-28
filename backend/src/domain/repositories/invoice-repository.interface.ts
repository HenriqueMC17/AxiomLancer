import { Invoice } from '../entities/invoice.entity';
import { InvoiceStatusType } from '../value-objects/invoice-status.vo';

export interface IInvoiceRepository {
  findById(id: string): Promise<Invoice | null>;
  findByUserId(userId: string, filters?: { status?: InvoiceStatusType; dueDateFrom?: Date; dueDateTo?: Date }): Promise<Invoice[]>;
  save(invoice: Invoice): Promise<void>;
  update(invoice: Invoice): Promise<void>;
}
