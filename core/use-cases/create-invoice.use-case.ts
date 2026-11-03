import { IInvoiceRepository } from "../domain/ports/repositories/invoice.repository.port";
import { IClientRepository } from "../domain/ports/repositories/client.repository.port";
import { TaxEngineService } from "../services/tax-engine.service";
import { PixPayload } from "../domain/value-objects/pix-payload.vo";
import { Invoice } from "../domain/types";
import { NotFoundError, ValidationError } from "../errors/app-error";

export interface CreateInvoiceInput {
  userId: string;
  clientId: string;
  invoiceNumber: string;
  dueDate: string;
  grossValue: number;
  annualRevenueRbt12: number;
  simplesNacionalType: "ANEXO_III" | "ANEXO_V";
  pixKey?: string;
  merchantName?: string;
  merchantCity?: string;
}

export class CreateInvoiceUseCase {
  constructor(
    private readonly invoiceRepo: IInvoiceRepository,
    private readonly clientRepo: IClientRepository
  ) {}

  public async execute(input: CreateInvoiceInput): Promise<{
    invoice: Invoice;
    taxProvision: {
      effectiveTaxRate: number;
      taxAmount: number;
      netOperationalAmount: number;
    };
  }> {
    if (input.grossValue <= 0) {
      throw new ValidationError("O valor bruto da fatura deve ser estritamente positivo.", {
        input_received: input.grossValue,
        expected: "Um valor numerico maior que zero.",
        suggestion: "Informe um montante valido para a prestacao do servico.",
      });
    }

    const client = await this.clientRepo.findById(input.clientId);
    if (!client) {
      throw new NotFoundError("Cliente", input.clientId);
    }

    // Calcula provisao tributaria exata baseada em Fator R
    const taxProvision = TaxEngineService.provisionInvoiceTax(
      input.grossValue,
      input.annualRevenueRbt12,
      input.simplesNacionalType
    );

    const invoiceId = "inv_" + Date.now();
    const pixKey = input.pixKey ?? "pix@7keys.dev";
    const merchantName = (input.merchantName ?? "Henrique Monteiro").substring(0, 25).trim();
    const merchantCity = input.merchantCity ?? "Sao Paulo";

    const pixQrCode = PixPayload.generate({
      pixKey,
      merchantName,
      merchantCity,
      amount: taxProvision.netOperationalAmount.toNumber(),
      txId: invoiceId.replace(/[^A-Za-z0-9]/g, "").substring(0, 25),
      description: ("Fatura " + input.invoiceNumber).substring(0, 72),
    });

    const newInvoice: Invoice = {
      id: invoiceId,
      user_id: input.userId,
      client_id: client.id,
      invoice_number: input.invoiceNumber,
      status: "PENDING",
      due_date: new Date(input.dueDate).toISOString(),
      gross_value: input.grossValue,
      tax_rate: taxProvision.effectiveRatePercent.toNumber(),
      net_value: taxProvision.netOperationalAmount.toNumber(),
      tax_provisioned: taxProvision.virtualSafeDeposit.toNumber(),
      billing_paused: false,
      pix_key: pixKey,
      pix_qr_code: pixQrCode,
      recovered_by_engine: false,
      created_at: new Date().toISOString(),
    };

    const saved = await this.invoiceRepo.create(newInvoice);

    return {
      invoice: saved,
      taxProvision: {
        effectiveTaxRate: taxProvision.effectiveRatePercent.toNumber(),
        taxAmount: taxProvision.virtualSafeDeposit.toNumber(),
        netOperationalAmount: taxProvision.netOperationalAmount.toNumber(),
      },
    };
  }
}
