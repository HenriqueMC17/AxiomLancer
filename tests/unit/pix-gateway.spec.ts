import { describe, it, expect } from "vitest";
import { PixGatewayAdapter } from "@/infrastructure/pix/pix-gateway.adapter";

describe("PixGatewayAdapter - Geracao de Payload BACEN EMV & CRC16", () => {
  const adapter = new PixGatewayAdapter();

  it("deve gerar cobranca PIX dinamica com Copia e Cola e campos BACEN obrigatorios", async () => {
    const response = await adapter.generatePixCharge({
      txId: "tx_teste_999",
      amount: 1500.0,
      pixKey: "pix@7keys.dev",
      merchantName: "Henrique Monteiro",
      merchantCity: "Sao Paulo",
      description: "Fatura de Desenvolvimento",
      expiresInSeconds: 3600,
    });

    expect(response.txId).toBe("tx_teste_999");
    expect(response.amount).toBe(1500.0);
    expect(response.copyAndPasteCode).toContain("000201"); // Cabecalho EMV padrao BACEN
    expect(response.copyAndPasteCode).toContain("br.gov.bcb.pix");
    expect(response.copyAndPasteCode).toContain("6304"); // Tag do CRC16
    expect(response.expiresAt).toBeDefined();
  });

  it("deve checar status de cobranca com fallback de mock", async () => {
    const status = await adapter.checkPaymentStatus("tx_teste_999");
    expect(status).toBe("PENDING");
  });
});