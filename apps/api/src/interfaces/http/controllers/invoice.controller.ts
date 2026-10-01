import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createInvoiceSchema, settleInvoiceSchema, CreateInvoiceInput, SettleInvoiceInput } from '../schemas/invoice.schema';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case';
import { SettleInvoiceUseCase } from '../../../application/use-cases/settle-invoice.use-case';
import { GetInvoiceByIdUseCase } from '../../../application/use-cases/get-invoice-by-id.use-case';

export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly settleInvoiceUseCase: SettleInvoiceUseCase,
    private readonly getInvoiceByIdUseCase: GetInvoiceByIdUseCase,
  ) {}

  public registerRoutes(app: FastifyInstance): void {
    // 1. Criar e Emitir Fatura (Transacional ACID)
    app.post(
      '/api/v1/invoices',
      async (request: FastifyRequest<{ Body: CreateInvoiceInput }>, reply: FastifyReply) => {
        const validated = createInvoiceSchema.parse(request.body);
        const result = await this.createInvoiceUseCase.execute(validated);

        return reply.status(201).send({
          success: true,
          data: result,
        });
      },
    );

    // 2. Buscar Fatura por ID (Desacoplado via Use Case)
    app.get(
      '/api/v1/invoices/:id',
      async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = request.params;
        const result = await this.getInvoiceByIdUseCase.execute(id);

        return reply.status(200).send({
          success: true,
          data: result,
        });
      },
    );

    // 3. Liquidar Fatura (Split Tributário Automático no Recebimento)
    app.post(
      '/api/v1/invoices/:id/settle',
      async (
        request: FastifyRequest<{ Params: { id: string }; Body: SettleInvoiceInput }>,
        reply: FastifyReply,
      ) => {
        const { id } = request.params;
        const validated = settleInvoiceSchema.parse(request.body || {});

        // Busca a fatura para extrair o proprietário através do use case desacoplado
        const invoice = await this.getInvoiceByIdUseCase.execute(id);

        const result = await this.settleInvoiceUseCase.execute({
          invoiceId: id,
          userId: invoice.userId,
          paidAt: validated.paidAt,
        });

        return reply.status(200).send({
          success: true,
          message: 'Fatura liquidada e split tributário em cofre virtual registrado no Ledger com sucesso.',
          data: result,
        });
      },
    );
  }
}
