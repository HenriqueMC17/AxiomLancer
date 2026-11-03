import { describe, it, expect } from "vitest";
import { MonetaryService } from "@/core/services/monetary.service";

describe("MonetaryService - Padrão Bancário Determinístico (AAA Pattern)", () => {
  it("deve arredondar com precisão monetária de 2 casas decimais (ROUND_HALF_UP)", () => {
    // Arrange: 100.005 arredonda para cima (100.01)
    const val = 100.005;

    // Act
    const result = MonetaryService.toMoney(val);

    // Assert
    expect(result.toNumber()).toBe(100.01);
  });

  it("deve calcular o Split Tributário com exatidão sem erros de ponto flutuante", () => {
    // Arrange
    const gross = 10000.0;
    const taxRatePercent = 6.0;

    // Act
    const split = MonetaryService.calculateTaxSplit(gross, taxRatePercent);

    // Assert
    expect(split.gross.toNumber()).toBe(10000.0);
    expect(split.taxProvisioned.toNumber()).toBe(600.0);
    expect(split.netValue.toNumber()).toBe(9400.0);
  });

  it("deve calcular o Take Rate transacional de 5.00% sobre faturas recuperadas", () => {
    // Arrange
    const recoveredGross = 12000.0;
    const takeRatePercent = 5.0;

    // Act
    const result = MonetaryService.calculateTakeRate(recoveredGross, takeRatePercent);

    // Assert
    expect(result.recoveredGross.toNumber()).toBe(12000.0);
    expect(result.commissionAmount.toNumber()).toBe(600.0); // 5% de 12k
    expect(result.freelancerNetRecovered.toNumber()).toBe(11400.0);
  });

  it("deve calcular taxa de gateway PIX dinâmico (0.99%)", () => {
    // Arrange
    const gross = 5000.0;

    // Act
    const fee = MonetaryService.calculateGatewayFee(gross, "PIX");

    // Assert
    expect(fee.feePercent.toNumber()).toBe(0.99);
    expect(fee.totalFee.toNumber()).toBe(49.5);
    expect(fee.netReceived.toNumber()).toBe(4950.5);
  });

  it("deve formatar adequadamente valores para o padrão monetário BRL", () => {
    // Arrange
    const amount = 12500.5;

    // Act
    const formatted = MonetaryService.formatBRL(amount);

    // Assert
    expect(formatted).toContain("12.500,50");
  });
});
