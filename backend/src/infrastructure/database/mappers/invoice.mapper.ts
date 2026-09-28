import { Invoice as PrismaInvoiceModel } from '@prisma/client';
import { Invoice, InvoiceItem } from '../../../domain/entities/invoice.entity';
import { Money } from '../../../domain/value-objects/money.vo';
import { InvoiceStatusVO } from '../../../domain/value-objects/invoice-status.vo';
import { TaxBreakdown } from '../../../domain/value-objects/tax-breakdown.vo';
import { Decimal } from 'decimal.js';

export class InvoiceMapper {
  public static toDomain(raw: PrismaInvoiceModel): Invoice {
    let breakdown: TaxBreakdown | null = null;
    if (raw.taxBreakdown && typeof raw.taxBreakdown === 'object') {
      const b = raw.taxBreakdown as Record<string, unknown>;
      if (Array.isArray(b.components)) {
        breakdown = TaxBreakdown.fromComponents(
          Money.from(raw.grossAmount.toString()),
          b.components.map((c: { name: string; ratePercent: string }) => ({
            name: c.name,
            ratePercent: c.ratePercent,
          })),
        );
      }
    }

    const items = (raw.items as unknown as InvoiceItem[]) || [];

    return new Invoice({
      id: raw.id,
      userId: raw.userId,
      clientName: raw.clientName,
      clientEmail: raw.clientEmail,
      clientTaxId: raw.clientTaxId,
      grossAmount: Money.from(raw.grossAmount.toString()),
      taxRate: new Decimal(raw.taxRate.toString()),
      taxAmount: Money.from(raw.taxAmount.toString()),
      netAmount: Money.from(raw.netAmount.toString()),
      status: InvoiceStatusVO.from(raw.status),
      dueDate: raw.dueDate,
      issuedAt: raw.issuedAt,
      paidAt: raw.paidAt,
      cancelledAt: raw.cancelledAt,
      description: raw.description,
      items,
      taxBreakdown: breakdown,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(entity: Invoice): Record<string, unknown> {
    return {
      id: entity.id,
      userId: entity.userId,
      clientName: entity.clientName,
      clientEmail: entity.clientEmail,
      clientTaxId: entity.clientTaxId,
      grossAmount: entity.grossAmount.toDatabaseDecimal(),
      taxRate: entity.taxRate.toFixed(4),
      taxAmount: entity.taxAmount.toDatabaseDecimal(),
      netAmount: entity.netAmount.toDatabaseDecimal(),
      status: entity.status.getValue(),
      dueDate: entity.dueDate,
      issuedAt: entity.issuedAt || null,
      paidAt: entity.paidAt || null,
      cancelledAt: entity.cancelledAt || null,
      description: entity.description || null,
      items: entity.items as unknown,
      taxBreakdown: entity.taxBreakdown ? entity.taxBreakdown.toJSON() : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
