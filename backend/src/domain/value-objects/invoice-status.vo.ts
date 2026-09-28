import { InvoiceStateError } from '../errors/domain.error';

export type InvoiceStatusType = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export class InvoiceStatusVO {
  private readonly status: InvoiceStatusType;

  private static readonly VALID_TRANSITIONS: Record<InvoiceStatusType, InvoiceStatusType[]> = {
    DRAFT: ['ISSUED', 'CANCELLED'],
    ISSUED: ['PAID', 'OVERDUE', 'CANCELLED'],
    OVERDUE: ['PAID', 'CANCELLED'],
    PAID: [], // Estado final
    CANCELLED: [], // Estado final
  };

  private constructor(status: InvoiceStatusType) {
    this.status = status;
  }

  public static draft(): InvoiceStatusVO {
    return new InvoiceStatusVO('DRAFT');
  }

  public static issued(): InvoiceStatusVO {
    return new InvoiceStatusVO('ISSUED');
  }

  public static paid(): InvoiceStatusVO {
    return new InvoiceStatusVO('PAID');
  }

  public static overdue(): InvoiceStatusVO {
    return new InvoiceStatusVO('OVERDUE');
  }

  public static cancelled(): InvoiceStatusVO {
    return new InvoiceStatusVO('CANCELLED');
  }

  public static from(value: string): InvoiceStatusVO {
    const normalized = value.toUpperCase() as InvoiceStatusType;
    if (!Object.keys(InvoiceStatusVO.VALID_TRANSITIONS).includes(normalized)) {
      throw new InvoiceStateError('UNKNOWN', value);
    }
    return new InvoiceStatusVO(normalized);
  }

  public canTransitionTo(nextStatus: InvoiceStatusType): boolean {
    const allowed = InvoiceStatusVO.VALID_TRANSITIONS[this.status];
    return allowed.includes(nextStatus);
  }

  public transitionTo(nextStatus: InvoiceStatusType): InvoiceStatusVO {
    if (!this.canTransitionTo(nextStatus)) {
      throw new InvoiceStateError(this.status, nextStatus);
    }
    return new InvoiceStatusVO(nextStatus);
  }

  public getValue(): InvoiceStatusType {
    return this.status;
  }

  public isDraft(): boolean {
    return this.status === 'DRAFT';
  }

  public isIssued(): boolean {
    return this.status === 'ISSUED';
  }

  public isPaid(): boolean {
    return this.status === 'PAID';
  }

  public isOverdue(): boolean {
    return this.status === 'OVERDUE';
  }

  public isCancelled(): boolean {
    return this.status === 'CANCELLED';
  }

  public isTerminal(): boolean {
    return this.status === 'PAID' || this.status === 'CANCELLED';
  }
}
