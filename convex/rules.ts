import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("billing_rules")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const logExecutionWithDeduplication = mutation({
  args: {
    event_id: v.string(),
    invoice_id: v.string(),
    trigger_day: v.string(),
    rule_id: v.string(),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verifica no DeduplicationJournal se este evento ja foi processado
    const existing = await ctx.db
      .query("deduplication_journal")
      .withIndex("by_event", (q) => q.eq("event_id", args.event_id))
      .first();

    if (existing) {
      return {
        already_processed: true,
        journal_id: existing._id,
        processed_at: existing.processed_at,
      };
    }

    const now = new Date().toISOString();
    const executionId = `exec_${Date.now()}`;

    // 2. Registra no journal com garantia de idempotencia
    await ctx.db.insert("deduplication_journal", {
      event_id: args.event_id,
      invoice_id: args.invoice_id,
      trigger_day: args.trigger_day,
      rule_id: args.rule_id,
      execution_id: executionId,
      processed_at: now,
    });

    // 3. Registra execucao
    await ctx.db.insert("billing_executions", {
      invoice_id: args.invoice_id,
      rule_id: args.rule_id,
      channel: args.channel,
      status: "SUCCESS",
      executed_at: now,
    });

    return {
      already_processed: false,
      execution_id: executionId,
      processed_at: now,
    };
  },
});
