import { DomainError } from '../errors/domain.error';

export class InvalidIdempotencyKeyError extends DomainError {
  public readonly code = 'INVALID_IDEMPOTENCY_KEY';

  constructor(message: string = 'Chave de idempotência inválida.') {
    super(message);
  }
}

export class IdempotencyKeyVO {
  private readonly key: string;

  private constructor(key: string) {
    if (!key || key.trim().length === 0) {
      throw new InvalidIdempotencyKeyError('Chave de idempotência não pode ser vazia.');
    }
    if (key.length > 255) {
      throw new InvalidIdempotencyKeyError('Chave de idempotência excede o limite de 255 caracteres.');
    }
    this.key = key.trim();
  }

  public static from(key: string): IdempotencyKeyVO {
    return new IdempotencyKeyVO(key);
  }

  /**
   * Gera chave determinística única para régua de cobrança:
   * Ex: "BILLING_SCHEDULE:INV-12345:DUE-3" ou "invoice_id + trigger_day"
   */
  public static forBillingTrigger(invoiceId: string, triggerDay: string | number): IdempotencyKeyVO {
    return new IdempotencyKeyVO(`BILLING_TRIGGER:${invoiceId}:DAY_${triggerDay}`);
  }

  /**
   * Gera chave para eventos arbitrários
   */
  public static forEvent(eventType: string, eventId: string): IdempotencyKeyVO {
    return new IdempotencyKeyVO(`EVENT:${eventType.toUpperCase()}:${eventId}`);
  }

  public getValue(): string {
    return this.key;
  }

  public equals(other: IdempotencyKeyVO): boolean {
    return this.key === other.key;
  }
}
