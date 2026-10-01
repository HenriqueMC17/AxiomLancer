import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-tax-vault',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-6 border-amber-500/20">
      <div class="flex items-center justify-between mb-4">
        <span class="badge badge-amber">DISCRIMINAÇÃO FISCAL</span>
        <span class="text-xs font-mono text-slate-400">SIMPLES NACIONAL</span>
      </div>
      <h3 class="text-lg font-bold text-white mb-2">Cofre Virtual Tributário</h3>
      <p class="text-xs text-slate-300 leading-relaxed mb-6">
        Cada fatura liquidada tem seus impostos segregados matematicamente para quitação exata do Documento de Arrecadação do Simples (DAS).
      </p>

      <div class="space-y-3 font-mono text-xs mb-6">
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5">
          <span class="text-slate-400">Alíquota Efetiva Total:</span>
          <span class="text-amber-400 font-bold">{{ financeService.taxBreakdown().effectiveRate }}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="p-2 rounded bg-slate-900 border border-white/5">
            <span class="text-[10px] text-slate-400 block">ISS</span>
            <span class="text-white font-bold">{{ financeService.taxBreakdown().iss }}</span>
          </div>
          <div class="p-2 rounded bg-slate-900 border border-white/5">
            <span class="text-[10px] text-slate-400 block">PIS/COFINS</span>
            <span class="text-white font-bold">{{ financeService.taxBreakdown().pisCofins }}</span>
          </div>
          <div class="p-2 rounded bg-slate-900 border border-white/5">
            <span class="text-[10px] text-slate-400 block">IRPJ/CSLL</span>
            <span class="text-white font-bold">{{ financeService.taxBreakdown().irpjCsll }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30">
          <span class="text-slate-300">Total Reservado no Cofre:</span>
          <span class="text-amber-400 font-bold text-sm">
            R$ {{ financeService.metrics().taxReserve | number:'1.2-2' }}
          </span>
        </div>
      </div>

      <div class="text-[11px] text-slate-400 font-mono text-center">
        Vencimento projetado: Dia 20 do próximo mês | Zero risco de multas
      </div>
    </div>
  `,
})
export class TaxVaultComponent {
  public financeService = inject(FinanceService);
}
