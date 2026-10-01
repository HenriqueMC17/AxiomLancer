import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing-matrix',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section id="pricing" class="py-20 px-4 max-w-5xl mx-auto">
      <div class="text-center mb-16">
        <span class="badge badge-emerald mb-3">PLANOS JUSTOS</span>
        <h2 class="text-3xl sm:text-4xl font-bold font-['Outfit'] text-white mb-4">Investimento que se paga na primeira fatura</h2>
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <!-- Plano Pro -->
        <div class="glass-card p-8 border-emerald-500/40 relative">
          <div class="absolute -top-3 right-6">
            <span class="badge badge-emerald">MAIS POPULAR</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-1">Freelancer Pro</h3>
          <p class="text-xs text-slate-400 mb-6">Para desenvolvedores e designers autônomos</p>
          <div class="mb-6">
            <span class="text-4xl font-extrabold text-white font-mono">R$ 49,90</span>
            <span class="text-slate-400 text-sm">/mês</span>
          </div>
          <ul class="text-sm text-slate-300 space-y-3 mb-8">
            <li class="flex items-center gap-2">✓ Faturamento ilimitado com PIX e Boleto</li>
            <li class="flex items-center gap-2">✓ Régua de cobrança preditiva multicanal</li>
            <li class="flex items-center gap-2">✓ Botão de pânico Safe Mode (12ms)</li>
            <li class="flex items-center gap-2">✓ Split tributário automático no cofre</li>
            <li class="flex items-center gap-2">✓ Livro Razão de partidas dobradas</li>
          </ul>
          <a routerLink="/dashboard" class="btn-primary w-full py-3">Experimentar 14 Dias Grátis</a>
        </div>

        <!-- Plano Agência -->
        <div class="glass-card p-8 border-white/10">
          <h3 class="text-2xl font-bold text-white mb-1">Microagência</h3>
          <p class="text-xs text-slate-400 mb-6">Para estúdios e times de 2 a 10 pessoas</p>
          <div class="mb-6">
            <span class="text-4xl font-extrabold text-white font-mono">R$ 149,90</span>
            <span class="text-slate-400 text-sm">/mês</span>
          </div>
          <ul class="text-sm text-slate-300 space-y-3 mb-8">
            <li class="flex items-center gap-2">✓ Tudo do plano Freelancer Pro</li>
            <li class="flex items-center gap-2">✓ Múltiplos membros de equipe com RBAC</li>
            <li class="flex items-center gap-2">✓ Gestão de contratos em lote</li>
            <li class="flex items-center gap-2">✓ Domínio e e-mail com marca própria</li>
            <li class="flex items-center gap-2">✓ Suporte prioritário via WhatsApp</li>
          </ul>
          <a routerLink="/dashboard" class="btn-secondary w-full py-3">Falar com Consultor</a>
        </div>
      </div>
    </section>
  `,
})
export class PricingMatrixComponent {}
