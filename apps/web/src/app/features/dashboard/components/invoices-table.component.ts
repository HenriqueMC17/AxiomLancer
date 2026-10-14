import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { ToastService } from '../../../core/services/toast.service';
import { InvoiceItem } from '../../../core/models/financial.model';
import { InvoiceDetailModalComponent } from './invoice-detail-modal.component';

@Component({
  selector: 'app-invoices-table',
  standalone: true,
  imports: [CommonModule, FormsModule, InvoiceDetailModalComponent],
  template: `
    <section class="glass-card p-6 border-white/10">
      <!-- Topo: Título e Ações Globais -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="text-xl font-bold text-white font-['Outfit']">Faturas &amp; Recebíveis</h3>
            <span class="badge badge-emerald text-[10px]">PIX BACEN DINÂMICO</span>
          </div>
          <span class="text-xs text-slate-400">
            Esteira autônoma de cobrança, conciliação bancária e split tributário de 6% retido em cofre
          </span>
        </div>

        <div class="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            (click)="exportToCsv()"
            class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all flex items-center gap-1.5">
            <span>📥</span>
            <span>Exportar CSV</span>
          </button>
          <button
            type="button"
            (click)="openCreateInvoice.emit()"
            class="btn-primary text-xs py-2 px-3.5 whitespace-nowrap cursor-pointer">
            + Emitir Fatura
          </button>
        </div>
      </div>

      <!-- Barra de Filtros e Busca -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 p-3 rounded-xl bg-slate-950/70 border border-white/5">
        <!-- Campo de Busca -->
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por cliente ou ID (ex: Nexus, INV-089)..."
            class="w-full bg-[#131418] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- Chips de Filtro por Status -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            (click)="statusFilter.set('ALL')"
            [class.chip-active]="statusFilter() === 'ALL'"
            class="filter-chip cursor-pointer">
            Todas ({{ financeService.invoices().length }})
          </button>
          <button
            type="button"
            (click)="statusFilter.set('ISSUED')"
            [class.chip-active]="statusFilter() === 'ISSUED'"
            class="filter-chip cursor-pointer text-cyan-400">
            Emitidas
          </button>
          <button
            type="button"
            (click)="statusFilter.set('PAID')"
            [class.chip-active]="statusFilter() === 'PAID'"
            class="filter-chip cursor-pointer text-emerald-400">
            Liquidadas
          </button>
          <button
            type="button"
            (click)="statusFilter.set('OVERDUE')"
            [class.chip-active]="statusFilter() === 'OVERDUE'"
            class="filter-chip cursor-pointer text-rose-400">
            Em Atraso
          </button>
        </div>
      </div>

      <!-- Tabela Tabulada com Partidas Dobradas -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
            <tr>
              <th class="py-3 px-4">Identificador</th>
              <th class="py-3 px-4">Cliente / Tomador</th>
              <th class="py-3 px-4">Valor Bruto</th>
              <th class="py-3 px-4">Split Fiscal (6%)</th>
              <th class="py-3 px-4">Valor Líquido</th>
              <th class="py-3 px-4">Vencimento</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @for (inv of filteredInvoices(); track inv.id) {
              <tr class="hover:bg-slate-900/50 transition-colors">
                <td class="py-3 px-4 font-bold text-white">
                  <button
                    type="button"
                    (click)="selectedInvoice.set(inv)"
                    class="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <span>⚡</span>
                    <span>{{ inv.id }}</span>
                  </button>
                </td>
                <td class="py-3 px-4">
                  <span class="font-sans font-semibold text-slate-200 block">{{ inv.clientName }}</span>
                  <span class="text-[10px] text-slate-500">{{ inv.clientTaxId }}</span>
                </td>
                <td class="py-3 px-4 font-bold text-slate-200">R$ {{ inv.grossAmount | number:'1.2-2' }}</td>
                <td class="py-3 px-4 text-amber-400">R$ {{ inv.taxAmount | number:'1.2-2' }}</td>
                <td class="py-3 px-4 text-emerald-400 font-bold">R$ {{ inv.netAmount | number:'1.2-2' }}</td>
                <td class="py-3 px-4 text-slate-400">{{ inv.dueDate }}</td>
                <td class="py-3 px-4">
                  @if (inv.status === 'PAID') {
                    <span class="badge badge-emerald">LIQUIDADA</span>
                  } @else if (inv.status === 'OVERDUE') {
                    <span class="badge badge-rose">EM ATRASO</span>
                  } @else if (inv.status === 'ISSUED' || inv.status === 'PENDING') {
                    <span class="badge badge-cyan">EMITIDA</span>
                  } @else {
                    <span class="badge badge-slate">RASCUNHO</span>
                  }
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      (click)="selectedInvoice.set(inv)"
                      title="Ver QR Code PIX e Detalhes"
                      class="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 text-xs cursor-pointer font-sans transition-all">
                      Ver PIX
                    </button>
                    @if (inv.status !== 'PAID') {
                      <button
                        type="button"
                        (click)="financeService.settleInvoice(inv.id)"
                        class="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded text-xs cursor-pointer font-sans transition-all font-semibold">
                        Liquidar
                      </button>
                    } @else {
                      <span class="text-slate-500 text-[11px] font-sans">✓ Conciliada</span>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8" class="text-center py-8 text-slate-500 text-xs font-sans">
                  Nenhuma fatura encontrada com os filtros selecionados.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal de Detalhes da Fatura / QR Code PIX -->
      @if (selectedInvoice(); as activeInv) {
        <app-invoice-detail-modal
          [invoice]="activeInv"
          (close)="selectedInvoice.set(null)"
          (settle)="financeService.settleInvoice($event)"
        />
      }
    </section>
  `,
  styles: [`
    .filter-chip {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-family: var(--font-mono, monospace);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .filter-chip:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .chip-active {
      background: rgba(16, 185, 129, 0.15) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
    }
  `]
})
export class InvoicesTableComponent {
  public financeService = inject(FinanceService);
  private toast = inject(ToastService);

  @Output() openCreateInvoice = new EventEmitter<void>();

  public searchTerm = '';
  public statusFilter = signal<'ALL' | 'ISSUED' | 'PAID' | 'OVERDUE'>('ALL');
  public selectedInvoice = signal<InvoiceItem | null>(null);

  public filteredInvoices(): InvoiceItem[] {
    let list = this.financeService.invoices();

    // Filtro por status
    const sf = this.statusFilter();
    if (sf !== 'ALL') {
      list = list.filter((i) => i.status === sf);
    }

    // Filtro por texto
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(term) ||
          i.clientName.toLowerCase().includes(term) ||
          (i.clientTaxId && i.clientTaxId.includes(term))
      );
    }

    return list;
  }

  public exportToCsv(): void {
    const list = this.filteredInvoices();
    if (list.length === 0) {
      this.toast.show('Nenhuma fatura disponível para exportação.', 'alert');
      return;
    }

    const headers = ['ID', 'Cliente', 'CNPJ/CPF', 'Valor Bruto (R$)', 'Split Fiscal 6% (R$)', 'Valor Liquido (R$)', 'Vencimento', 'Status'];
    const rows = list.map((i) => [
      i.id,
      `"${i.clientName.replace(/"/g, '""')}"`,
      `"${i.clientTaxId}"`,
      i.grossAmount.toFixed(2),
      i.taxAmount.toFixed(2),
      i.netAmount.toFixed(2),
      i.dueDate,
      i.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `faturas_axiomlancer_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toast.show('Extrato de faturas exportado em CSV com sucesso!', 'success');
  }
}
