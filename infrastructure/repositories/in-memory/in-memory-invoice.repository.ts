import { IInvoiceRepository } from "@/core/domain/ports/repositories/invoice.repository.port";
import { Invoice } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryInvoiceRepository implements IInvoiceRepository {
  public async listByUser(userId: string): Promise<Invoice[]> {
    const state = Database.getState();
    return state.invoices.filter((inv) => inv.user_id === userId);
  }

  public async findById(id: string): Promise<Invoice | null> {
    const state = Database.getState();
    const found = state.invoices.find((inv) => inv.id === id);
    return found ? { ...found } : null;
  }

  public async create(invoice: Invoice): Promise<Invoice> {
    const state = Database.getState();
    state.invoices.push({ ...invoice });
    return { ...invoice };
  }

  public async updateStatus(id: string, status: Invoice["status"]): Promise<boolean> {
    const state = Database.getState();
    const inv = state.invoices.find((i) => i.id === id);
    if (!inv) return false;
    inv.status = status;
    return true;
  }

  public async markAsRecovered(id: string, recoveredFee: number): Promise<boolean> {
    const state = Database.getState();
    const inv = state.invoices.find((i) => i.id === id);
    if (!inv) return false;
    inv.status = "PAID";
    inv.recovered_by_engine = true;
    state.takeRates.push({
      id: `tr_${Date.now()}`,
      invoice_id: inv.id,
      recovered_amount: inv.gross_value - recoveredFee,
      rate_percent: 5.0,
      commission_amount: recoveredFee,
      recovered_at: new Date().toISOString(),
    });
    return true;
  }
}
