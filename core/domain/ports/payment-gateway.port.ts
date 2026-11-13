/**
 * Port (interface) para o Gateway de Pagamentos e Integracao PIX Dinamico (BACEN).
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 * O dominio de negocio ignora qualquer detalhe de protocolo ou biblioteca HTTP externa.
 */

export interface PixChargeRequest {
  txId: string;
  amount: number;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  description?: string;
  expiresInSeconds?: number;
}

export interface PixChargeResponse {
  txId: string;
  copyAndPasteCode: string;
  qrCodeBase64?: string;
  amount: number;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  createdAt: string;
  expiresAt: string;
}

export interface IPaymentGateway {
  /**
   * Gera uma cobranca PIX dinamica com payload EMV e CRC16-CCITT padrao BACEN
   */
  generatePixCharge(request: PixChargeRequest): Promise<PixChargeResponse>;

  /**
   * Consulta o status de conciliacao da cobranca na autoridade bancaria
   */
  checkPaymentStatus(txId: string): Promise<"PENDING" | "PAID" | "EXPIRED">;

  /**
   * Executa estorno / devolucao controlada da transacao
   */
  refundCharge(txId: string, amount: number, reason: string): Promise<{ success: boolean; refundId: string }>;
}