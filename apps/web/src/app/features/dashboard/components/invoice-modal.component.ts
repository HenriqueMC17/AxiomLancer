import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NewInvoiceFormData {
  clientName: string;
  clientTaxId: string;
  grossAmount: number;
  taxRatePercent: number;
  dueDate: string;
}

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-container p-6">
        <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h4 class="text-lg font-bold text-white font-['Outfit']">Emitir Nova Fatura</h4>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Nome do Cliente ou Razão Social</label>
            <input type="text" [(ngModel)]="form.clientName" class="form-input" placeholder="Ex: Acme Software Corp" />
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">CNPJ / CPF do Cliente</label>
            <input type="text" [(ngModel)]="form.clientTaxId" class="form-input" placeholder="00.000.000/0001-00" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">Valor Bruto (R$)</label>
              <input type="number" [(ngModel)]="form.grossAmount" class="form-input" placeholder="15000" />
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">Alíquota (%)</label>
              <input type="number" [(ngModel)]="form.taxRatePercent" class="form-input" placeholder="6" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Data de Vencimento</label>
            <input type="date" [(ngModel)]="form.dueDate" class="form-input" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
          <button (click)="close.emit()" class="btn-secondary text-xs">Cancelar</button>
          <button (click)="onSubmit()" class="btn-primary text-xs">Emitir e Iniciar Régua</button>
        </div>
      </div>
    </div>
  `,
})
export class InvoiceModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitInvoice = new EventEmitter<NewInvoiceFormData>();

  public form: NewInvoiceFormData = {
    clientName: '',
    clientTaxId: '',
    grossAmount: 12000,
    taxRatePercent: 6,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  };

  public onSubmit(): void {
    this.submitInvoice.emit({ ...this.form });
  }
}
