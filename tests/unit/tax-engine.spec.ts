import { describe, it, expect } from "vitest";
import { TaxEngineService } from "@/core/services/tax-engine.service";

describe("TaxEngineService - Simples Nacional & Fator R (AAA Pattern)", () => {
  it("deve enquadrar em Anexo III quando Fator R for maior ou igual a 28%", () => {
    // Arrange: Folha de 28k para faturamento de 100k (28%)
    const payrollAnnual = 28000;
    const revenueRbt12 = 100000;

    // Act
    const evaluation = TaxEngineService.calculateFatorR(payrollAnnual, revenueRbt12);

    // Assert
    expect(evaluation.ratioPercent.toNumber()).toBe(28.0);
    expect(evaluation.qualifiesForAnexoIII).toBe(true);
    expect(evaluation.recommendedAnexo).toBe("ANEXO_III");
    expect(evaluation.taxSavingsPercent.toNumber()).toBe(9.5);
  });

  it("deve reclassificar para Anexo V quando Fator R for inferior a 28%", () => {
    // Arrange: Folha de 20k para faturamento de 100k (20%)
    const payrollAnnual = 20000;
    const revenueRbt12 = 100000;

    // Act
    const evaluation = TaxEngineService.calculateFatorR(payrollAnnual, revenueRbt12);

    // Assert
    expect(evaluation.ratioPercent.toNumber()).toBe(20.0);
    expect(evaluation.qualifiesForAnexoIII).toBe(false);
    expect(evaluation.recommendedAnexo).toBe("ANEXO_V");
    expect(evaluation.taxSavingsPercent.toNumber()).toBe(0.0);
  });

  it("deve calcular a provisão exata do cofre virtual para uma fatura no Anexo III", () => {
    // Arrange: Fatura de R$ 10.000 com RBT12 de R$ 180.000 (Faixa 1: 6%)
    const invoiceGross = 10000.0;
    const rbt12 = 180000.0;
    const anexo = "ANEXO_III";

    // Act
    const provision = TaxEngineService.provisionInvoiceTax(invoiceGross, rbt12, anexo);

    // Assert
    expect(provision.effectiveRatePercent.toNumber()).toBe(6.0);
    expect(provision.virtualSafeDeposit.toNumber()).toBe(600.0);
    expect(provision.netOperationalAmount.toNumber()).toBe(9400.0);
  });
});
