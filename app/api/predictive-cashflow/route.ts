import { NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { PredictiveCashflowService } from "@/core/services/predictive-cashflow.service";
import { withAuth } from "@/app/api/_lib/withAuth";

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const horizon = parseInt(searchParams.get("horizon") ?? "30");
    const state = Database.getState();
    const result = PredictiveCashflowService.generateProjection(
      state.accountBalance,
      state.invoices,
      state.expenses,
      state.clients,
      horizon
    );
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});