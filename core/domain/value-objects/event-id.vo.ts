import { createHash } from "crypto";

/**
 * Value Object para geracao de IDs de idempotencia deterministicos.
 * Usa SHA-256 via modulo crypto nativo do Node.js (zero dependencia extra).
 *
 * Garante unicidade e colisao-resistencia para o DeduplicationJournal,
 * conforme contrato especificado em rules-engine.service.ts.
 */
export class EventId {
  /**
   * Gera um EventId deterministico baseado em SHA-256.
   * @param invoiceId - ID da fatura
   * @param triggerDay - Dia do disparo (YYYY-MM-DD)
   * @param ruleId - ID da regra de cobranca
   * @returns Hash hex de 64 caracteres (SHA-256)
   */
  public static generate(
    invoiceId: string,
    triggerDay: string,
    ruleId: string
  ): string {
    return createHash("sha256")
      .update(`${invoiceId}:${triggerDay}:${ruleId}`)
      .digest("hex");
  }
}