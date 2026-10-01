export type LedgerEntryType = 'DEBIT' | 'CREDIT';

export type AccountCategory = 
  | 'ASSET'         // Ativo (Ex: Caixa, Banco, Contas a Receber)
  | 'LIABILITY'     // Passivo (Ex: Obrigações a Pagar)
  | 'EQUITY'        // Patrimônio Líquido
  | 'REVENUE'       // Receita
  | 'EXPENSE'       // Despesa
  | 'TAX_RESERVE';  // Reserva de Impostos (Cofre Virtual)

export class LedgerEntryTypeVO {
  private readonly type: LedgerEntryType;

  private constructor(type: LedgerEntryType) {
    this.type = type;
  }

  public static debit(): LedgerEntryTypeVO {
    return new LedgerEntryTypeVO('DEBIT');
  }

  public static credit(): LedgerEntryTypeVO {
    return new LedgerEntryTypeVO('CREDIT');
  }

  public static from(value: string): LedgerEntryTypeVO {
    const normalized = value.toUpperCase();
    if (normalized !== 'DEBIT' && normalized !== 'CREDIT') {
      throw new Error(`Tipo de lançamento do ledger inválido: ${value}`);
    }
    return new LedgerEntryTypeVO(normalized as LedgerEntryType);
  }

  public getValue(): LedgerEntryType {
    return this.type;
  }

  public isDebit(): boolean {
    return this.type === 'DEBIT';
  }

  public isCredit(): boolean {
    return this.type === 'CREDIT';
  }
}
