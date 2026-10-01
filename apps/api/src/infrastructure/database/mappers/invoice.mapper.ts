import { Invoice as PrismaInvoiceModel } from '@prisma/client';
import { Invoice, InvoiceItem } from '../../../domain/entities/invoice.entity';
import { Money } from '../../../domain/value-objects/money.vo';
import { InvoiceStatusVO } from '../../../domain/value-objects/invoice-status.vo';
import { Decimal } from 'decimal.js';

export class InvoiceMapper {
  public static toDomain(raw: PrismaInvoiceModel & { client?: { legalName: string; email: string } }): Invoice {
    const gross = Money.from(raw.grossValue.toString());
    const taxRate = new Decimal(raw.taxRate.toString());
    const taxAmount = gross.multiply(taxRate.dividedBy(100));
    const net = Money.from(raw.netValue.toString());

    return new Invoice({
      id: raw.id,
      userId: raw.userId,
      clientName: raw.client?.legalName || 'Cliente Corporativo',
      clientEmail: raw.client?.email || 'cliente@empresa.com',
      clientTaxId: '00.000.000/0001-99',
      grossAmount: gross,
      taxRate,
      taxAmount,
      netAmount: net,
      status: InvoiceStatusVO.from((raw.status as unknown as string) === 'PENDING' ? 'ISSUED' : (raw.status as unknown as string)),
      dueDate: raw.dueDate,
      items: [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt || undefined,
    });
  }

  public static toPersistence(entity: Invoice): Record<string, unknown> {
    return {
      id: entity.id,
      userId: entity.userId,
      clientId: '00000000-0000-0000-0000-000000000001',
      invoiceNumber: entity.id,
      status: entity.status.getValue() === 'ISSUED' ? 'PENDING' : entity.status.getValue(),
      dueDate: entity.dueDate,
      grossValue: entity.grossAmount.toDatabaseDecimal(),
      taxRate: entity.taxRate.toFixed(2),
      netValue: entity.netAmount.toDatabaseDecimal(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
