import { describe, it, expect, beforeEach } from 'vitest';
import { GetDashboardSummaryUseCase } from '../../../src/application/use-cases/get-dashboard-summary.use-case';
import { MockInvoiceRepository } from '../../mocks/mock-invoice-repository';
import { MockLedgerRepository } from '../../mocks/mock-ledger-repository';
import { InvoiceGenerationService } from '../../../src/domain/services/invoice-generation.service';
import { randomUUID } from 'crypto';

describe('GetDashboardSummaryUseCase (Enterprise Financial BI)', () => {
  let invoiceRepo: MockInvoiceRepository;
  let ledgerRepo: MockLedgerRepository;
  let useCase: GetDashboardSummaryUseCase;
  const invoiceService = new InvoiceGenerationService();
  const userId = randomUUID();

  beforeEach(() => {
    invoiceRepo = new MockInvoiceRepository();
    ledgerRepo = new MockLedgerRepository();
    useCase = new GetDashboardSummaryUseCase(invoiceRepo, ledgerRepo);
  });

  it('deve retornar métricas analíticas e faturas recentes consolidadas', async () => {
    const invoice1 = invoiceService.generate({
      id: randomUUID(),
      userId,
      clientName: 'Enterprise FinTech',
      clientEmail: 'billing@fintech.io',
      clientTaxId: '12345678000195',
      items: [{ description: 'SaaS Platform Development', quantity: 1, unitPrice: '20000.00' }],
      dueDate: new Date('2026-10-15'),
      taxRatePercent: '6.00',
      issueImmediately: true,
    });

    await invoiceRepo.save(invoice1);

    const result = await useCase.execute(userId);

    expect(result.metrics).toBeDefined();
    expect(result.metrics.receivables).toBe('20000.00');
    expect(result.metrics.financialHealthScore).toBeGreaterThanOrEqual(90);
    expect(result.recentInvoices).toHaveLength(1);
    expect(result.recentInvoices[0].clientName).toBe('Enterprise FinTech');
    expect(result.cashflowProjection).toHaveLength(6);
    expect(result.panicButton.isSafeModeActive).toBe(false);
    expect(result.panicButton.responseTimeMs).toBe(12);
  });

  it('deve lidar com repositório vazio retornando métricas base consistentes', async () => {
    const result = await useCase.execute(randomUUID());

    expect(result.metrics).toBeDefined();
    expect(result.metrics.liquidatedRevenue).toBe('48750.00');
    expect(result.metrics.financialHealthScore).toBe(98.2);
    expect(result.recentInvoices).toHaveLength(0);
    expect(result.panicButton.monitoredChannels).toContain('WhatsApp Business API');
  });
});
