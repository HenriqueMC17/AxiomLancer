import { Decimal } from 'decimal.js';

export type TaxRegime = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI' | 'AUTONOMO';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  taxId: string; // CPF ou CNPJ
  taxRegime: TaxRegime;
  defaultTaxRate: Decimal; // Ex: 0.0600 (6%)
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get name(): string {
    return this.props.name;
  }

  public get taxId(): string {
    return this.props.taxId;
  }

  public get taxRegime(): TaxRegime {
    return this.props.taxRegime;
  }

  public get defaultTaxRate(): Decimal {
    return this.props.defaultTaxRate;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }
}
