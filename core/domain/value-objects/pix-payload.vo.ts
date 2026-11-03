/**
 * PIX EMV Payload Value Object -- BCB n. 1/2020 compliant
 * Gera o payload EMV-like do PIX para leitura QR Code.
 * CRC16-CCITT (polynomial 0x1021, init 0xFFFF).
 */

export interface PixPayloadOptions {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txId?: string;
  description?: string;
}

export class PixPayload {
  private static crc16(str: string): string {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  }

  private static emvField(id: string, value: string): string {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
  }

  static generate(opts: PixPayloadOptions): string {
    const name = opts.merchantName.substring(0, 25).trim();
    const city = opts.merchantCity.substring(0, 15).trim();
    const txId = opts.txId
      ? opts.txId.replace(/[^A-Za-z0-9]/g, "").substring(0, 25)
      : "***";

    const gui = this.emvField("00", "br.gov.bcb.pix");
    const key = this.emvField("01", opts.pixKey);
    const desc = opts.description
      ? this.emvField("02", opts.description.substring(0, 72))
      : "";
    const mai = this.emvField("26", gui + key + desc);

    const amountField =
      opts.amount !== undefined
        ? this.emvField("54", opts.amount.toFixed(2))
        : "";

    const txIdField = this.emvField("05", txId);
    const adf = this.emvField("62", txIdField);

    const payload =
      this.emvField("00", "01") +
      this.emvField("01", "12") +
      mai +
      this.emvField("52", "0000") +
      this.emvField("53", "986") +
      amountField +
      this.emvField("58", "BR") +
      this.emvField("59", name) +
      this.emvField("60", city) +
      adf +
      "6304";

    return payload + this.crc16(payload);
  }

  static validate(payload: string): boolean {
    if (payload.length < 4) return false;
    const body = payload.slice(0, -4);
    const crcReceived = payload.slice(-4).toUpperCase();
    const crcComputed = this.crc16(body + "6304");
    return crcReceived === crcComputed;
  }
}