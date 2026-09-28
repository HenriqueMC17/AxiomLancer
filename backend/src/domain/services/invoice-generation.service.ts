import { Decimal } from 'decimal.js';
import { Invoice, InvoiceItem } from '../entities/invoice.entity';
import { Money } from '../value-objects/money.vo';
import { InvoiceStatusVO } from '../value-objects/invoice-status.vo';
import { TaxCalculatorService } from './tax-calculator.service';
import { TaxComponentInput } from '../value-objects/tax-breakdown.vo';
import { DomainError, InvalidMoneyError } from '../errors/domain.error';

export interface CreateInvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: string; // Ex: "150.00"
}

export interface GenerateInvoiceCommand {
  id: string; // UUID v4 gerado ou injetado
  userId: string;
  clientName: string;
  clientEmail: string;
  clientTaxId: string;
  items: CreateInvoiceItemInput[];
  dueDate: Date;
  description?: string;
  taxRatePercent?: string | Decimal; // Alíquota percentual padrão (ex: "6.0" = 6%)
  taxComponents?: TaxComponentInput[]; // Opcional para cálculo analítico
  issueImmediately?: boolean;
}

export class InvoiceGenerationService {
  constructor(private readonly taxCalculator: TaxCalculatorService = new TaxCalculatorService()) {}

  /**
   * Orquestra a geração pura e determinística de uma nova fatura
   */
  public generate(command: GenerateInvoiceCommand): Invoice {
    this.validateCommand(command);

    // Calcula o montante bruto somando os itens com precisão decimal estrita
    let grossAccumulator = Money.zero();
    const validatedItems: InvoiceItem[] = [];

    for (const item of command.items) {
      if (item.quantity <= 0) {
        throw new DomainError(`Quantidade do item "${item.description}" deve ser maior que zero.`);
      }

      const unitPriceMoney = Money.from(item.unitPrice);
      if (unitPriceMoney.isNegative() || unitPriceMoney.isZero()) {
        throw new InvalidMoneyError(`Preço unitário do item "${item.description}" deve ser estritamente positivo.`);
      }

      const itemTotal = unitPriceMoney.multiply(new Decimal(item.quantity));
      grossAccumulator = grossAccumulator.add(itemTotal);

      validatedItems.push({
        description: item.description.trim(),
        quantity: item.quantity,
        unitPrice: unitPriceMoney.toDatabaseDecimal(),
        total: itemTotal.toDatabaseDecimal(),
      });
    }

    if (grossAccumulator.isZero()) {
      throw new InvalidMoneyError('A fatura deve ter um valor bruto total maior que zero.');
    }

    // Calcula impostos e valor líquido
    let taxResult;
    if (command.taxComponents && command.taxComponents.length > 0) {
      taxResult = this.taxCalculator.calculateDetailedBreakdown(grossAccumulator, command.taxComponents);
    } else {
      const defaultRate = command.taxRatePercent ?? '0.00';
      taxResult = this.taxCalculator.calculateNetValue(grossAccumulator, defaultRate);
    }

    const initialStatus = command.issueImmediately
      ? InvoiceStatusVO.issued()
      : InvoiceStatusVO.draft();

    const now = new Date();

    return new Invoice({
      id: command.id,
      userId: command.userId,
      clientName: command.clientName.trim(),
      clientEmail: command.clientEmail.trim().toLowerCase(),
      clientTaxId: command.clientTaxId.trim().replace(/\D/g, ''),
      grossAmount: taxResult.grossAmount,
      taxRate: taxResult.taxRateDecimal,
      taxAmount: taxResult.taxAmount,
      netAmount: taxResult.netAmount,
      status: initialStatus,
      dueDate: command.dueDate,
      issuedAt: command.issueImmediately ? now : null,
      paidAt: null,
      cancelledAt: null,
      description: command.description?.trim(),
      items: validatedItems,
      taxBreakdown: taxResult.breakdown,
      createdAt: now,
      updatedAt: now,
    });
  }

  private validateCommand(command: GenerateInvoiceCommand): void {
    if (!command.id || command.id.trim() === '') {
      throw new DomainError('O identificador (UUID) da fatura é obrigatório.');
    }

    if (!command.userId || command.userId.trim() === '') {
      throw new DomainError('O ID do usuário emitente é obrigatório.');
    }

    if (!command.clientName || command.clientName.trim() === '') {
      throw new DomainError('O nome do cliente é obrigatório.');
    }

    if (!command.clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(command.clientEmail)) {
      throw new DomainError('E-mail do cliente inválido.');
    }

    const cleanTaxId = command.clientTaxId.replace(/\D/g, '');
    if (cleanTaxId.length !== 11 && cleanTaxId.length !== 14) {
      throw new DomainError('Documento do cliente inválido. Deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos).');
    }

    if (!command.items || command.items.length === 0) {
      throw new DomainError('A fatura deve conter pelo menos um item faturável.');
    }

    if (!command.dueDate || isNaN(command.dueDate.getTime())) {
      throw new DomainError('A data de vencimento da fatura é inválida.');
    }
  }
}
