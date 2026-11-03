import { Invoice } from "../../types";

export interface IInvoiceRepository {
  listByUser(userId: string): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  create(invoice: Invoice): Promise<Invoice>;
  updateStatus(id: string, status: Invoice["status"]): Promise<boolean>;
  markAsRecovered(id: string, recoveredFee: number): Promise<boolean>;
}
