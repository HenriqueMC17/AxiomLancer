import { describe, it, expect } from "vitest";
import { DashboardSummaryService } from "@/core/services/dashboard-summary.service";
import { Invoice, Expense } from "@/core/domain/types";

describe("DashboardSummaryService - Sumarizacao de Caixa e OPEX com decimal.js", () => {
  const refDate = new Date("2026-10-15T12:00:00Z"); // Mes 9 (Outubro/2026)

  it("deve calcular entradas, saidas e margem de lucro com precisao absoluta", () => {
    // Arrange: Faturas
    const invoices: Invoice[] = [
      {
        id: "inv_1",
        user_id: "usr_1",
        client_id: "cli_1",
        invoice_number: "FAT-001",
        status: "PAID",
        due_date: "2026-10-10T10:00:00Z", // Este mes e este ano
        gross_value: 10000.0,
        tax_rate: 6.0,
        net_value: 9400.0,
        tax_provisioned: 600.0,
        billing_paused: false,
        created_at: "2026-10-01",
      },
      {
        id: "inv_2",
        user_id: "usr_1",
        client_id: "cli_1",
        invoice_number: "FAT-002",
        status: "PAID",
        due_date: "2026-05-15T10:00:00Z", // Outro mes, mas este ano (2026)
        gross_value: 5000.0,
        tax_rate: 6.0,
        net_value: 4700.0,
        tax_provisioned: 300.0,
        billing_paused: false,
        created_at: "2026-05-01",
      },
      {
        id: "inv_3",
        user_id: "usr_1",
        client_id: "cli_1",
        invoice_number: "FAT-003",
        status: "PENDING",
        due_date: "2026-10-25T10:00:00Z", // Pendente a receber
        gross_value: 4500.0,
        tax_rate: 6.0,
        net_value: 4230.0,
        tax_provisioned: 270.0,
        billing_paused: false,
        created_at: "2026-10-05",
      },
      {
        id: "inv_4",
        user_id: "usr_1",
        client_id: "cli_1",
        invoice_number: "FAT-004",
        status: "DRAFT",
        due_date: "2026-11-01T10:00:00Z",
        gross_value: 2000.0,
        tax_rate: 6.0,
        net_value: 1880.0,
        tax_provisioned: 120.0,
        billing_paused: false,
        created_at: "2026-10-12",
      },
    ];

    // Arrange: Despesas operacionais
    const expenses: Expense[] = [
      {
        id: "exp_1",
        user_id: "usr_1",
        description: "Cloud Server AWS",
        category: "INFRA",
        amount: 1200.0,
        due_date: "2026-10-05",
        status: "PAID",
        is_fixed: true,
        created_at: "2026-10-01",
      },
      {
        id: "exp_2",
        user_id: "usr_1",
        description: "Assinaturas IA & GitHub Copilot",
        category: "SAAS",
        amount: 800.0,
        due_date: "2026-10-12",
        status: "PENDING",
        is_fixed: false,
        created_at: "2026-10-01",
      },
      {
        id: "exp_3",
        user_id: "usr_1",
        description: "Contabilidade Simples Nacional",
        category: "CONTABILIDADE",
        amount: 500.0,
        due_date: "2026-06-10", // Mes anterior (ano atual)
        status: "PAID",
        is_fixed: true,
        created_at: "2026-06-01",
      },
      {
        id: "exp_canceled",
        user_id: "usr_1",
        description: "Servico cancelado",
        category: "OUTROS",
        amount: 999.0,
        due_date: "2026-10-10",
        status: "CANCELED", // Nao deve entrar no calculo
        is_fixed: false,
        created_at: "2026-10-01",
      },
    ];

    // Act
    const report = DashboardSummaryService.calculateSummary(invoices, expenses, refDate);

    // Assert: Entradas
    expect(report.totalReceivedMonth).toBe(10000.0);
    expect(report.totalReceivedYear).toBe(15000.0); // 10000 + 5000
    expect(report.totalReceivable).toBe(4500.0);
    expect(report.totalDraft).toBe(2000.0);
    expect(report.paidInvoicesCount).toBe(2);
    expect(report.pendingInvoicesCount).toBe(1);

    // Assert: OPEX
    expect(report.opexMonth).toBe(2000.0); // 1200 (INFRA) + 800 (SAAS)
    expect(report.opexYear).toBe(2500.0);  // 2000 + 500 (CONTABILIDADE)
    expect(report.fixedOpexMonth).toBe(1200.0);
    expect(report.variableOpexMonth).toBe(800.0);

    // Assert: Margem de Lucro Real
    // Lucro no mes: 10000 - 2000 = 8000
    // Margem no mes: (8000 / 10000) * 100 = 80.0%
    expect(report.netProfitMonth).toBe(8000.0);
    expect(report.netMarginPercentMonth).toBe(80.0);

    // Lucro no ano: 15000 - 2500 = 12500
    // Margem no ano: (12500 / 15000) * 100 = 83.33%
    expect(report.netProfitYear).toBe(12500.0);
    expect(report.netMarginPercentYear).toBe(83.33);

    // Assert: Categorias no mes (ordenadas da maior para a menor)
    expect(report.opexByCategory.length).toBe(2);
    expect(report.opexByCategory[0].category).toBe("INFRA");
    expect(report.opexByCategory[0].amount).toBe(1200.0);
    expect(report.opexByCategory[0].percentage).toBe(60.0); // (1200 / 2000) * 100

    expect(report.opexByCategory[1].category).toBe("SAAS");
    expect(report.opexByCategory[1].amount).toBe(800.0);
    expect(report.opexByCategory[1].percentage).toBe(40.0); // (800 / 2000) * 100
  });

  it("deve lidar com seguranca quando o usuario nao tiver faturas nem despesas (Zero Divisao por Zero)", () => {
    const report = DashboardSummaryService.calculateSummary([], [], refDate);

    expect(report.totalReceivedMonth).toBe(0.0);
    expect(report.totalReceivedYear).toBe(0.0);
    expect(report.totalReceivable).toBe(0.0);
    expect(report.opexMonth).toBe(0.0);
    expect(report.opexYear).toBe(0.0);
    expect(report.netProfitMonth).toBe(0.0);
    expect(report.netMarginPercentMonth).toBe(0.0);
    expect(report.opexByCategory).toEqual([]);
  });

  it("deve calcular corretamente margem negativa quando despesas superarem receitas", () => {
    const invoices: Invoice[] = [
      {
        id: "inv_1",
        user_id: "usr_1",
        client_id: "cli_1",
        invoice_number: "FAT-001",
        status: "PAID",
        due_date: "2026-10-10",
        gross_value: 2000.0,
        tax_rate: 6.0,
        net_value: 1880.0,
        tax_provisioned: 120.0,
        billing_paused: false,
        created_at: "2026-10-01",
      },
    ];

    const expenses: Expense[] = [
      {
        id: "exp_1",
        user_id: "usr_1",
        description: "Investimento em hardware",
        category: "EQUIPAMENTO",
        amount: 3000.0,
        due_date: "2026-10-05",
        status: "PAID",
        is_fixed: false,
        created_at: "2026-10-01",
      },
    ];

    const report = DashboardSummaryService.calculateSummary(invoices, expenses, refDate);

    // 2000 - 3000 = -1000
    // Margem: (-1000 / 2000) * 100 = -50.0%
    expect(report.netProfitMonth).toBe(-1000.0);
    expect(report.netMarginPercentMonth).toBe(-50.0);
  });
});