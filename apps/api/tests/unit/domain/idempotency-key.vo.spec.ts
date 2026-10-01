import { describe, it, expect } from 'vitest';
import { IdempotencyKeyVO, InvalidIdempotencyKeyError } from '../../../src/domain/value-objects/idempotency-key.vo';

describe('IdempotencyKeyVO (Strict Deduplication & Key Formats)', () => {
  it('deve gerar chave formatada para régua de cobrança', () => {
    const key = IdempotencyKeyVO.forBillingTrigger('inv-uuid-1234', -3);
    expect(key.getValue()).toBe('BILLING_TRIGGER:inv-uuid-1234:DAY_-3');
  });

  it('deve gerar chave para eventos de auditoria', () => {
    const key = IdempotencyKeyVO.forEvent('invoice_created', 'evt-999');
    expect(key.getValue()).toBe('EVENT:INVOICE_CREATED:evt-999');
  });

  it('deve rejeitar chave vazia ou apenas com espaços', () => {
    expect(() => IdempotencyKeyVO.from('')).toThrow(InvalidIdempotencyKeyError);
    expect(() => IdempotencyKeyVO.from('   ')).toThrow(InvalidIdempotencyKeyError);
  });

  it('deve rejeitar chave que ultrapasse 255 caracteres', () => {
    const longString = 'a'.repeat(256);
    expect(() => IdempotencyKeyVO.from(longString)).toThrow(InvalidIdempotencyKeyError);
  });
});
