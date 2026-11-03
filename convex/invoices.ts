import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    user_id: v.string(),
    client_id: v.string(),
    invoice_number: v.string(),
    due_date: v.string(),
    gross_value: v.float64(),
    tax_rate: v.float64(),
    net_value: v.float64(),
    tax_provisioned: v.float64(),
    pix_key: v.optional(v.string()),
    pix_qr_code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("invoices", {
      ...args,
      status: "PENDING",
      billing_paused: false,
      recovered_by_engine: false,
      created_at: now,
      updated_at: now,
    });
  },
});

export const markAsPaid = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.id);
    if (!invoice) throw new Error("Fatura nao encontrada");

    await ctx.db.patch(args.id, {
      status: "PAID",
      updated_at: new Date().toISOString(),
    });

    // Registra transacao no livro-razao
    await ctx.db.insert("ledger_transactions", {
      user_id: invoice.user_id,
      type: "INCOME",
      amount: invoice.net_value,
      description: `Liquidacao PIX Fatura #${invoice.invoice_number}`,
      created_at: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const recover = mutation({
  args: {
    id: v.id("invoices"),
    take_rate_percent: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.id);
    if (!invoice) throw new Error("Fatura nao encontrada");

    const rate = args.take_rate_percent ?? 5.0;
    const fee = (invoice.gross_value * rate) / 100;
    const netRecovered = invoice.gross_value - fee;

    await ctx.db.patch(args.id, {
      status: "PAID",
      recovered_by_engine: true,
      updated_at: new Date().toISOString(),
    });

    // Registra a taxa retida de 5% no recovery_take_rates
    await ctx.db.insert("recovery_take_rates", {
      invoice_id: invoice._id,
      gross_amount: invoice.gross_value,
      recovered_amount: netRecovered,
      take_rate_percent: rate,
      retained_fee: fee,
      processed_at: new Date().toISOString(),
    });

    return {
      success: true,
      retained_fee: fee,
      net_recovered: netRecovered,
    };
  },
});
