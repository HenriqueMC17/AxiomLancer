import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-panic-sandbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="panic" class="py-20 px-4 max-w-4xl mx-auto text-center">
      <span class="badge badge-rose mb-3">EXPERIÊNCIA EM TEMPO REAL</span>
      <h2 class="text-3xl sm:text-4xl font-bold font-['Outfit'] text-white mb-4">Teste o Botão de Pânico (Safe Mode)</h2>
      <p class="text-slate-400 max-w-2xl mx-auto text-sm mb-8">
        Clique no botão abaixo para simular o congelamento instantâneo da esteira de cobrança em 12ms.
      </p>

      <div class="glass-card p-8 border-rose-500/20 max-w-lg mx-auto">
        <div class="mb-6">
          <span class="text-xs font-mono text-slate-400 block mb-2">STATUS ATUAL DA ESTEIRA:</span>
          @if (isSandboxPanicActive()) {
            <span class="badge badge-rose text-sm px-4 py-1.5">SAFE MODE ATIVADO (CONGELADA)</span>
          } @else {
            <span class="badge badge-emerald text-sm px-4 py-1.5">MOTOR OPERANDO NORMALMENTE</span>
          }
        </div>

        <button
          (click)="toggleSandboxPanic()"
          [class.btn-panic]="!isSandboxPanicActive()"
          [class.btn-panic-active]="isSandboxPanicActive()"
          class="w-full py-4 text-base font-bold rounded-xl cursor-pointer transition-all">
          @if (isSandboxPanicActive()) {
            <span>✓ Descongelar Esteira e Retomar Automação</span>
          } @else {
            <span>⚡ ACIONAR BOTÃO DE PÂNICO (12ms)</span>
          }
        </button>

        <p class="text-[11px] font-mono text-slate-400 mt-4">
          Latência de execução: 12ms | Sem notificação ao cliente | Bloqueio atômico em nível de banco
        </p>
      </div>
    </section>
  `,
})
export class PanicSandboxComponent {
  private toastService = inject(ToastService);
  public isSandboxPanicActive = signal<boolean>(false);

  public toggleSandboxPanic(): void {
    const next = !this.isSandboxPanicActive();
    this.isSandboxPanicActive.set(next);
    if (next) {
      this.toastService.show('Sandbox: Safe Mode ativado em 12ms! Réguas congeladas.', 'alert');
    } else {
      this.toastService.show('Sandbox: Esteira de cobrança reativada.', 'success');
    }
  }
}
