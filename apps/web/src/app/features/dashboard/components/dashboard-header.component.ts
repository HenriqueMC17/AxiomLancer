import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
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
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs font-mono text-slate-300 font-semibold">
                {{ authService.currentUser()?.name || 'Freelancer Pro' }}
              </span>
              <span class="text-[10px] font-mono text-slate-500">
                ({{ authService.currentUser()?.email || 'freelancer.pro@axiomlancer.dev' }})
              </span>
              @if (authService.currentUser()?.taxId) {
                <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  DOC: {{ authService.currentUser()?.taxId }}
                </span>
              }
            </div>
          </div>
        </div>

        <!-- Ações Rápidas, Botão de Pânico & Logout -->
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
            (click)="openCreateInvoice.emit()"
            class="btn-primary text-xs py-2 px-4 rounded-lg">
            <span>+ Nova Fatura</span>
          </button>

          <!-- Nova Despesa -->
          <button
            (click)="openCreateExpense.emit()"
            class="btn-secondary text-xs py-2 px-3 rounded-lg">
            <span>- Despesa (OPEX)</span>
          </button>

          <!-- Sair / Logout -->
          <button
            (click)="handleLogout()"
            title="Encerrar Sessão"
            class="text-xs font-mono text-slate-400 hover:text-rose-400 py-2 px-3 rounded-lg border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer">
            <span>Sair ⎋</span>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class DashboardHeaderComponent {
  public authService = inject(AuthService);
  public financeService = inject(FinanceService);
  private router = inject(Router);

  @Output() openCreateInvoice = new EventEmitter<void>();
  @Output() openCreateExpense = new EventEmitter<void>();

  public async handleLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}

