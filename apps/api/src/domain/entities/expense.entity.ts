import { Money } from '../value-objects/money.vo';

export interface ExpenseProps {
  id: string;
  userId: string;
  description: string;
  category: string;
  amount: Money;
  taxDeductible: boolean;
  date: Date;
  receiptUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Expense {
  private readonly props: ExpenseProps;

  constructor(props: ExpenseProps) {
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

  public get description(): string {
    return this.props.description;
  }

  public get category(): string {
    return this.props.category;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  public get taxDeductible(): boolean {
    return this.props.taxDeductible;
  }

  public get date(): Date {
    return this.props.date;
  }

  public get receiptUrl(): string | null | undefined {
    return this.props.receiptUrl;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }
}
