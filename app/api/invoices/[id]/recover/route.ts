import { NextResponse } from "next/server";
import { Database } from "@/lib/db";
import { recoverInvoiceSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { logger } from "@/lib/logger";

export const POST = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const invoiceId = segments[segments.indexOf("invoices") + 1];
    const body = await req.json();
    const parsed = recoverInvoiceSchema.safeParse({ ...body, invoice_id: invoiceId });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }
    const result = Database.markInvoiceRecovered(invoiceId, parsed.data.take_rate_percent);

    logger.info("INVOICE_RECOVERED", {
      invoice_id: invoiceId,
      take_rate_percent: parsed.data.take_rate_percent,
      commission: result.takeRate.commission_amount,
      recovered_amount: result.takeRate.recovered_amount,
    });

    return NextResponse.json({
      success: true,
      invoice: result.invoice,
      take_rate: result.takeRate,
      breakdown: {
        roi_message:
          "Fatura recuperada com sucesso pelo Motor de Cobrança. Take Rate de " +
          parsed.data.take_rate_percent +
          "% retido pela plataforma.",
      },
      message:
        "Fatura recuperada com sucesso pelo Motor de Cobrança. Take Rate de " +
        parsed.data.take_rate_percent +
        "% retido pela plataforma.",
    });
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});