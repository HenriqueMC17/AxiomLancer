import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    user_id: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("INFRA"),
      v.literal("SAAS"),
      v.literal("CONTABILIDADE"),
      v.literal("EQUIPAMENTO"),
      v.literal("IMPOSTOS"),
      v.literal("OUTROS")
    ),
    amount: v.float64(),
    due_date: v.string(),
    is_fixed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("expenses", {
      ...args,
      status: "PENDING",
      created_at: now,
    });
  },
});
