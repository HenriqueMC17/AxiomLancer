/**
 * Port para Transactional Outbox.
 * Elimina o Dual Write Problem unificando a mutacao de negocio com o registro
 * de evento na mesma transacao atomica do banco de dados (ADR Segundo Cerebro).
 */
export interface OutboxEvent {
  id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: "PENDING" | "PUBLISHED" | "FAILED";
  created_at: string;
  published_at?: string;
  error_message?: string;
}

export interface IOutboxRepository {
  saveEvent(event: Omit<OutboxEvent, "id" | "created_at" | "status">): Promise<OutboxEvent>;
  fetchPending(limit?: number): Promise<OutboxEvent[]>;
  markAsPublished(eventId: string): Promise<void>;
  markAsFailed(eventId: string, error: string): Promise<void>;
}