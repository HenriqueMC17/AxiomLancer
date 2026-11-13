import { describe, it, expect, beforeEach } from "vitest";
import { TransactionalOutboxAdapter } from "@/infrastructure/resilience/transactional-outbox.adapter";

describe("TransactionalOutboxAdapter - Eliminacao de Dual Write e Idempotencia", () => {
  let adapter: TransactionalOutboxAdapter;

  beforeEach(() => {
    adapter = new TransactionalOutboxAdapter();
  });

  it("deve salvar evento pendente e marcar como publicado", async () => {
    const event = await adapter.saveEvent({
      aggregate_type: "INVOICE",
      aggregate_id: "inv_001",
      event_type: "InvoiceCreated",
      payload: { amount: 2500.0 },
    });

    expect(event.id).toBeDefined();
    expect(event.status).toBe("PENDING");

    const pending = await adapter.fetchPending();
    expect(pending.length).toBe(1);

    await adapter.markAsPublished(event.id);
    const updated = await adapter.fetchPending();
    expect(updated.length).toBe(0);
  });

  it("deve rejeitar duplicidade de event_id no DeduplicationJournal", async () => {
    const entry = {
      event_id: "dedup_inv_001_2026-11-13_rule_d0",
      invoice_id: "inv_001",
      trigger_day: "2026-11-13",
      rule_id: "rule_d0",
      execution_id: "exec_01",
      processed_at: new Date().toISOString(),
    };

    await adapter.record(entry);
    const exists = await adapter.exists(entry.event_id);
    expect(exists).toBe(true);

    // Tentativa de duplicidade deve estourar erro de unicidade (UNIQUE constraint)
    await expect(adapter.record(entry)).rejects.toThrow("Violação de unicidade");
  });
});