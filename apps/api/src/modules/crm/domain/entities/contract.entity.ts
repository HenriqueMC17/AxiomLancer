import { Money } from '../../../../domain/value-objects/money.vo';
import { ContractStatus } from '@axiom/contracts';

export interface ContractProps {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description?: string | null;
  contractValue: Money;
  status: ContractStatus;
  startDate: Date;
  endDate?: Date | null;
  signedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class Contract {
  private readonly props: ContractProps;

  constructor(props: ContractProps) {
    this.props = {
      ...props,
      description: props.description ?? null,
      status: props.status ?? 'PENDING_SIGNATURE',
      endDate: props.endDate ?? null,
      signedAt: props.signedAt ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get clientId(): string {
    return this.props.clientId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string | null | undefined {
    return this.props.description;
  }

  public get contractValue(): Money {
    return this.props.contractValue;
  }

  public get status(): ContractStatus {
    return this.props.status;
  }

  public get startDate(): Date {
    return this.props.startDate;
  }

  public get endDate(): Date | null | undefined {
    return this.props.endDate;
  }

  public get signedAt(): Date | null | undefined {
    return this.props.signedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public sign(): void {
    if (this.props.status !== 'PENDING_SIGNATURE') {
      throw new Error(`Contrato já assinado ou em estado inválido: ${this.props.status}`);
    }
    this.props.status = 'ACTIVE';
    this.props.signedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public complete(): void {
    if (this.props.status !== 'ACTIVE') {
      throw new Error(`Apenas contratos ativos podem ser concluídos: ${this.props.status}`);
    }
    this.props.status = 'COMPLETED';
    this.props.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.props.status === 'COMPLETED') {
      throw new Error('Contratos concluídos não podem ser cancelados.');
    }
    this.props.status = 'CANCELED';
    this.props.updatedAt = new Date();
  }
}
