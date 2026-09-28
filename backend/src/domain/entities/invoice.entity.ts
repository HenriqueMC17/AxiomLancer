import { Decimal } from 'decimal.js';
import { Money } from '../value-objects/money.vo';
import { InvoiceStatusVO } from '../value-objects/invoice-status.vo';
import { TaxBreakdown } from '../value-objects/tax-breakdown.vo';
import { DomainError } from '../errors/domain.error';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: string; // formato string para evitar floats
  total: string;
}

export interface InvoiceProps {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientTaxId: string;
  grossAmount: Money;
  taxRate: Decimal; // Fração decimal (ex: 0.0600 = 6.00%)
  taxAmount: Money;
  netAmount: Money;
  status: InvoiceStatusVO;
  dueDate: Date;
  issuedAt?: Date | null;
  paidAt?: Date | null;
  cancelledAt?: Date | null;
  description?: string | null;
  items: InvoiceItem[];
  taxBreakdown?: TaxBreakdown | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice {
  private readonly props: InvoiceProps;

  constructor(props: InvoiceProps) {
    // Validação estrita de integridade matemática: Bruto = Líquido + Imposto
    const calculatedSum = props.netAmount.add(props.taxAmount);
    if (!props.grossAmount.equals(calculatedSum)) {
      throw new DomainError(
        `Violação de integridade na fatura: Bruto (${props.grossAmount.toDatabaseDecimal()}) ` +
        `não é igual à soma de Líquido (${props.netAmount.toDatabaseDecimal()}) + Imposto (${props.taxAmount.toDatabaseDecimal()}).`
      );
    }

    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get clientName(): string {
    return this.props.clientName;
  }

  public get clientEmail(): string {
    return this.props.clientEmail;
  }

  public get clientTaxId(): string {
    return this.props.clientTaxId;
  }

  public get grossAmount(): Money {
    return this.props.grossAmount;
  }

  public get taxRate(): Decimal {
    return this.props.taxRate;
  }

  public get taxAmount(): Money {
    return this.props.taxAmount;
  }

  public get netAmount(): Money {
    return this.props.netAmount;
  }

  public get status(): InvoiceStatusVO {
    return this.props.status;
  }

  public get dueDate(): Date {
    return this.props.dueDate;
  }

  public get issuedAt(): Date | null | undefined {
    return this.props.issuedAt;
  }

  public get paidAt(): Date | null | undefined {
    return this.props.paidAt;
  }

  public get cancelledAt(): Date | null | undefined {
    return this.props.cancelledAt;
  }

  public get description(): string | null | undefined {
    return this.props.description;
  }

  public get items(): ReadonlyArray<InvoiceItem> {
    return Object.freeze([...this.props.items]);
  }

  public get taxBreakdown(): TaxBreakdown | null | undefined {
    return this.props.taxBreakdown;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  /**
   * Emite a fatura passando de DRAFT para ISSUED
   */
  public issue(now: Date = new Date()): void {
    this.props.status = this.props.status.transitionTo('ISSUED');
    this.props.issuedAt = now;
    this.props.updatedAt = now;
  }

  /**
   * Liquida a fatura passando para PAID
   */
  public markAsPaid(paidAt: Date = new Date()): void {
    this.props.status = this.props.status.transitionTo('PAID');
    this.props.paidAt = paidAt;
    this.props.updatedAt = paidAt;
  }

  /**
   * Marca como vencida (OVERDUE) caso passe do dueDate
   */
  public markAsOverdue(now: Date = new Date()): void {
    this.props.status = this.props.status.transitionTo('OVERDUE');
    this.props.updatedAt = now;
  }

  /**
   * Cancela a fatura
   */
  public cancel(now: Date = new Date()): void {
    this.props.status = this.props.status.transitionTo('CANCELLED');
    this.props.cancelledAt = now;
    this.props.updatedAt = now;
  }
}
