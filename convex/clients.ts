import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    user_id: v.string(),
    legal_name: v.string(),
    email: v.string(),
    tone_of_voice: v.union(
      v.literal("AMIGAVEL"),
      v.literal("FIRME"),
      v.literal("EXECUTIVO")
    ),
    payment_reliability_score: v.optional(v.float64()),
    avg_payment_delay_days: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("clients", {
      user_id: args.user_id,
      legal_name: args.legal_name,
      email: args.email,
      tone_of_voice: args.tone_of_voice,
      billing_paused: false,
      payment_reliability_score: args.payment_reliability_score ?? 85.0,
      avg_payment_delay_days: args.avg_payment_delay_days ?? 2.0,
      created_at: now,
      updated_at: now,
    });
  },
});

export const toggleBilling = mutation({
  args: {
    id: v.id("clients"),
    paused: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      billing_paused: args.paused,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  },
});
