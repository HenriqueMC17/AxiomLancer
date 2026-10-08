import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- 1. Header Profissional -->
    <header class="axiom-header">
      <div class="header-inner">
        <!-- Lado Esquerdo: Logo & Nome -->
        <a routerLink="/" class="brand-group">
          <div class="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#brand-grad-1)"/>
              <path d="M2 17L12 22L22 17" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="brand-grad-1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#10b981"/>
                  <stop offset="1" stop-color="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="brand-text-block">
            <span class="brand-name">AxiomLancer</span>
            <span class="brand-version">2.0</span>
          </div>
        </a>

        <!-- Centro: Barra de Status em Verde-Claro com Escudo Sutil -->
        <div class="status-center-pill">
          <span class="shield-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </span>
          <span class="status-text">EXECUÇÃO FINANCEIRA ATIVA. SUPORTE AO BACEN PIX &amp; BFF SEGURO</span>
          <span class="pulse-indicator"></span>
        </div>

        <!-- Lado Direito: Links de Navegação e Botões Profissionais -->
        <div class="nav-right-actions">
          <nav class="nav-links">
            <a href="#features" class="nav-link-item">Funcionalidades</a>
            <a href="#roi" class="nav-link-item">Calculadora ROI</a>
            <a href="#panic" class="nav-link-item">Botão de Pânico</a>
            <a href="#pricing" class="nav-link-item">Preços</a>
          </nav>

          <div class="cta-buttons-header">
            @if (authService.isAuthenticated()) {
              <a routerLink="/dashboard" class="btn-mint-header">
                <span>Painel Executivo</span>
                <span>→</span>
              </a>
            } @else {
              <a routerLink="/login" class="btn-outline-header">Entrar</a>
              <a routerLink="/dashboard" class="btn-mint-header">Acessar Demonstração</a>
            }
          </div>
        </div>
      </div>
    </header>

    <!-- 2. Hero Section (Destaque Principal) -->
    <section class="hero-main-container">
      <!-- Glows de ambientação sutis e discretos (sem neon agressivo) -->
      <div class="ambient-glow glow-left"></div>
      <div class="ambient-glow glow-right"></div>

      <div class="hero-content-wrapper">
        <!-- Título Grande e Negrito -->
        <h1 class="hero-headline">
          Transforme código e design em dinheiro na conta, sem constrangimento.
        </h1>

        <!-- Subtítulo organizado -->
        <p class="hero-subheadline">
          O AxiomLancer substitui planilhas passivas por uma esteira autônoma de liquidação: régua preditiva, split fiscal instantâneo e botão de pânico com resposta em 12ms.
        </p>

        <!-- Botões de Ação Sleek -->
        <div class="hero-action-buttons">
          <a routerLink="/dashboard" class="btn-hero-mint">
            <span>Iniciar Automação Agora</span>
            <span class="icon-bolt">⚡</span>
          </a>
          <button (click)="triggerPanicSimulation()" class="btn-hero-royal-outline">
            <span>Testar Botão de Pânico (12ms)</span>
          </button>
        </div>

        <!-- 3. Seção de Telemetria e Resumo (Cards) -->
        <div class="telemetry-summary-grid">
          <!-- Card 1 - Motor Financeiro -->
          <div class="card-telemetry">
            <div class="card-header-row">
              <div class="card-title-group">
                <span class="telemetry-badge-dot"></span>
                <h3 class="card-title">MOTOR FINANCEIRO TELEMETRIA</h3>
              </div>
              <span class="telemetry-live-pill">LIVE CORE</span>
            </div>

            <div class="telemetry-metrics-body">
              <div class="metric-block">
                <div class="metric-icon-wrap clock-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="metric-details">
                  <span class="metric-label">TEMPO DE RESPOSTA</span>
                  <span class="metric-value value-mint">LATÊNCIA: 12ms</span>
                </div>
              </div>

              <div class="metric-block">
                <div class="metric-icon-wrap shield-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div class="metric-details">
                  <span class="metric-label">DISPONIBILIDADE DO COFRE</span>
                  <span class="metric-value value-royal">SLA: 99.98%</span>
                </div>
              </div>
            </div>

            <div class="telemetry-card-footer">
              <span class="footer-note">Liquidação atômica e conciliação em nível de ledger distribuído.</span>
            </div>
          </div>

          <!-- Card 2 - Resumo Financeiro -->
          <div class="card-summary">
            <div class="card-header-row">
              <h3 class="card-title">RESUMO FINANCEIRO</h3>
              <div class="health-score-badge">
                <span class="heart-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </span>
                <span class="health-text">Health Score: 98.4 / 100</span>
              </div>
            </div>

            <div class="summary-tabulated-list">
              <div class="tabulated-row">
                <div class="row-label-group">
                  <span class="row-indicator ind-liquid"></span>
                  <span class="row-label">Receita Líquida</span>
                </div>
                <span class="row-value value-mint font-mono">R$ 48.750,00</span>
              </div>

              <div class="tabulated-row">
                <div class="row-label-group">
                  <span class="row-indicator ind-receivable"></span>
                  <span class="row-label">A Receber</span>
                </div>
                <span class="row-value value-royal font-mono">R$ 24.320,00</span>
              </div>

              <div class="tabulated-row">
                <div class="row-label-group">
                  <span class="row-indicator ind-tax"></span>
                  <span class="row-label">Cofre Fiscal (6%)</span>
                </div>
                <span class="row-value value-amber font-mono">R$ 3.864,20</span>
              </div>
            </div>

            <div class="summary-card-footer">
              <span class="footer-note">Cálculo de alíquota Simples Nacional retido automaticamente.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* =========================================================================
       HERO & HEADER COMPONENT STYLES - AXIOMLANCER 2.0 (HIGH FIDELITY)
       ========================================================================= */

    :host {
      display: block;
      background-color: #121212;
      color: #f1f5f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* 1. Header Profissional */
    .axiom-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: rgba(18, 18, 18, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.85rem 1.5rem;
    }

    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
    }

    /* Lado Esquerdo */
    .brand-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      flex-shrink: 0;
    }

    .brand-logo-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .brand-text-block {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }

    .brand-name {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      color: #ffffff;
    }

    .brand-version {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      color: #ffffff;
      opacity: 0.9;
    }

    /* Centro: Barra de Status */
    .status-center-pill {
      display: none;
      align-items: center;
      gap: 0.55rem;
      padding: 0.4rem 0.95rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      white-space: nowrap;
    }

    @media (min-width: 960px) {
      .status-center-pill {
        display: inline-flex;
      }
    }

    .shield-icon {
      display: flex;
      align-items: center;
      color: #34d399;
    }

    .pulse-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #34d399;
      box-shadow: 0 0 8px #34d399;
      animation: pulseDot 2s infinite ease-in-out;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 0.5; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* Lado Direito */
    .nav-right-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-shrink: 0;
    }

    .nav-links {
      display: none;
      align-items: center;
      gap: 1.25rem;
    }

    @media (min-width: 1100px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-link-item {
      font-size: 0.85rem;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .nav-link-item:hover {
      color: #34d399;
    }

    .cta-buttons-header {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .btn-outline-header {
      padding: 0.45rem 1rem;
      font-size: 0.825rem;
      font-weight: 600;
      border-radius: 0.5rem;
      background: transparent;
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.22);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-outline-header:hover {
      border-color: #ffffff;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
    }

    .btn-mint-header {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.48rem 1.15rem;
      font-size: 0.825rem;
      font-weight: 700;
      border-radius: 0.5rem;
      background: #10b981;
      color: #064e3b;
      border: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.25);
      transition: all 0.15s ease;
    }

    .btn-mint-header:hover {
      background: #34d399;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    }

    /* 2. Hero Section */
    .hero-main-container {
      position: relative;
      padding: 4.5rem 1.5rem 5rem 1.5rem;
      overflow: hidden;
      background: #121212;
    }

    .ambient-glow {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      opacity: 0.45;
      z-index: 0;
    }

    .glow-left {
      top: -100px;
      left: -150px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
    }

    .glow-right {
      top: 50px;
      right: -150px;
      background: radial-gradient(circle, rgba(29, 78, 216, 0.18) 0%, transparent 70%);
    }

    .hero-content-wrapper {
      position: relative;
      z-index: 10;
      max-width: 1020px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-headline {
      font-family: 'Montserrat', sans-serif;
      font-size: 2.25rem;
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #ffffff;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    @media (min-width: 640px) {
      .hero-headline {
        font-size: 3rem;
      }
    }

    @media (min-width: 1024px) {
      .hero-headline {
        font-size: 3.6rem;
      }
    }

    .hero-subheadline {
      font-family: 'Inter', sans-serif;
      font-size: 1.05rem;
      line-height: 1.65;
      color: #cbd5e1;
      max-width: 820px;
      margin: 0 auto 2.5rem auto;
      font-weight: 400;
    }

    @media (min-width: 768px) {
      .hero-subheadline {
        font-size: 1.18rem;
      }
    }

    .hero-action-buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 3.5rem;
    }

    @media (min-width: 640px) {
      .hero-action-buttons {
        flex-direction: row;
        gap: 1.25rem;
      }
    }

    .btn-hero-mint {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.9rem 2rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 0.65rem;
      background: #10b981;
      color: #064e3b;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 20px -2px rgba(16, 185, 129, 0.4);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      width: 100%;
    }

    @media (min-width: 640px) {
      .btn-hero-mint {
        width: auto;
      }
    }

    .btn-hero-mint:hover {
      background: #34d399;
      transform: translateY(-2px);
      box-shadow: 0 8px 26px rgba(16, 185, 129, 0.5);
    }

    .btn-hero-royal-outline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.9rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.65rem;
      background: rgba(29, 78, 216, 0.08);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.5);
      cursor: pointer;
      transition: all 0.15s ease;
      width: 100%;
    }

    @media (min-width: 640px) {
      .btn-hero-royal-outline {
        width: auto;
      }
    }

    .btn-hero-royal-outline:hover {
      background: rgba(29, 78, 216, 0.2);
      border-color: #60a5fa;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
    }

    /* 3. Seção de Telemetria e Resumo (Cards) */
    .telemetry-summary-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      max-width: 940px;
      margin: 0 auto;
      text-align: left;
    }

    @media (min-width: 768px) {
      .telemetry-summary-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }

    .card-telemetry,
    .card-summary {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 1rem;
      padding: 1.75rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .card-telemetry:hover,
    .card-summary:hover {
      border-color: rgba(255, 255, 255, 0.18);
      transform: translateY(-2px);
    }

    .card-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      margin-bottom: 1.25rem;
    }

    .card-title-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .telemetry-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .card-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin: 0;
    }

    .telemetry-live-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 600;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    /* Telemetry Metrics */
    .telemetry-metrics-body {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      margin-bottom: 1.25rem;
    }

    .metric-block {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 0.75rem;
    }

    .metric-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .clock-wrap {
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .shield-wrap {
      background: rgba(37, 99, 235, 0.12);
      color: #60a5fa;
      border: 1px solid rgba(37, 99, 235, 0.25);
    }

    .metric-details {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .metric-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      font-weight: 500;
      color: #94a3b8;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .metric-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.05rem;
      font-weight: 700;
    }

    .value-mint {
      color: #34d399;
    }

    .value-royal {
      color: #60a5fa;
    }

    .value-amber {
      color: #fbbf24;
    }

    /* Summary Tabulated List */
    .health-score-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.25rem 0.65rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 9999px;
      color: #34d399;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .heart-icon {
      display: flex;
      align-items: center;
      color: #f43f5e;
    }

    .summary-tabulated-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .tabulated-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0.9rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 0.65rem;
    }

    .row-label-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .row-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .ind-liquid { background-color: #10b981; }
    .ind-receivable { background-color: #3b82f6; }
    .ind-tax { background-color: #f59e0b; }

    .row-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #cbd5e1;
    }

    .row-value {
      font-size: 0.95rem;
      font-weight: 700;
    }

    /* Card Footers */
    .telemetry-card-footer,
    .summary-card-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 0.9rem;
    }

    .footer-note {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.4;
      display: block;
    }
  `],
})
export class HeroSectionComponent {
  public authService = inject(AuthService);
  private toastService = inject(ToastService);

  public triggerPanicSimulation(): void {
    this.toastService.show(
      'Safe Mode ativado em 12ms! Réguas congeladas sem notificação ao cliente.',
      'alert',
      5000
    );
    const panicElement = document.getElementById('panic');
    if (panicElement) {
      panicElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
