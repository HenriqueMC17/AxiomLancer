import { describe, it, expect } from 'vitest';
import { FinancialAnalyticsService } from '../../../src/modules/treasury/domain/services/financial-analytics.service';
import { Money } from '../../../src/domain/value-objects/money.vo';
import { Invoice } from '../../../src/domain/entities/invoice.entity';
import { InvoiceStatusVO } from '../../../src/domain/value-objects/invoice-status.vo';

describe('FinancialAnalyticsService (Pure Domain BI)', () => {
  const service = new FinancialAnalyticsService();

  it('deve calcular métricas financeiras com faturas pagas e a receber', () => {
    const paidInvoice = new Invoice({
      id: 'inv-1',
      userId: 'user-1',
      clientName: 'Cliente A',
      clientEmail: 'a@client.com',
      clientTaxId: '12345678901',
      items: [{ description: 'Dev', quantity: 1, unitPrice: Money.from('10000.00') }],
      grossAmount: Money.from('10000.00'),
      taxAmount: Money.from('600.00'),
      netAmount: Money.from('9400.00'),
      dueDate: new Date(),
      status: InvoiceStatusVO.paid(),
      taxBreakdown: {
        effectiveRate: '6.00',
        components: [{ name: 'Simples', ratePercent: '6.00', amount: Money.from('600.00') }],
      },
    });

    const issuedInvoice = new Invoice({
      id: 'inv-2',
      userId: 'user-1',
      clientName: 'Cliente B',
      clientEmail: 'b@client.com',
      clientTaxId: '12345678902',
      items: [{ description: 'Design', quantity: 1, unitPrice: Money.from('5000.00') }],
      grossAmount: Money.from('5000.00'),
      taxAmount: Money.from('300.00'),
      netAmount: Money.from('4700.00'),
      dueDate: new Date(),
      status: InvoiceStatusVO.issued(),
      taxBreakdown: {
        effectiveRate: '6.00',
        components: [{ name: 'Simples', ratePercent: '6.00', amount: Money.from('300.00') }],
      },
    });

    const balances = {
      asset: Money.zero(),
      taxReserve: Money.from('600.00'),
      expense: Money.from('1500.00'),
    };

    const result = service.calculate([paidInvoice, issuedInvoice], balances);

    expect(result.liquidatedRevenue.toDatabaseDecimal()).toBe('10000.00');
    expect(result.receivables.toDatabaseDecimal()).toBe('5000.00');
    expect(result.taxReserve.toDatabaseDecimal()).toBe('600.00');
    expect(result.operationalExpenses.toDatabaseDecimal()).toBe('1500.00');
    expect(result.defaultRiskRate).toBe(0);
    expect(result.financialHealthScore).toBe(100);
    expect(result.cashflowProjection).toHaveLength(6);
  });

  it('deve calcular taxa de risco de inadimplência quando houver faturas em atraso', () => {
    const overdueInvoice = new Invoice({
      id: 'inv-3',
      userId: 'user-1',
      clientName: 'Cliente Inadimplente',
      clientEmail: 'c@client.com',
      clientTaxId: '12345678903',
      items: [{ description: 'Consultoria', quantity: 1, unitPrice: Money.from('4000.00') }],
      grossAmount: Money.from('4000.00'),
      taxAmount: Money.from('240.00'),
      netAmount: Money.from('3760.00'),
      dueDate: new Date(),
      status: InvoiceStatusVO.overdue(),
      taxBreakdown: {
        effectiveRate: '6.00',
        components: [{ name: 'Simples', ratePercent: '6.00', amount: Money.from('240.00') }],
      },
    });

    const balances = {
      asset: Money.zero(),
      taxReserve: Money.zero(),
      expense: Money.zero(),
    };

    const result = service.calculate([overdueInvoice], balances);

    expect(result.receivables.toDatabaseDecimal()).toBe('4000.00');
    expect(result.defaultRiskRate).toBe(100);
    expect(result.financialHealthScore).toBeLessThanOrEqual(0);
  });
});
