import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bento-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="features" class="py-20 px-4 max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <span class="badge badge-emerald mb-3">ARQUITETURA ROBUSTA</span>
        <h2 class="text-3xl sm:text-5xl font-bold font-['Outfit'] text-white mb-4">Desenvolvido como infraestrutura de missão crítica</h2>
        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Construído sob Clean Architecture, DDD e isolamento de tenant com PostgreSQL e Convex Cloud.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Bento 1: Régua de Cobrança Preditiva -->
        <div class="glass-card p-8 md:col-span-2 relative overflow-hidden">
          <div class="ambient-glow-emerald -top-20 -right-20"></div>
          <span class="badge badge-cyan mb-4">AUTOMAÇÃO MULTICANAL</span>
          <h3 class="text-2xl font-bold text-white mb-2">Régua Preditiva com Tom de Voz Adaptativo</h3>
          <p class="text-sm text-slate-300 mb-6 leading-relaxed">
            Disparos programados antes e depois do vencimento via WhatsApp Business API, E-mail SMTP e geração automática de QR Code PIX dinâmico com expiração e conciliação bancária imediata.
          </p>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 space-y-2">
            <div class="text-emerald-400">> [WhatsApp D-3]: "Olá Felipe, tudo bem? Fatura #089 do Milestone 2 emitida com chave PIX copia-e-cola."</div>
            <div class="text-cyan-400">> [PIX BACEN D-0]: "Identificado pagamento instantâneo de R$ 18.500,00. Split de 6% retido no cofre."</div>
          </div>
        </div>

        <!-- Bento 2: Botão de Pânico Safe Mode -->
        <div class="glass-card p-8">
          <span class="badge badge-rose mb-4">CONTROLE TOTAL</span>
          <h3 class="text-2xl font-bold text-white mb-2">Botão de Pânico (12ms)</h3>
          <p class="text-sm text-slate-300 mb-4 leading-relaxed">
            Surgiu uma conversa delicada ou o cliente pediu um prazo? Congele instantaneamente todos os disparos da esteira com 1 clique.
          </p>
          <div class="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 font-mono text-xs text-center">
            Resposta garantida em 12 milissegundos
          </div>
        </div>

        <!-- Bento 3: Split Tributário no Recebimento -->
        <div class="glass-card p-8">
          <span class="badge badge-amber mb-4">BLINDAGEM FISCAL</span>
          <h3 class="text-xl font-bold text-white mb-2">Cofre Virtual Tributário</h3>
          <p class="text-sm text-slate-300 leading-relaxed">
            Nunca mais seja surpreendido pelo DAS do Simples Nacional ou MEI no dia 20. O imposto é separado na fração de segundo em que o cliente paga.
          </p>
        </div>

        <!-- Bento 4: Previsio BI & Scoring -->
        <div class="glass-card p-8 md:col-span-2">
          <span class="badge badge-emerald mb-4">FINANCIAL INTELLIGENCE</span>
          <h3 class="text-xl font-bold text-white mb-2">Score de Saúde Financeira & Previsão de Risco</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Algoritmo determinístico que calcula o risco de atraso com base no comportamento histórico de cada pagador, permitindo agir preventivamente.
          </p>
          <div class="grid grid-cols-3 gap-3 font-mono text-xs text-center">
            <div class="p-3 bg-slate-900 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px]">RISCO ATUAL</span>
              <span class="text-emerald-400 font-bold text-base">1.2%</span>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px]">HEALTH SCORE</span>
              <span class="text-cyan-400 font-bold text-base">98.4 / 100</span>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px]">PROJEÇÃO DRE</span>
              <span class="text-amber-400 font-bold text-base">R$ 58.000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BentoFeaturesComponent {}
