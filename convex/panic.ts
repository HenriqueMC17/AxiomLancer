import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStatus = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return {
      billing_paused: user?.billing_paused ?? false,
    };
  },
});

export const toggleSafeMode = mutation({
  args: {
    email: v.string(),
    paused: v.boolean(),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        billing_paused: args.paused,
        updated_at: new Date().toISOString(),
      });
    }

    const latencyMs = Date.now() - startTime;
    return {
      success: true,
      billing_paused: args.paused,
      latency_ms: latencyMs,
    };
  },
});
