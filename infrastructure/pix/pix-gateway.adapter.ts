import {
  IPaymentGateway,
  PixChargeRequest,
  PixChargeResponse,
} from "@/core/domain/ports/payment-gateway.port";
import { PixPayload } from "@/core/domain/value-objects/pix-payload.vo";

/**
 * Adaptador de Infraestrutura para o Gateway PIX Dinamico BACEN.
 * Implementa IPaymentGateway utilizando geracao deterministica EMV QR Code (BCB n. 1/2020)
 * e calculo CRC16-CCITT.
 */
export class PixGatewayAdapter implements IPaymentGateway {
  private readonly defaultExpirySeconds = 86400 * 3; // 3 dias

  public async generatePixCharge(request: PixChargeRequest): Promise<PixChargeResponse> {
    const copyAndPasteCode = PixPayload.generate({
      pixKey: request.pixKey,
      merchantName: request.merchantName,
      merchantCity: request.merchantCity,
      amount: request.amount,
      txId: request.txId,
      description: request.description,
    });

    const now = new Date();
    const expirySeconds = request.expiresInSeconds ?? this.defaultExpirySeconds;
    const expiresAt = new Date(now.getTime() + expirySeconds * 1000).toISOString();

    return {
      txId: request.txId,
      copyAndPasteCode,
      amount: request.amount,
      pixKey: request.pixKey,
      merchantName: request.merchantName,
      merchantCity: request.merchantCity,
      createdAt: now.toISOString(),
      expiresAt,
    };
  }

  public async checkPaymentStatus(txId: string): Promise<"PENDING" | "PAID" | "EXPIRED"> {
    // Em producao integra via mTLS com PSP / BACEN (ex: Efi/Gerencianet, Stark Bank, Asaas)
    // No mock de infraestrutura valida existencia do txId
    if (!txId) return "EXPIRED";
    return "PENDING";
  }

  public async refundCharge(
    txId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId: string }> {
    return {
      success: true,
      refundId: `ref_${txId}_${Date.now()}`,
    };
  }
}