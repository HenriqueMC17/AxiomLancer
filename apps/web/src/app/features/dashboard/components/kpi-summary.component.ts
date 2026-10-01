import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-kpi-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Receita Liquidada -->
      <div class="glass-card p-5 border-emerald-500/20 relative overflow-hidden">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>RECEITA LIQUIDADA</span>
          <span class="text-emerald-400 font-bold">↑ 14.2%</span>
        </div>
        <div class="text-2xl lg:text-3xl font-bold font-mono text-emerald-400 mb-1">
          R$ {{ financeService.metrics().liquidatedRevenue | number:'1.2-2' }}
        </div>
        <span class="text-xs text-slate-400">Total liquidado na conta operacional</span>
      </div>

      <!-- Contas a Receber -->
      <div class="glass-card p-5 border-cyan-500/20 relative overflow-hidden">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>CONTAS A RECEBER</span>
          <span class="badge badge-cyan text-[10px]">{{ financeService.totalActiveInvoices() }} ativas</span>
        </div>
        <div class="text-2xl lg:text-3xl font-bold font-mono text-cyan-400 mb-1">
          R$ {{ financeService.metrics().receivables | number:'1.2-2' }}
        </div>
        <span class="text-xs text-slate-400">Faturas emitidas sob régua preditiva</span>
      </div>

      <!-- Despesas Operacionais (OPEX) -->
      <div class="glass-card p-5 border-rose-500/20 relative overflow-hidden">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>DESPESAS (OPEX)</span>
          <span class="text-slate-400 font-mono">Dedução</span>
        </div>
        <div class="text-2xl lg:text-3xl font-bold font-mono text-rose-400 mb-1">
          R$ {{ financeService.metrics().operationalExpenses | number:'1.2-2' }}
        </div>
        <span class="text-xs text-slate-400">Custos fixos, licenças e ferramentas</span>
      </div>

      <!-- Reserva Tributária (Cofre Virtual) -->
      <div class="glass-card p-5 border-amber-500/20 relative overflow-hidden">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>COFRE TRIBUTÁRIO (6%)</span>
          <span class="badge badge-amber text-[10px]">SPLIT ATIVO</span>
        </div>
        <div class="text-2xl lg:text-3xl font-bold font-mono text-amber-400 mb-1">
          R$ {{ financeService.metrics().taxReserve | number:'1.2-2' }}
        </div>
        <span class="text-xs text-slate-400">Provisionado para Simples Nacional / DAS</span>
      </div>
    </section>
  `,
})
export class KpiSummaryComponent {
  public financeService = inject(FinanceService);
}
