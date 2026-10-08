import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="landing-footer">
      <div class="footer-inner">
        <span>© 2026 AxiomLancer FinTech Core. Iniciativa 7Keys Engineering.</span>
        <span>Conformidade estrita LGPD &amp; BACEN PIX Dinâmico.</span>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #0e0f12;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .landing-footer {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #64748b;
    }

    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      text-align: center;
    }

    @media (min-width: 640px) {
      .footer-inner {
        flex-direction: row;
        text-align: left;
      }
    }
  `],
})
export class LandingFooterComponent {}
