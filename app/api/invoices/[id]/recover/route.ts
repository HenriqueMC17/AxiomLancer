import { Database } from "@/lib/db";
import { recoverInvoiceSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/lib/api-response";
import { NotFoundError } from "@/core/errors/app-error";

/**
 * POST /api/invoices/[id]/recover
 * Executa a recuperacao de fatura em atraso pelo Motor de Cobranca com retencao de Take Rate.
 * Zero Trust: Verificacao estrita de posse (BOLA protection) via session.userId.
 */
export const POST = withAuth(async (req, { session, params }) => {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const invoiceId = params?.id || segments[segments.indexOf("invoices") + 1];

    const body = await req.json().catch(() => ({}));
    const parsed = recoverInvoiceSchema.safeParse({ ...body, invoice_id: invoiceId });
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const state = Database.getState();
    const inv = state.invoices.find((i) => i.id === invoiceId);
    if (!inv || inv.user_id !== session.userId) {
      throw new NotFoundError("Fatura", invoiceId);
    }

    const result = Database.markInvoiceRecovered(invoiceId, parsed.data.take_rate_percent);

    logger.info("INVOICE_RECOVERED", {
      invoice_id: invoiceId,
      userId: session.userId,
      take_rate_percent: parsed.data.take_rate_percent,
      commission: result.takeRate.commission_amount,
      recovered_amount: result.takeRate.recovered_amount,
    });

    return ApiResponse.ok({
      success: true,
      invoice: result.invoice,
      take_rate: result.takeRate,
      breakdown: {
        roi_message: `Fatura recuperada com sucesso pelo Motor de Cobranca. Take Rate de ${parsed.data.take_rate_percent}% retido pela plataforma.`,
      },
      message: `Fatura recuperada com sucesso pelo Motor de Cobranca. Take Rate de ${parsed.data.take_rate_percent}% retido pela plataforma.`,
    });
  } catch (err) {
    return ApiResponse.error(err);
  }
});