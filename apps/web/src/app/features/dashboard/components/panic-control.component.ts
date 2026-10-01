import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-panic-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card p-6 border-rose-500/20">
      <div class="flex items-center justify-between mb-4">
        <span class="badge badge-rose">ESTEIRA DE SEGURANÇA</span>
        <span class="text-xs font-mono text-slate-400">LATÊNCIA: 12ms</span>
      </div>
      <h3 class="text-lg font-bold text-white mb-2">Painel de Contingência (Safe Mode)</h3>
      <p class="text-xs text-slate-300 leading-relaxed mb-6">
        Quando ativado, bloqueia imediatamente todas as mensagens automáticas de cobrança em todos os canais de comunicação com os clientes.
      </p>

      <div class="space-y-3 font-mono text-xs mb-6">
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5">
          <span class="text-slate-400">WhatsApp Business API:</span>
          <span [class.text-rose-400]="financeService.isSafeModeActive()" [class.text-emerald-400]="!financeService.isSafeModeActive()">
            {{ financeService.isSafeModeActive() ? 'CONGELADO' : 'ATIVO & TRANSMITINDO' }}
          </span>
        </div>
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5">
          <span class="text-slate-400">Disparo de E-mails SMTP:</span>
          <span [class.text-rose-400]="financeService.isSafeModeActive()" [class.text-emerald-400]="!financeService.isSafeModeActive()">
            {{ financeService.isSafeModeActive() ? 'CONGELADO' : 'ATIVO & TRANSMITINDO' }}
          </span>
        </div>
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/5">
          <span class="text-slate-400">PIX Dinâmico BACEN:</span>
          <span class="text-emerald-400">ONLINE (PRONTO P/ RECEBIMENTO)</span>
        </div>
      </div>

      <button
        (click)="financeService.toggleSafeMode()"
        [class.btn-panic]="!financeService.isSafeModeActive()"
        [class.btn-panic-active]="financeService.isSafeModeActive()"
        class="w-full py-3 text-xs font-bold rounded-xl cursor-pointer">
        {{ financeService.isSafeModeActive() ? 'Desativar Safe Mode (Retomar Régua)' : 'Acionar Safe Mode Imediato (12ms)' }}
      </button>
    </div>
  `,
})
export class PanicControlComponent {
  public financeService = inject(FinanceService);
}
