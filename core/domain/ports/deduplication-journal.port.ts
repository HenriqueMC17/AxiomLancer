import { DeduplicationJournal } from "../types";

/**
 * Port para o Deduplication Journal.
 * Garante idempotencia estrita em nivel de banco de dados, convertendo entrega
 * At-Least-Once em Effectively-Once e eliminando cobrancas ou disparos duplicados.
 */
export interface IDeduplicationJournalRepository {
  exists(eventId: string): Promise<boolean>;
  record(entry: DeduplicationJournal): Promise<void>;
  listByInvoice(invoiceId: string): Promise<DeduplicationJournal[]>;
}