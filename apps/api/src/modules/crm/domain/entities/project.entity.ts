import { Money } from '../../../../domain/value-objects/money.vo';

export interface ProjectProps {
  id: string;
  userId: string;
  clientId: string;
  contractId?: string | null;
  name: string;
  description?: string | null;
  budget: Money;
  status: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class Project {
  private readonly props: ProjectProps;

  constructor(props: ProjectProps) {
    this.props = {
      ...props,
      contractId: props.contractId ?? null,
      description: props.description ?? null,
      status: props.status ?? 'IN_PROGRESS',
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

  public get contractId(): string | null | undefined {
    return this.props.contractId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | null | undefined {
    return this.props.description;
  }

  public get budget(): Money {
    return this.props.budget;
  }

  public get status(): string {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public complete(): void {
    this.props.status = 'COMPLETED';
    this.props.updatedAt = new Date();
  }
}
