import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Consulta faturas por usuário
export const listByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoice")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

// Criação de fatura
export const create = mutation({
  args: {
    userId: v.string(),
    clientId: v.string(),
    invoiceNumber: v.string(),
    grossValue: v.number(),
    taxRate: v.number(),
    netValue: v.number(),
    dueDate: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("invoice", {
      user_id: args.userId,
      client_id: args.clientId,
      invoice_number: args.invoiceNumber,
      status: "DRAFT",
      gross_value: args.grossValue,
      tax_rate: args.taxRate,
      net_value: args.netValue,
      due_date: args.dueDate,
      billing_paused: false,
      created_at: now,
      updated_at: now,
    });
  },
});
