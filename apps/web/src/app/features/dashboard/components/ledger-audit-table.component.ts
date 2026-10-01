import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-ledger-audit-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="glass-card p-6 border-white/10">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-white font-['Outfit']">Livro-Razão Contábil (Audit Trail)</h3>
          <span class="text-xs text-slate-400">Partidas dobradas imutáveis com conciliação automática</span>
        </div>
        <span class="badge badge-slate">LOG AUDITÁVEL</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
            <tr>
              <th class="py-3 px-4">ID Transação</th>
              <th class="py-3 px-4">Tipo</th>
              <th class="py-3 px-4">Categoria</th>
              <th class="py-3 px-4">Descrição</th>
              <th class="py-3 px-4">Valor</th>
              <th class="py-3 px-4">Saldo Após</th>
              <th class="py-3 px-4">Data/Hora</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @for (tx of financeService.ledger(); track tx.id) {
              <tr class="hover:bg-slate-900/40 transition-colors">
                <td class="py-3 px-4 text-slate-400">{{ tx.id }}</td>
                <td class="py-3 px-4">
                  @if (tx.entryType === 'CREDIT' || tx.entryType === 'INCOME') {
                    <span class="text-emerald-400 font-bold">CRÉDITO</span>
                  } @else {
                    <span class="text-rose-400 font-bold">DÉBITO</span>
                  }
                </td>
                <td class="py-3 px-4 text-cyan-400">{{ tx.accountCategory }}</td>
                <td class="py-3 px-4 text-slate-200">{{ tx.description }}</td>
                <td class="py-3 px-4 font-bold" [class.text-emerald-400]="tx.entryType === 'CREDIT' || tx.entryType === 'INCOME'" [class.text-rose-400]="tx.entryType === 'DEBIT' || tx.entryType === 'EXPENSE'">
                  R$ {{ tx.amount | number:'1.2-2' }}
                </td>
                <td class="py-3 px-4 text-slate-300">R$ {{ tx.balanceAfter | number:'1.2-2' }}</td>
                <td class="py-3 px-4 text-slate-500">{{ tx.transactionDate | date:'short' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class LedgerAuditTableComponent {
  public financeService = inject(FinanceService);
}
