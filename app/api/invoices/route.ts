import { createInvoiceSchema } from "@/core/domain/schemas";
import { CreateInvoiceUseCase } from "@/core/use-cases/create-invoice.use-case";
import { InMemoryInvoiceRepository } from "@/infrastructure/repositories/in-memory/in-memory-invoice.repository";
import { InMemoryClientRepository } from "@/infrastructure/repositories/in-memory/in-memory-client.repository";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";

const invoiceRepo = new InMemoryInvoiceRepository();
const clientRepo = new InMemoryClientRepository();
const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepo, clientRepo);

export const GET = withAuth(async (_req, { session }) => {
  try {
    const invoices = await invoiceRepo.listByUser(session.userId);
    const clients = await clientRepo.listByUser(session.userId);
    return ApiResponse.ok({ invoices, clients });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const validated = createInvoiceSchema.parse(body);

    const result = await createInvoiceUseCase.execute({
      userId: session.userId,
      clientId: validated.client_id,
      invoiceNumber: validated.invoice_number,
      dueDate: validated.due_date,
      grossValue: validated.gross_value,
      annualRevenueRbt12: validated.annual_revenue_rbt12,
      simplesNacionalType: validated.simples_nacional_type,
      pixKey: validated.pix_key,
      merchantName: validated.merchant_name,
      merchantCity: validated.merchant_city,
    });

    return ApiResponse.ok(result, 201);
  } catch (err) {
    return ApiResponse.error(err);
  }
});
