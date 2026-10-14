import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceItem } from '../../../core/models/financial.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-invoice-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Header do Modal -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              ⚡
            </div>
            <div>
              <span class="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                COBRANÇA &amp; PIX BACEN DINÂMICO
              </span>
              <h3 class="text-lg font-bold text-white font-['Outfit']">{{ invoice.id }}</h3>
            </div>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        <!-- Corpo: Dados da Fatura e Split -->
        <div class="space-y-4 py-4">
          <!-- Card Cliente -->
          <div class="p-3 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] font-mono text-slate-500 uppercase">Sacado / Cliente:</span>
              <h4 class="text-sm font-semibold text-slate-100">{{ invoice.clientName }}</h4>
              <span class="text-[11px] font-mono text-slate-400">{{ invoice.clientTaxId }}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-mono text-slate-500 uppercase">Vencimento:</span>
              <span class="block text-xs font-mono font-bold text-slate-200">{{ invoice.dueDate }}</span>
              @if (invoice.status === 'PAID') {
                <span class="badge badge-emerald mt-1">LIQUIDADA</span>
              } @else if (invoice.status === 'OVERDUE') {
                <span class="badge badge-rose mt-1">EM ATRASO</span>
              } @else {
                <span class="badge badge-cyan mt-1">EMITIDA</span>
              }
            </div>
          </div>

          <!-- Demonstrativo de Valores e Split Fiscal -->
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span class="text-[10px] font-mono text-slate-400 uppercase block">Valor Bruto</span>
              <span class="text-sm font-bold text-white font-mono">
                R$ {{ invoice.grossAmount | number:'1.2-2' }}
              </span>
            </div>
            <div class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span class="text-[10px] font-mono text-amber-400 uppercase block">Split Cofre (6%)</span>
              <span class="text-sm font-bold text-amber-300 font-mono">
                R$ {{ invoice.taxAmount | number:'1.2-2' }}
              </span>
            </div>
            <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span class="text-[10px] font-mono text-emerald-400 uppercase block">Líquido na Conta</span>
              <span class="text-sm font-bold text-emerald-300 font-mono">
                R$ {{ invoice.netAmount | number:'1.2-2' }}
              </span>
            </div>
          </div>

          <!-- QR Code PIX BACEN Dinâmico Mockup Realista -->
          <div class="pix-box p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
            <span class="text-[11px] font-mono text-slate-300 font-bold block mb-2">
              QR CODE PIX DINÂMICO BACEN COM SPLIT RETIDO
            </span>

            <div class="qr-container mx-auto my-3">
              <!-- SVG do QR Code Estilizado -->
              <svg width="140" height="140" viewBox="0 0 140 140" class="mx-auto bg-white p-2 rounded-lg">
                <!-- Padrões de canto do QR Code -->
                <rect x="10" y="10" width="35" height="35" fill="#000" rx="4"/>
                <rect x="16" y="16" width="23" height="23" fill="#fff" rx="2"/>
                <rect x="22" y="22" width="11" height="11" fill="#000" rx="1"/>

                <rect x="95" y="10" width="35" height="35" fill="#000" rx="4"/>
                <rect x="101" y="16" width="23" height="23" fill="#fff" rx="2"/>
                <rect x="107" y="22" width="11" height="11" fill="#000" rx="1"/>

                <rect x="10" y="95" width="35" height="35" fill="#000" rx="4"/>
                <rect x="16" y="101" width="23" height="23" fill="#fff" rx="2"/>
                <rect x="22" y="107" width="11" height="11" fill="#000" rx="1"/>

                <!-- Matriz de dados representativa -->
                <rect x="52" y="15" width="8" height="8" fill="#10b981"/>
                <rect x="65" y="25" width="8" height="8" fill="#000"/>
                <rect x="78" y="15" width="8" height="8" fill="#000"/>

                <rect x="52" y="52" width="8" height="8" fill="#000"/>
                <rect x="65" y="65" width="10" height="10" fill="#10b981"/>
                <rect x="78" y="52" width="8" height="8" fill="#000"/>
                <rect x="95" y="65" width="8" height="8" fill="#000"/>

                <rect x="15" y="55" width="8" height="8" fill="#000"/>
                <rect x="28" y="68" width="8" height="8" fill="#10b981"/>
                <rect x="52" y="95" width="8" height="8" fill="#000"/>
                <rect x="65" y="108" width="8" height="8" fill="#000"/>
                <rect x="78" y="95" width="8" height="8" fill="#10b981"/>
                <rect x="95" y="95" width="10" height="10" fill="#000"/>
                <rect x="110" y="110" width="8" height="8" fill="#000"/>
              </svg>
            </div>

            <!-- Código Copia e Cola -->
            <div class="mt-3">
              <span class="text-[10px] font-mono text-slate-400 block mb-1">PIX COPIA E COLA:</span>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  readonly
                  [value]="pixCopyPaste"
                  class="w-full bg-[#131418] border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-300 select-all outline-none"
                />
                <button
                  type="button"
                  (click)="copyPix()"
                  class="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded text-xs hover:bg-emerald-400 cursor-pointer transition-colors whitespace-nowrap">
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer com Ações -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            (click)="close.emit()"
            class="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg border border-white/10">
            Fechar
          </button>

          @if (invoice.status !== 'PAID') {
            <button
              type="button"
              (click)="settle.emit(invoice.id); close.emit()"
              class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:brightness-110 cursor-pointer shadow-lg shadow-emerald-500/20">
              Simular Liquidação Imediata (PIX) →
            </button>
          } @else {
            <span class="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span>✓</span> Fatura Liquidada &amp; Conciliada
            </span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      background: #181920;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 1.25rem;
      max-width: 500px;
      width: 100%;
      padding: 1.75rem;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
      animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class InvoiceDetailModalComponent {
  @Input({ required: true }) invoice!: InvoiceItem;
  @Output() close = new EventEmitter<void>();
  @Output() settle = new EventEmitter<string>();

  private toast = inject(ToastService);

  public get pixCopyPaste(): string {
    return `00020126580014br.gov.bcb.pix0136axiom-${this.invoice.id}-bacen520400005303986540${this.invoice.grossAmount.toFixed(2)}5802BR5925AXIOM LANCER TECNOLOGIA6009SAO PAULO62070503***6304E8A2`;
  }

  public copyPix(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.pixCopyPaste);
      this.toast.show('Chave PIX copia-e-cola copiada para a área de transferência!', 'success');
    }
  }
}
