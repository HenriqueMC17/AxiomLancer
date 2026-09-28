export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidMoneyError extends DomainError {
  constructor(message: string = 'Valor monetário inválido ou precisão violada.') {
    super(message, 'INVALID_MONEY');
  }
}

export class InvalidTaxRateError extends DomainError {
  constructor(message: string = 'Alíquota de imposto deve estar entre 0% e 100%.') {
    super(message, 'INVALID_TAX_RATE');
  }
}

export class InvoiceStateError extends DomainError {
  constructor(fromStatus: string, toStatus: string) {
    super(
      `Transição de estado inválida para a fatura: de '${fromStatus}' para '${toStatus}'.`,
      'INVALID_INVOICE_STATE_TRANSITION',
    );
  }
}

export class DuplicateExecutionError extends DomainError {
  constructor(key: string, message: string = `Operação bloqueada por idempotência para a chave '${key}'.`) {
    super(message, 'DUPLICATE_EXECUTION_LOCKED');
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} com ID '${id}' não foi encontrado.`, 'ENTITY_NOT_FOUND');
  }
}

export class LedgerImbalanceError extends DomainError {
  constructor(debitTotal: string, creditTotal: string) {
    super(
      `Violação da regra de partida dobrada: Débito (${debitTotal}) não é igual ao Crédito (${creditTotal}).`,
      'LEDGER_IMBALANCE',
    );
  }
}
