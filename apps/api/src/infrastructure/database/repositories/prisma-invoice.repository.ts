import { PrismaClient, Prisma } from '@prisma/client';
import { IInvoiceRepository } from '../../../domain/repositories/invoice-repository.interface';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceStatusType } from '../../../domain/value-objects/invoice-status.vo';
import { InvoiceMapper } from '../mappers/invoice.mapper';

export class PrismaInvoiceRepository implements IInvoiceRepository {
  constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient) {}

  public async findById(id: string): Promise<Invoice | null> {
    const raw = await this.prisma.invoice.findUnique({
      where: { id },
    });
    return raw ? InvoiceMapper.toDomain(raw) : null;
  }

  public async findByUserId(
    userId: string,
    filters?: { status?: InvoiceStatusType; dueDateFrom?: Date; dueDateTo?: Date },
  ): Promise<Invoice[]> {
    const where: Prisma.InvoiceWhereInput = { userId };

    if (filters?.status) {
      where.status = filters.status as unknown as Prisma.InvoiceWhereInput['status'];
    }

    if (filters?.dueDateFrom || filters?.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom;
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo;
    }

    const rawList = await this.prisma.invoice.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });

    return rawList.map(InvoiceMapper.toDomain);
  }

  public async save(invoice: Invoice): Promise<void> {
    const data = InvoiceMapper.toPersistence(invoice);
    await this.prisma.invoice.create({
      data: data as unknown as Prisma.InvoiceCreateInput,
    });
  }

  public async update(invoice: Invoice): Promise<void> {
    const data = InvoiceMapper.toPersistence(invoice);
    await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: data as unknown as Prisma.InvoiceUpdateInput,
    });
  }
}
