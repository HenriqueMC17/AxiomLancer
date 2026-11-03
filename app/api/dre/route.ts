import { NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { DREService } from "@/core/services/dre.service";
import { withAuth } from "@/app/api/_lib/withAuth";

export const GET = withAuth(async () => {
  try {
    const state = Database.getState();
    const dre = DREService.generateDRE(state.invoices, state.expenses);
    return NextResponse.json({ ok: true, dre });
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});