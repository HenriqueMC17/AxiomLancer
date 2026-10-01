import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FinanceService } from '../../core/services/finance.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { InvoiceItem, LedgerEntry } from '../../core/models/financial.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#07090e] text-slate-100 pb-16">
      
      <!-- 1. Top Cockpit Header -->
      <header class="border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <a routerLink="/" class="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <span>←</span>
              <span>Início</span>
            </a>
            <div class="h-4 w-px bg-white/10"></div>
            <div>
              <h1 class="text-xl font-bold font-['Outfit'] text-white flex items-center gap-2">
                <span>Painel Financeiro Executivo</span>
                <span class="badge badge-emerald text-[10px]">LIVE CORE</span>
              </h1>
              <span class="text-xs font-mono text-slate-400">
                Sessão BFF: {{ authService.currentUser()?.email || 'freelancer.pro@axiomlancer.dev' }}
              </span>
            </div>
          </div>

          <!-- Ações Rápidas & Botão de Pânico -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Botão de Pânico Safe Mode -->
            <button
              (click)="financeService.toggleSafeMode()"
              [class.btn-panic]="!financeService.isSafeModeActive()"
              [class.btn-panic-active]="financeService.isSafeModeActive()"
              class="text-xs cursor-pointer py-2 px-4 rounded-lg font-bold">
              @if (financeService.isSafeModeActive()) {
                <span>🔒 Safe Mode ATIVO (Congelado)</span>
              } @else {
                <span>⚡ Ativar Botão de Pânico (12ms)</span>
              }
            </button>

            <!-- Nova Fatura -->
            <button
              (click)="isCreateInvoiceOpen.set(true)"
              class="btn-primary text-xs py-2 px-4 rounded-lg">
              <span>+ Nova Fatura</span>
            </button>

            <!-- Nova Despesa -->
            <button
              (click)="isCreateExpenseOpen.set(true)"
              class="btn-secondary text-xs py-2 px-3 rounded-lg">
              <span>- Despesa (OPEX)</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Conteúdo Principal do Dashboard -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        <!-- 2. Placares de BI Top Level (KPIs) -->
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

        <!-- 3. Health Score & Projeção de Fluxo de Caixa -->
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

        <!-- 4. Duplo Centro de Comando: Botão de Pânico & Cofre Virtual -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Botão de Pânico Detalhado -->
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

          <!-- Cofre Fiscal Virtual -->
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
        </section>

        <!-- 5. Gestão de Faturas & Recebíveis -->
        <section class="glass-card p-6 border-white/10">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-xl font-bold text-white font-['Outfit']">Faturas & Recebíveis</h3>
              <span class="text-xs text-slate-400">Esteira autônoma de cobrança e conciliação bancária</span>
            </div>
            <button (click)="isCreateInvoiceOpen.set(true)" class="btn-primary text-xs">
              + Emitir Fatura
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
              <thead class="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th class="py-3 px-4">Identificador</th>
                  <th class="py-3 px-4">Cliente</th>
                  <th class="py-3 px-4">Valor Bruto</th>
                  <th class="py-3 px-4">Split Fiscal</th>
                  <th class="py-3 px-4">Valor Líquido</th>
                  <th class="py-3 px-4">Vencimento</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (inv of financeService.invoices(); track inv.id) {
                  <tr class="hover:bg-slate-900/40 transition-colors">
                    <td class="py-3 px-4 font-bold text-white">{{ inv.id }}</td>
                    <td class="py-3 px-4">
                      <span class="font-sans font-semibold text-slate-200 block">{{ inv.clientName }}</span>
                      <span class="text-[10px] text-slate-500">{{ inv.clientTaxId }}</span>
                    </td>
                    <td class="py-3 px-4 font-bold text-slate-200">R$ {{ inv.grossAmount | number:'1.2-2' }}</td>
                    <td class="py-3 px-4 text-amber-400">R$ {{ inv.taxAmount | number:'1.2-2' }}</td>
                    <td class="py-3 px-4 text-emerald-400 font-bold">R$ {{ inv.netAmount | number:'1.2-2' }}</td>
                    <td class="py-3 px-4 text-slate-400">{{ inv.dueDate }}</td>
                    <td class="py-3 px-4">
                      @if (inv.status === 'PAID') {
                        <span class="badge badge-emerald">LIQUIDADA</span>
                      } @else if (inv.status === 'OVERDUE') {
                        <span class="badge badge-rose">EM ATRASO</span>
                      } @else if (inv.status === 'ISSUED' || inv.status === 'PENDING') {
                        <span class="badge badge-cyan">EMITIDA</span>
                      } @else {
                        <span class="badge badge-slate">RASCUNHO</span>
                      }
                    </td>
                    <td class="py-3 px-4 text-right">
                      @if (inv.status !== 'PAID') {
                        <button
                          (click)="financeService.settleInvoice(inv.id)"
                          class="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded text-xs cursor-pointer font-sans transition-all">
                          Liquidar
                        </button>
                      } @else {
                        <span class="text-slate-500 text-[11px]">✓ Conciliada</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <!-- 6. Livro Razão Contábil (Core Fact Ledger) -->
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

      </main>

      <!-- Modal: Nova Fatura -->
      @if (isCreateInvoiceOpen()) {
        <div class="modal-overlay">
          <div class="modal-container p-6">
            <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h4 class="text-lg font-bold text-white font-['Outfit']">Emitir Nova Fatura</h4>
              <button (click)="isCreateInvoiceOpen.set(false)" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Nome do Cliente ou Razão Social</label>
                <input type="text" [(ngModel)]="newInvoiceForm.clientName" class="form-input" placeholder="Ex: Acme Software Corp" />
              </div>
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">CNPJ / CPF do Cliente</label>
                <input type="text" [(ngModel)]="newInvoiceForm.clientTaxId" class="form-input" placeholder="00.000.000/0001-00" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1">Valor Bruto (R$)</label>
                  <input type="number" [(ngModel)]="newInvoiceForm.grossAmount" class="form-input" placeholder="15000" />
                </div>
                <div>
                  <label class="block text-xs font-mono text-slate-400 mb-1">Alíquota (%)</label>
                  <input type="number" [(ngModel)]="newInvoiceForm.taxRatePercent" class="form-input" placeholder="6" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Data de Vencimento</label>
                <input type="date" [(ngModel)]="newInvoiceForm.dueDate" class="form-input" />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
              <button (click)="isCreateInvoiceOpen.set(false)" class="btn-secondary text-xs">Cancelar</button>
              <button (click)="submitCreateInvoice()" class="btn-primary text-xs">Emitir e Iniciar Régua</button>
            </div>
          </div>
        </div>
      }

      <!-- Modal: Nova Despesa (OPEX) -->
      @if (isCreateExpenseOpen()) {
        <div class="modal-overlay">
          <div class="modal-container p-6">
            <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h4 class="text-lg font-bold text-white font-['Outfit']">Lançar Despesa Operacional</h4>
              <button (click)="isCreateExpenseOpen.set(false)" class="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Descrição</label>
                <input type="text" [(ngModel)]="newExpenseForm.description" class="form-input" placeholder="Ex: Servidores Cloud AWS" />
              </div>
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Categoria</label>
                <select [(ngModel)]="newExpenseForm.category" class="form-input">
                  <option value="Software">Software & Ferramentas</option>
                  <option value="Hospedagem">Infraestrutura & Nuvem</option>
                  <option value="Contabilidade">Contabilidade & Jurídico</option>
                  <option value="Equipamento">Hardware & Equipamentos</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Valor (R$)</label>
                <input type="number" [(ngModel)]="newExpenseForm.amount" class="form-input" placeholder="850.00" />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
              <button (click)="isCreateExpenseOpen.set(false)" class="btn-secondary text-xs">Cancelar</button>
              <button (click)="submitCreateExpense()" class="btn-primary text-xs">Lançar no Ledger</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
})
export class DashboardPageComponent {
  public financeService = inject(FinanceService);
  public authService = inject(AuthService);
  private toast = inject(ToastService);

  // Controle de Modais
  public isCreateInvoiceOpen = signal<boolean>(false);
  public isCreateExpenseOpen = signal<boolean>(false);

  public newInvoiceForm = {
    clientName: '',
    clientTaxId: '',
    grossAmount: 12000,
    taxRatePercent: 6,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  };

  public newExpenseForm = {
    description: '',
    category: 'Software',
    amount: 500,
  };

  public submitCreateInvoice(): void {
    if (!this.newInvoiceForm.clientName) {
      this.toast.show('Informe o nome do cliente.', 'alert');
      return;
    }
    this.financeService.createInvoice({
      clientName: this.newInvoiceForm.clientName,
      clientTaxId: this.newInvoiceForm.clientTaxId || '00.000.000/0001-00',
      grossAmount: Number(this.newInvoiceForm.grossAmount),
      taxRatePercent: Number(this.newInvoiceForm.taxRatePercent),
      dueDate: this.newInvoiceForm.dueDate,
    });
    this.isCreateInvoiceOpen.set(false);
  }

  public submitCreateExpense(): void {
    if (!this.newExpenseForm.description || this.newExpenseForm.amount <= 0) {
      this.toast.show('Informe a descrição e o valor da despesa.', 'alert');
      return;
    }
    this.financeService.createExpense(
      Number(this.newExpenseForm.amount),
      this.newExpenseForm.description,
      this.newExpenseForm.category
    );
    this.isCreateExpenseOpen.set(false);
  }
}
