import fastify, { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { bffAuthPlugin } from './plugins/bff-auth.plugin';
import { registerErrorHandler } from './plugins/error-handler.plugin';
import { outboxWorkerPlugin } from '../../infrastructure/outbox/outbox-worker.plugin';
import { TaxController } from './controllers/tax.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { BillingTriggerController } from './controllers/billing-trigger.controller';
import { AuthBffController } from './controllers/auth-bff.controller';
import { DashboardController } from './controllers/dashboard.controller';

// Imports de Composição de Infraestrutura (Composition Root)
import { prisma } from '../../infrastructure/database/prisma.client';
import { PrismaUnitOfWork } from '../../infrastructure/database/prisma-unit-of-work';
import { PrismaInvoiceRepository } from '../../infrastructure/database/repositories/prisma-invoice.repository';
import { PrismaLedgerRepository } from '../../infrastructure/database/repositories/prisma-ledger.repository';
import { PrismaDeduplicationRepository } from '../../infrastructure/database/repositories/prisma-deduplication.repository';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { SettleInvoiceUseCase } from '../../application/use-cases/settle-invoice.use-case';
import { GetInvoiceByIdUseCase } from '../../application/use-cases/get-invoice-by-id.use-case';
import { ProcessBillingTriggerUseCase } from '../../application/use-cases/process-billing-trigger.use-case';
import { CalculateTaxesUseCase } from '../../application/use-cases/calculate-taxes.use-case';
import { GetDashboardSummaryUseCase } from '../../application/use-cases/get-dashboard-summary.use-case';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
  });

  // 1. CORS configurado com credentials: true para suporte ao BFF e Angular
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // 2. Cookie parser com chave secreta de assinatura
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'axiomlancer_default_development_secret_cookie_sign_32chars!',
    hook: 'onRequest',
  });

  // 3. JWT para geração e decodificação segura
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'axiomlancer_default_jwt_secret_dev_32chars_minimum!',
  });

  // 4. Plugin BFF de Sessão com Cookies HttpOnly / SameSite=Strict
  await app.register(bffAuthPlugin);

  // 5. Worker em Background do Transactional Outbox (CQRS / Convex sync)
  await app.register(outboxWorkerPlugin);

  // 6. Handler global de erros (Zod Fail Fast e Domain Errors)
  registerErrorHandler(app);

  // 6. Rotas de Apresentação e Health Check
  app.get('/', async () => ({
    service: 'AxiomLancer Financial Core',
    version: '1.0.0',
    status: 'ONLINE',
    healthCheck: '/health',
  }));

  app.get('/health', async () => ({
    status: 'HEALTHY',
    service: 'AxiomLancer Financial Core',
    timestamp: new Date().toISOString(),
  }));

  // ========================================================
  // COMPOSITION ROOT (Injeção de Dependências Explicita - IoC)
  // ========================================================
  const unitOfWork = new PrismaUnitOfWork(prisma);
  const invoiceRepository = new PrismaInvoiceRepository(prisma);
  const deduplicationRepository = new PrismaDeduplicationRepository(prisma);

  const calculateTaxesUseCase = new CalculateTaxesUseCase();
  const createInvoiceUseCase = new CreateInvoiceUseCase(unitOfWork);
  const settleInvoiceUseCase = new SettleInvoiceUseCase(unitOfWork);
  const getInvoiceByIdUseCase = new GetInvoiceByIdUseCase(invoiceRepository);
  const processBillingTriggerUseCase = new ProcessBillingTriggerUseCase(
    deduplicationRepository,
    invoiceRepository,
  );

  // 7. Registro dos Controllers desacoplados
  const taxController = new TaxController(calculateTaxesUseCase);
  taxController.registerRoutes(app);

  const invoiceController = new InvoiceController(
    createInvoiceUseCase,
    settleInvoiceUseCase,
    getInvoiceByIdUseCase,
  );
  invoiceController.registerRoutes(app);

  const billingController = new BillingTriggerController(processBillingTriggerUseCase);
  billingController.registerRoutes(app);

  const authController = new AuthBffController();
  authController.registerRoutes(app);

  const ledgerRepository = new PrismaLedgerRepository(prisma);
  const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(
    invoiceRepository,
    ledgerRepository,
  );
  const dashboardController = new DashboardController(getDashboardSummaryUseCase);
  dashboardController.registerRoutes(app);

  return app;
}
