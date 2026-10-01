import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-invoices-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="glass-card p-6 border-white/10">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 class="text-xl font-bold text-white font-['Outfit']">Faturas & Recebíveis</h3>
          <span class="text-xs text-slate-400">Esteira autônoma de cobrança e conciliação bancária</span>
        </div>
        <button (click)="openCreateInvoice.emit()" class="btn-primary text-xs">
          + Emitir Fatura
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
            <tr>
              <th class="py-3 px-4">Identificador</th>
              <th class="py-3 px-4">Cliente</th>
              <th class="py-3 px-4">Valor Bruto</th>
              <th class="py-3 px-4">Split Fiscal</th>
              <th class="py-3 px-4">Valor Líquido</th>
              <th class="py-3 px-4">Vencimento</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @for (inv of financeService.invoices(); track inv.id) {
              <tr class="hover:bg-slate-900/40 transition-colors">
                <td class="py-3 px-4 font-bold text-white">{{ inv.id }}</td>
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
                  @if (inv.status !== 'PAID') {
                    <button
                      (click)="financeService.settleInvoice(inv.id)"
                      class="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded text-xs cursor-pointer font-sans transition-all">
                      Liquidar
                    </button>
                  } @else {
                    <span class="text-slate-500 text-[11px]">✓ Conciliada</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class InvoicesTableComponent {
  public financeService = inject(FinanceService);
  @Output() openCreateInvoice = new EventEmitter<void>();
}
