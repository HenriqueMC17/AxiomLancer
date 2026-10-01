import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NewExpenseFormData {
  description: string;
  category: string;
  amount: number;
}

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-container p-6">
        <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h4 class="text-lg font-bold text-white font-['Outfit']">Lançar Despesa Operacional</h4>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Descrição</label>
            <input type="text" [(ngModel)]="form.description" class="form-input" placeholder="Ex: Servidores Cloud AWS" />
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Categoria</label>
            <select [(ngModel)]="form.category" class="form-input">
              <option value="Software">Software & Ferramentas</option>
              <option value="Hospedagem">Infraestrutura & Nuvem</option>
              <option value="Contabilidade">Contabilidade & Jurídico</option>
              <option value="Equipamento">Hardware & Equipamentos</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">Valor (R$)</label>
            <input type="number" [(ngModel)]="form.amount" class="form-input" placeholder="850.00" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
          <button (click)="close.emit()" class="btn-secondary text-xs">Cancelar</button>
          <button (click)="onSubmit()" class="btn-primary text-xs">Lançar no Ledger</button>
        </div>
      </div>
    </div>
  `,
})
export class ExpenseModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitExpense = new EventEmitter<NewExpenseFormData>();

  public form: NewExpenseFormData = {
    description: '',
    category: 'Software',
    amount: 500,
  };

  public onSubmit(): void {
    this.submitExpense.emit({ ...this.form });
  }
}
