import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 border-y border-white/10 bg-slate-950/40">
      <div class="max-w-7xl mx-auto px-4">
        <p class="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
          Confiado por desenvolvedores, designers e donos de agências independentes
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="glass-card p-6">
            <span class="text-3xl lg:text-4xl font-black text-emerald-400 font-mono block mb-1">-82%</span>
            <span class="text-xs text-slate-300 font-medium">Tempo perdido cobrando clientes manualmente</span>
          </div>
          <div class="glass-card p-6">
            <span class="text-3xl lg:text-4xl font-black text-cyan-400 font-mono block mb-1">12ms</span>
            <span class="text-xs text-slate-300 font-medium">Tempo de resposta para congelar réguas no Safe Mode</span>
          </div>
          <div class="glass-card p-6">
            <span class="text-3xl lg:text-4xl font-black text-amber-400 font-mono block mb-1">100%</span>
            <span class="text-xs text-slate-300 font-medium">Split de impostos provisionado no ato do PIX</span>
          </div>
          <div class="glass-card p-6">
            <span class="text-3xl lg:text-4xl font-black text-purple-400 font-mono block mb-1">R$ 1.4M+</span>
            <span class="text-xs text-slate-300 font-medium">Processados sob livro razão de partidas dobradas</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SocialProofComponent {}
