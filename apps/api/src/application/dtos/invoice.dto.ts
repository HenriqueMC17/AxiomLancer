export interface CreateInvoiceItemDTO {
  description: string;
  quantity: number;
  unitPrice: string; // Ex: "150.00"
}

export interface CreateInvoiceInputDTO {
  userId: string;
  clientName: string;
  clientEmail: string;
  clientTaxId: string;
  items: CreateInvoiceItemDTO[];
  dueDate: string; // ISO Date "YYYY-MM-DD"
  description?: string;
  taxRatePercent?: string; // Ex: "6.00"
  taxComponents?: Array<{
    name: string;
    ratePercent: string;
  }>;
  issueImmediately?: boolean;
}

export interface InvoiceItemResponseDTO {
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface InvoiceResponseDTO {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientTaxId: string;
  grossAmount: string;
  taxRate: string;
  taxAmount: string;
  netAmount: string;
  status: string;
  dueDate: string;
  issuedAt?: string | null;
  paidAt?: string | null;
  cancelledAt?: string | null;
  description?: string | null;
  items: InvoiceItemResponseDTO[];
  taxBreakdown?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
