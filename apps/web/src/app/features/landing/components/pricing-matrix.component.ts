import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing-matrix',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section id="pricing" class="pricing-section-wrap">
      <div class="section-header">
        <span class="badge badge-emerald mb-3">PLANOS JUSTOS</span>
        <h2 class="section-title">Investimento que se paga na primeira fatura</h2>
        <p class="section-desc">Sem taxas escondidas ou percentuais predatórios sobre seu faturamento bruto.</p>
      </div>

      <div class="pricing-cards-grid">
        <!-- Plano 1: Freelancer Pro (Destaque) -->
        <div class="glass-card pricing-card card-pro">
          <div class="popular-badge-wrap">
            <span class="badge badge-emerald">MAIS POPULAR</span>
          </div>

          <div class="plan-header">
            <h3 class="plan-name">Freelancer Pro</h3>
            <p class="plan-target">Para desenvolvedores e designers autônomos</p>
          </div>

          <div class="price-row">
            <span class="currency-symbol">R$</span>
            <span class="price-amount font-mono">49,90</span>
            <span class="price-period">/mês</span>
          </div>

          <ul class="features-list">
            <li class="feature-item">
              <span class="check-icon icon-mint">✓</span>
              <span>Faturamento ilimitado com PIX e Boleto</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-mint">✓</span>
              <span>Régua de cobrança preditiva multicanal</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-mint">✓</span>
              <span>Botão de pânico Safe Mode (12ms)</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-mint">✓</span>
              <span>Split tributário automático no cofre</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-mint">✓</span>
              <span>Livro Razão de partidas dobradas</span>
            </li>
          </ul>

          <div class="card-action-wrap">
            <a routerLink="/dashboard" class="btn-mint w-full text-center">
              <span>Experimentar 14 Dias Grátis</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <!-- Plano 2: Microagência -->
        <div class="glass-card pricing-card card-agency">
          <div class="plan-header">
            <h3 class="plan-name">Microagência</h3>
            <p class="plan-target">Para estúdios e times de 2 a 10 pessoas</p>
          </div>

          <div class="price-row">
            <span class="currency-symbol">R$</span>
            <span class="price-amount font-mono">149,90</span>
            <span class="price-period">/mês</span>
          </div>

          <ul class="features-list">
            <li class="feature-item">
              <span class="check-icon icon-blue">✓</span>
              <span>Tudo do plano Freelancer Pro</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-blue">✓</span>
              <span>Múltiplos membros de equipe com RBAC</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-blue">✓</span>
              <span>Gestão de contratos em lote</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-blue">✓</span>
              <span>Domínio e e-mail com marca própria</span>
            </li>
            <li class="feature-item">
              <span class="check-icon icon-blue">✓</span>
              <span>Suporte prioritário via WhatsApp</span>
            </li>
          </ul>

          <div class="card-action-wrap">
            <a routerLink="/dashboard" class="btn-royal-outline w-full text-center">
              <span>Falar com Consultor</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #121212;
      padding: 5rem 1.5rem;
    }

    .pricing-section-wrap {
      max-width: 960px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3.5rem;
    }

    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 2.25rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin: 0.5rem 0 0.5rem 0;
    }

    .section-desc {
      font-size: 0.95rem;
      color: #94a3b8;
    }

    /* Cards Grid */
    .pricing-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: stretch;
    }

    @media (min-width: 768px) {
      .pricing-cards-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .pricing-card {
      position: relative;
      padding: 2.5rem 2rem;
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 1.15rem;
      transition: all 0.2s ease;
    }

    .pricing-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
    }

    .card-pro {
      border-color: rgba(16, 185, 129, 0.35);
      background: linear-gradient(180deg, #18191e 0%, #15161b 100%);
      box-shadow: 0 8px 30px rgba(16, 185, 129, 0.08);
    }

    .popular-badge-wrap {
      position: absolute;
      top: -12px;
      right: 24px;
    }

    .plan-header {
      margin-bottom: 1.5rem;
    }

    .plan-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.35rem 0;
    }

    .plan-target {
      font-size: 0.85rem;
      color: #94a3b8;
      margin: 0;
    }

    /* Price Row */
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 1.75rem;
    }

    .currency-symbol {
      font-size: 1.25rem;
      font-weight: 700;
      color: #cbd5e1;
    }

    .price-amount {
      font-size: 2.75rem;
      font-weight: 900;
      color: #ffffff;
      line-height: 1;
    }

    .price-period {
      font-size: 0.9rem;
      color: #94a3b8;
    }

    /* Feature List */
    .features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #cbd5e1;
      line-height: 1.4;
    }

    .check-icon {
      font-weight: bold;
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .icon-mint { color: #34d399; }
    .icon-blue { color: #60a5fa; }

    /* Action Wrap */
    .card-action-wrap {
      margin-top: auto;
    }

    .card-action-wrap a {
      width: 100%;
      box-sizing: border-box;
    }
  `],
})
export class PricingMatrixComponent {}
