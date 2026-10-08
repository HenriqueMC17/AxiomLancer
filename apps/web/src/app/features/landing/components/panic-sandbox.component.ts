import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-panic-sandbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="panic" class="panic-section-wrap">
      <div class="section-header">
        <span class="badge badge-rose mb-3">EXPERIÊNCIA EM TEMPO REAL</span>
        <h2 class="section-title">Teste o Botão de Pânico (Safe Mode)</h2>
        <p class="section-desc">
          Clique no botão abaixo para simular o congelamento instantâneo da esteira de cobrança em 12ms.
        </p>
      </div>

      <div class="glass-card console-card">
        <div class="console-status-row">
          <span class="status-label">STATUS ATUAL DA ESTEIRA:</span>
          @if (isSandboxPanicActive()) {
            <span class="badge badge-rose text-sm px-4 py-1.5 status-badge">
              <span class="dot-red"></span>
              SAFE MODE ATIVADO (CONGELADA)
            </span>
          } @else {
            <span class="badge badge-emerald text-sm px-4 py-1.5 status-badge">
              <span class="dot-green"></span>
              MOTOR OPERANDO NORMALMENTE
            </span>
          }
        </div>

        <button
          (click)="toggleSandboxPanic()"
          [class.btn-panic-active]="isSandboxPanicActive()"
          [class.btn-panic-normal]="!isSandboxPanicActive()"
          class="panic-trigger-btn">
          @if (isSandboxPanicActive()) {
            <span class="btn-text">✓ Descongelar Esteira e Retomar Automação</span>
          } @else {
            <span class="btn-text">⚡ ACIONAR BOTÃO DE PÂNICO (12ms)</span>
          }
        </button>

        <div class="console-specs-footer">
          <span class="spec-item">Latência: <strong>12ms</strong></span>
          <span class="spec-divider">•</span>
          <span class="spec-item">Sem notificação ao cliente</span>
          <span class="spec-divider">•</span>
          <span class="spec-item">Bloqueio atômico em nível de banco</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #121212;
      padding: 5rem 1.5rem;
    }

    .panic-section-wrap {
      max-width: 640px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin: 0.5rem 0 0.5rem 0;
    }

    .section-desc {
      font-size: 0.95rem;
      color: #94a3b8;
      max-width: 520px;
      margin: 0 auto;
    }

    /* Console Card */
    .console-card {
      padding: 2.5rem 2rem;
      border: 1px solid rgba(244, 63, 94, 0.25);
      background: #18191e;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .console-status-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 2rem;
    }

    .status-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dot-green {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .dot-red {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #f43f5e;
      box-shadow: 0 0 8px #f43f5e;
    }

    /* Panic Trigger Button */
    .panic-trigger-btn {
      width: 100%;
      padding: 1.15rem 1.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 800;
      border-radius: 0.85rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      margin-bottom: 1.5rem;
    }

    .btn-panic-normal {
      background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 6px 24px rgba(244, 63, 94, 0.45);
    }

    .btn-panic-normal:hover {
      background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(244, 63, 94, 0.6);
    }

    .btn-panic-active {
      background: #27272a;
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: none;
    }

    .btn-panic-active:hover {
      background: #3f3f46;
      color: #ffffff;
    }

    .btn-text {
      display: inline-block;
      letter-spacing: 0.02em;
    }

    /* Specs Footer */
    .console-specs-footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: #64748b;
    }

    .spec-item strong {
      color: #94a3b8;
    }

    .spec-divider {
      color: #334155;
    }
  `],
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
