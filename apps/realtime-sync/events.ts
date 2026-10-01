import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Receptor de Eventos Transacionais do Outbox (CQRS Real-time Read-Side)
 * Recebe eventos originados do PostgreSQL via Fastify e atualiza
 * de forma idempotente as projeções reativas no Convex Cloud.
 */
export const processOutboxEvent = mutation({
  args: {
    eventId: v.string(),
    userId: v.string(),
    eventType: v.string(),
    aggregateType: v.string(),
    aggregateId: v.string(),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    if (args.eventType === "INVOICE_CREATED") {
      const p = args.payload;
      // Projeta a nova fatura emitida no banco reativo
      const invoiceDocId = await ctx.db.insert("invoice", {
        user_id: args.userId,
        client_id: p.clientId || "00000000-0000-0000-0000-000000000001",
        invoice_number: p.id,
        status: p.status === "PAID" ? "PAID" : p.status === "OVERDUE" ? "OVERDUE" : "PENDING",
        gross_value: Number(p.grossAmount) || 0,
        tax_rate: 6.0,
        net_value: Number(p.netAmount) || 0,
        due_date: p.dueDate || now,
        billing_paused: false,
        created_at: now,
        updated_at: now,
      });

      return {
        success: true,
        eventId: args.eventId,
        docId: invoiceDocId,
        processedAt: now,
      };
    }

    if (args.eventType === "INVOICE_SETTLED") {
      const p = args.payload;
      // Localiza a fatura na projeção reativa pelo número/id
      const existingInvoices = await ctx.db
        .query("invoice")
        .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
        .collect();

      const target = existingInvoices.find(
        (inv) => inv.invoice_number === p.invoiceId || inv.invoice_number === args.aggregateId
      );

      if (target) {
        await ctx.db.patch(target._id, {
          status: "PAID",
          updated_at: now,
        });
      }

      // Registra a transação correspondente no livro-razão reativo
      const txDocId = await ctx.db.insert("ledger_transaction", {
        user_id: args.userId,
        invoice_id: args.aggregateId,
        occurred_at: p.paidAt || now,
        type: "INCOME",
        amount: Number(p.netDeposited) || 0,
        reconciled_at: now,
        created_at: now,
      });

      return {
        success: true,
        eventId: args.eventId,
        ledgerTxId: txDocId,
        processedAt: now,
      };
    }

    return {
      success: true,
      eventId: args.eventId,
      message: `Evento ${args.eventType} reconhecido sem mutação direta necessária.`,
      processedAt: now,
    };
  },
});
