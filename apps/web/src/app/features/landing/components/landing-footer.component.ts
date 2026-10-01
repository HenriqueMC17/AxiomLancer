import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="py-12 px-4 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 AxiomLancer FinTech Core. Iniciativa 7Keys Engineering.</span>
        <span>Conformidade estrita LGPD & BACEN PIX Dinâmico.</span>
      </div>
    </footer>
  `,
})
export class LandingFooterComponent {}
