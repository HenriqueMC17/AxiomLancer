import { Money } from '../value-objects/money.vo';
import { LedgerEntryTypeVO, AccountCategory } from '../value-objects/ledger-entry.vo';
import { DomainError } from '../errors/domain.error';

export interface LedgerTransactionProps {
  id: string;
  userId: string;
  invoiceId?: string | null;
  expenseId?: string | null;
  entryType: LedgerEntryTypeVO;
  accountCategory: AccountCategory;
  amount: Money;
  balanceAfter: Money;
  description: string;
  correlationId?: string | null;
  transactionDate?: Date;
  createdAt?: Date;
}

export class LedgerTransaction {
  private readonly props: LedgerTransactionProps;

  constructor(props: LedgerTransactionProps) {
    if (props.amount.isNegative() || props.amount.isZero()) {
      throw new DomainError('O montante de um lançamento contábil no Ledger deve ser estritamente positivo.');
    }

    this.props = {
      ...props,
      transactionDate: props.transactionDate || new Date(),
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get invoiceId(): string | null | undefined {
    return this.props.invoiceId;
  }

  public get expenseId(): string | null | undefined {
    return this.props.expenseId;
  }

  public get entryType(): LedgerEntryTypeVO {
    return this.props.entryType;
  }

  public get accountCategory(): AccountCategory {
    return this.props.accountCategory;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  public get balanceAfter(): Money {
    return this.props.balanceAfter;
  }

  public get description(): string {
    return this.props.description;
  }

  public get correlationId(): string | null | undefined {
    return this.props.correlationId;
  }

  public get transactionDate(): Date {
    return this.props.transactionDate!;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }
}
