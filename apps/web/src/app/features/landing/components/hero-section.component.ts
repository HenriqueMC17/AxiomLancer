import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Announcement Banner -->
    <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-500/20 px-4 py-2 text-center text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>AxiomLancer 2.0: Motor de Execução Financeira Autônoma ativo com Suporte ao BACEN PIX & BFF Seguro</span>
    </div>

    <!-- Navigation Bar -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-[#07090e]/85 border-b border-white/10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-3 text-decoration-none">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span class="text-xl font-black text-black">⚡</span>
          </div>
          <div>
            <span class="font-bold text-lg text-white font-['Outfit'] tracking-tight">Axiom<span class="text-emerald-400">Lancer</span></span>
            <span class="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Financial Core</span>
          </div>
        </a>

        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#features" class="hover:text-emerald-400 transition-colors">Funcionalidades</a>
          <a href="#roi" class="hover:text-emerald-400 transition-colors">Calculadora ROI</a>
          <a href="#panic" class="hover:text-emerald-400 transition-colors">Botão de Pânico</a>
          <a href="#pricing" class="hover:text-emerald-400 transition-colors">Preços</a>
        </nav>

        <div class="flex items-center gap-3">
          @if (authService.isAuthenticated()) {
            <a routerLink="/dashboard" class="btn-primary text-xs">
              <span>Painel Executivo</span>
              <span>→</span>
            </a>
          } @else {
            <a routerLink="/login" class="btn-secondary text-xs">Entrar</a>
            <a routerLink="/dashboard" class="btn-primary text-xs">Acessar Demonstração</a>
          }
        </div>
      </div>
    </header>

    <!-- Hero Section com Headline de Alta Conversão -->
    <section class="relative pt-20 pb-28 px-4 overflow-hidden">
      <!-- Background Ambient Glows -->
      <div class="ambient-glow-emerald -top-20 -left-20"></div>
      <div class="ambient-glow-cyan top-40 -right-20"></div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-8">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>EXECUÇÃO FINANCEIRA ATIVA PARA QUEM ODEIA COBRAR CLIENTES</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-['Outfit'] tracking-tight leading-[1.1] mb-6">
          Transforme código e design em <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">dinheiro na conta</span>, sem constrangimento.
        </h1>

        <p class="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          O AxiomLancer substitui planilhas passivas por uma <strong class="text-white font-semibold">esteira autônoma de liquidação</strong>: régua preditiva multicanal (WhatsApp/PIX/Email), split fiscal instantâneo em cofre virtual e botão de pânico com resposta em 12ms.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a routerLink="/dashboard" class="btn-primary text-base px-8 py-3.5 w-full sm:w-auto shadow-xl shadow-emerald-500/25">
            <span>Iniciar Automação Agora</span>
            <span>⚡</span>
          </a>
          <a href="#panic" class="btn-secondary text-base px-6 py-3.5 w-full sm:w-auto">
            <span>Testar Botão de Pânico (12ms)</span>
          </a>
        </div>

        <!-- Telemetria HUD Flutuante no Hero -->
        <div class="glass-card p-6 border-white/10 max-w-3xl mx-auto shadow-2xl relative">
          <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4 text-xs font-mono">
            <span class="flex items-center gap-2 text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              TELEMETRIA DO MOTOR FINANCEIRO EM TEMPO REAL
            </span>
            <span class="text-slate-400">LATÊNCIA: 12ms | SLA: 99.98%</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Receita Liquidada</span>
              <span class="text-lg font-bold text-emerald-400 font-mono">R$ 48.750,00</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">A Receber</span>
              <span class="text-lg font-bold text-cyan-400 font-mono">R$ 24.320,00</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Cofre Fiscal (6%)</span>
              <span class="text-lg font-bold text-amber-400 font-mono">R$ 3.864,20</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Health Score</span>
              <span class="text-lg font-bold text-emerald-400 font-mono">98.4 / 100</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  public authService = inject(AuthService);
}
