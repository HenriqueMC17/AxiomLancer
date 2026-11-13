import {
  IOutboxRepository,
  OutboxEvent,
} from "@/core/domain/ports/outbox.port";
import { IDeduplicationJournalRepository } from "@/core/domain/ports/deduplication-journal.port";
import { DeduplicationJournal } from "@/core/domain/types";

/**
 * Adaptador de Infraestrutura para Transactional Outbox e Deduplication Journal.
 * Fielmente desenhado conforme o ADR de Resiliencia Transacional e Eliminacao do Dual Write
 * do Segundo Cerebro (knowledge-base/systems-data-runtimes/distributed-transactions-resilience).
 */
export class TransactionalOutboxAdapter
  implements IOutboxRepository, IDeduplicationJournalRepository
{
  private outbox: OutboxEvent[] = [];
  private journal: Map<string, DeduplicationJournal> = new Map();

  // === IDeduplicationJournalRepository ===

  public async exists(eventId: string): Promise<boolean> {
    return this.journal.has(eventId);
  }

  public async record(entry: DeduplicationJournal): Promise<void> {
    if (this.journal.has(entry.event_id)) {
      // Simulacao do UNIQUE constraint UK_dedup_event_consumer
      throw new Error(`Violação de unicidade no DeduplicationJournal: event_id "${entry.event_id}" ja registrado.`);
    }
    this.journal.set(entry.event_id, { ...entry });
  }

  public async listByInvoice(invoiceId: string): Promise<DeduplicationJournal[]> {
    return Array.from(this.journal.values()).filter((e) => e.invoice_id === invoiceId);
  }

  // === IOutboxRepository ===

  public async saveEvent(
    event: Omit<OutboxEvent, "id" | "created_at" | "status">
  ): Promise<OutboxEvent> {
    const newEvent: OutboxEvent = {
      ...event,
      id: `outbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: "PENDING",
      created_at: new Date().toISOString(),
    };

    this.outbox.push(newEvent);
    return newEvent;
  }

  public async fetchPending(limit: number = 50): Promise<OutboxEvent[]> {
    return this.outbox.filter((e) => e.status === "PENDING").slice(0, limit);
  }

  public async markAsPublished(eventId: string): Promise<void> {
    const item = this.outbox.find((e) => e.id === eventId);
    if (item) {
      item.status = "PUBLISHED";
      item.published_at = new Date().toISOString();
    }
  }

  public async markAsFailed(eventId: string, error: string): Promise<void> {
    const item = this.outbox.find((e) => e.id === eventId);
    if (item) {
      item.status = "FAILED";
      item.error_message = error;
    }
  }

  // Utilitario para testes e inspecao
  public getAllEvents(): OutboxEvent[] {
    return [...this.outbox];
  }

  public clear(): void {
    this.outbox = [];
    this.journal.clear();
  }
}