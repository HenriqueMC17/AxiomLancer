import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-cashflow-projection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Scoring Financeiro -->
      <div class="glass-card p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="badge badge-emerald">PREVISIO SCORING</span>
            <span class="text-xs font-mono text-slate-400">ALGORITMO V2</span>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Score de Saúde Financeira</h3>
          <p class="text-xs text-slate-400 mb-6">
            Medição de estabilidade com base em inadimplência projetada e solvência da esteira.
          </p>
        </div>

        <div class="text-center p-6 bg-slate-950/60 rounded-xl border border-white/5">
          <span class="text-5xl font-black text-emerald-400 font-mono block mb-1">
            {{ financeService.formattedHealthScore() }}
          </span>
          <span class="text-xs text-slate-400 font-mono">NÍVEL: EXCELENTE (RISCO BAIXO)</span>
        </div>

        <div class="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs font-mono text-slate-400">
          <span>Taxa de Risco: <strong class="text-white">{{ financeService.metrics().defaultRiskRate }}%</strong></span>
          <span>Previsão: <strong class="text-emerald-400">Solvente</strong></span>
        </div>
      </div>

      <!-- Timeline Preditiva de Fluxo de Caixa -->
      <div class="glass-card p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-white">Projeção Preditiva de Fluxo de Caixa</h3>
            <span class="text-xs text-slate-400">Previsão dos próximos períodos baseada em contratos e esteira de cobrança</span>
          </div>
          <span class="badge badge-cyan text-xs">MENSAL</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          @for (point of financeService.cashflowProjection(); track point.period) {
            <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
              <span class="text-xs font-bold text-slate-300 block mb-2">{{ point.period }}</span>
              <div class="space-y-1 text-[11px] font-mono">
                <div class="text-emerald-400">+{{ point.receivables / 1000 | number:'1.0-0' }}k</div>
                <div class="text-rose-400">-{{ point.expenses / 1000 | number:'1.0-0' }}k</div>
                <div class="text-amber-400">T:{{ point.taxReserve / 1000 | number:'1.0-0' }}k</div>
                <div class="pt-1 border-t border-white/10 text-white font-bold">
                  {{ point.netCashflow / 1000 | number:'1.0-0' }}k
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class CashflowProjectionComponent {
  public financeService = inject(FinanceService);
}
