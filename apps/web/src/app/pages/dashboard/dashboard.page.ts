import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../core/services/finance.service';
import { ToastService } from '../../core/services/toast.service';
import {
  DashboardHeaderComponent,
  KpiSummaryComponent,
  CashflowProjectionComponent,
  PanicControlComponent,
  TaxVaultComponent,
  InvoicesTableComponent,
  LedgerAuditTableComponent,
  InvoiceModalComponent,
  ExpenseModalComponent,
  NewInvoiceFormData,
  NewExpenseFormData,
} from '../../features/dashboard/components';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeaderComponent,
    KpiSummaryComponent,
    CashflowProjectionComponent,
    PanicControlComponent,
    TaxVaultComponent,
    InvoicesTableComponent,
    LedgerAuditTableComponent,
    InvoiceModalComponent,
    ExpenseModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-[#07090e] text-slate-100 pb-16">
      
      <!-- 1. Top Cockpit Header -->
      <app-dashboard-header
        (openCreateInvoice)="isCreateInvoiceOpen.set(true)"
        (openCreateExpense)="isCreateExpenseOpen.set(true)"
      />

      <!-- Conteúdo Principal do Dashboard -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        <!-- 2. Placares de BI Top Level (KPIs) -->
        <app-kpi-summary />

        <!-- 3. Health Score & Projeção de Fluxo de Caixa -->
        <app-cashflow-projection />

        <!-- 4. Duplo Centro de Comando: Botão de Pânico & Cofre Virtual -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-panic-control />
          <app-tax-vault />
        </section>

        <!-- 5. Gestão de Faturas & Recebíveis -->
        <app-invoices-table
          (openCreateInvoice)="isCreateInvoiceOpen.set(true)"
        />

        <!-- 6. Livro Razão Contábil (Core Fact Ledger) -->
        <app-ledger-audit-table />

      </main>

      <!-- Modal: Nova Fatura -->
      @if (isCreateInvoiceOpen()) {
        <app-invoice-modal
          (close)="isCreateInvoiceOpen.set(false)"
          (submitInvoice)="handleCreateInvoice($event)"
        />
      }

      <!-- Modal: Nova Despesa (OPEX) -->
      @if (isCreateExpenseOpen()) {
        <app-expense-modal
          (close)="isCreateExpenseOpen.set(false)"
          (submitExpense)="handleCreateExpense($event)"
        />
      }

    </div>
  `,
})
export class DashboardPageComponent {
  private financeService = inject(FinanceService);
  private toast = inject(ToastService);

  // Controle de Modais
  public isCreateInvoiceOpen = signal<boolean>(false);
  public isCreateExpenseOpen = signal<boolean>(false);

  public handleCreateInvoice(data: NewInvoiceFormData): void {
    if (!data.clientName) {
      this.toast.show('Informe o nome do cliente.', 'alert');
      return;
    }
    this.financeService.createInvoice({
      clientName: data.clientName,
      clientTaxId: data.clientTaxId || '00.000.000/0001-00',
      grossAmount: Number(data.grossAmount),
      taxRatePercent: Number(data.taxRatePercent),
      dueDate: data.dueDate,
    });
    this.isCreateInvoiceOpen.set(false);
  }

  public handleCreateExpense(data: NewExpenseFormData): void {
    if (!data.description || data.amount <= 0) {
      this.toast.show('Informe a descrição e o valor da despesa.', 'alert');
      return;
    }
    this.financeService.createExpense(
      Number(data.amount),
      data.description,
      data.category
    );
    this.isCreateExpenseOpen.set(false);
  }
}
