import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-proof',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 4. Seção Inferior (Depoimentos e Destaques) -->
    <section class="bottom-section-container">
      <div class="bottom-grid-wrapper">
        <!-- Coluna 1: Depoimentos Minimalistas -->
        <div class="column-testimonials">
          <div class="section-title-wrap">
            <span class="column-badge-tag">FEEDBACK DE QUEM PRODUZ</span>
            <h2 class="column-heading">
              CONFIADO POR DESENVOLVEDORES, DESIGNERS E DONOS DE AGÊNCIAS INDEPENDENTES
            </h2>
          </div>

          <div class="testimonials-stack">
            <!-- Card 1: Rafael -->
            <div class="testimonial-card">
              <div class="testimonial-user-row">
                <div class="avatar-circle avatar-rafael">
                  <span>R</span>
                </div>
                <div class="user-meta">
                  <span class="user-name">Rafael</span>
                  <span class="user-role">Fundador, Microagência</span>
                </div>
                <div class="stars-subtle">★★★★★</div>
              </div>
              <p class="testimonial-quote">
                "Eliminou o desgaste de cobrar clientes no WhatsApp. O dinheiro entra via PIX, o imposto vai direto pro cofre e o fluxo de caixa nunca mais furou."
              </p>
            </div>

            <!-- Card 2: Mariana -->
            <div class="testimonial-card">
              <div class="testimonial-user-row">
                <div class="avatar-circle avatar-mariana">
                  <span>M</span>
                </div>
                <div class="user-meta">
                  <span class="user-name">Mariana Dias</span>
                  <span class="user-role">Lead Product Designer</span>
                </div>
                <div class="stars-subtle">★★★★★</div>
              </div>
              <p class="testimonial-quote">
                "Interface limpa, sem estresse cognitivo. Saber exatamente o que está retido e ter as réguas rodando sozinhas me deu foco total nas entregas de design."
              </p>
            </div>

            <!-- Card 3: Lucas -->
            <div class="testimonial-card">
              <div class="testimonial-user-row">
                <div class="avatar-circle avatar-lucas">
                  <span>L</span>
                </div>
                <div class="user-meta">
                  <span class="user-name">Lucas Prado</span>
                  <span class="user-role">Software Studio Owner</span>
                </div>
                <div class="stars-subtle">★★★★★</div>
              </div>
              <p class="testimonial-quote">
                "O Safe Mode em 12ms é um salva-vidas real. Pausar réguas atômicas durante alterações de escopo sem gerar constrangimento com o cliente é impagável."
              </p>
            </div>
          </div>
        </div>

        <!-- Coluna 2: Como Resolve e Tech -->
        <div class="column-solutions-tech">
          <!-- Bloco Superior: Como o AxiomLancer Resolve -->
          <div class="solutions-block">
            <div class="section-title-wrap">
              <span class="column-badge-tag tag-blue">IMPACTO COMPROVADO</span>
              <h2 class="column-heading">
                COMO O AXIOM Lancer RESOLVE A SUA REALIDADE
              </h2>
            </div>

            <div class="metric-highlights-list">
              <div class="metric-highlight-item">
                <div class="highlight-icon-box bolt-box">
                  <span>⚡</span>
                </div>
                <div class="highlight-text-content">
                  <span class="highlight-stat text-mint">-82%</span>
                  <span class="highlight-desc">Tempo perdido cobrando clientes.</span>
                </div>
              </div>

              <div class="metric-highlight-item">
                <div class="highlight-icon-box snowflake-box">
                  <span>❄️</span>
                </div>
                <div class="highlight-text-content">
                  <span class="highlight-stat text-blue">12ms</span>
                  <span class="highlight-desc">Resposta para congelar réguas no Safe Mode.</span>
                </div>
              </div>

              <div class="metric-highlight-item">
                <div class="highlight-icon-box card-box">
                  <span>💳</span>
                </div>
                <div class="highlight-text-content">
                  <span class="highlight-stat text-mint">100%</span>
                  <span class="highlight-desc">Split de impostos provisionado no ato do PIX.</span>
                </div>
              </div>

              <div class="metric-highlight-item">
                <div class="highlight-icon-box money-box">
                  <span>💰</span>
                </div>
                <div class="highlight-text-content">
                  <span class="highlight-stat text-amber">R$ 1.4M+</span>
                  <span class="highlight-desc">Processados sob livro razão de partidas dobradas.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bloco Inferior: Tech Stack Infraestrutura -->
          <div class="tech-infra-block">
            <h3 class="infra-heading">
              DESENVOLVIDO COMO INFRAESTRUTURA DE MISSÃO CRÍTICA
            </h3>

            <div class="tech-card-container">
              <div class="tech-card-header">
                <div class="tech-status-dot"></div>
                <span class="tech-header-label">ENTERPRISE STACK SPECS</span>
              </div>

              <div class="tech-badges-grid">
                <div class="tech-badge">
                  <span class="tech-badge-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </span>
                  <span>Clean Architecture</span>
                </div>

                <div class="tech-badge">
                  <span class="tech-badge-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 9h18"/>
                      <path d="M9 21V9"/>
                    </svg>
                  </span>
                  <span>DDD</span>
                </div>

                <div class="tech-badge">
                  <span class="tech-badge-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <span>Tenant Isolation</span>
                </div>

                <div class="tech-badge">
                  <span class="tech-badge-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  </span>
                  <span>PostgreSQL</span>
                </div>

                <div class="tech-badge">
                  <span class="tech-badge-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    </svg>
                  </span>
                  <span>Convex Cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* =========================================================================
       SECTION 4: TESTIMONIALS & TECH HIGHLIGHTS - AXIOMLANCER 2.0
       ========================================================================= */

    :host {
      display: block;
      background-color: #121212;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .bottom-section-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
    }

    .bottom-grid-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3.5rem;
    }

    @media (min-width: 1024px) {
      .bottom-grid-wrapper {
        grid-template-columns: 1.1fr 1fr;
        gap: 4rem;
      }
    }

    /* Títulos e Headers */
    .section-title-wrap {
      margin-bottom: 2rem;
    }

    .column-badge-tag {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      letter-spacing: 0.04em;
      margin-bottom: 0.85rem;
    }

    .tag-blue {
      color: #60a5fa;
      background: rgba(37, 99, 235, 0.08);
      border-color: rgba(37, 99, 235, 0.25);
    }

    .column-heading {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.35;
      color: #ffffff;
      letter-spacing: -0.015em;
      text-transform: uppercase;
      margin: 0;
    }

    @media (min-width: 768px) {
      .column-heading {
        font-size: 1.45rem;
      }
    }

    /* Coluna 1: Depoimentos */
    .testimonials-stack {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .testimonial-card {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.85rem;
      padding: 1.4rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }

    .testimonial-card:hover {
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .testimonial-user-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 0.85rem;
    }

    .avatar-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      flex-shrink: 0;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
    }

    .avatar-rafael {
      background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
      color: #ffffff;
    }

    .avatar-mariana {
      background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
      color: #ffffff;
    }

    .avatar-lucas {
      background: linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%);
      color: #ffffff;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex-grow: 1;
    }

    .user-name {
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
    }

    .user-role {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .stars-subtle {
      font-size: 0.75rem;
      color: #fbbf24;
      letter-spacing: 0.1em;
    }

    .testimonial-quote {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      line-height: 1.55;
      color: #cbd5e1;
      margin: 0;
    }

    /* Coluna 2: Como Resolve */
    .column-solutions-tech {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .metric-highlights-list {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .metric-highlight-item {
      display: flex;
      align-items: center;
      gap: 1.1rem;
      padding: 0.95rem 1.15rem;
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      transition: all 0.15s ease;
    }

    .metric-highlight-item:hover {
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateX(4px);
    }

    .highlight-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .highlight-text-content {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .highlight-stat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .text-mint { color: #34d399; }
    .text-blue { color: #60a5fa; }
    .text-amber { color: #fbbf24; }

    .highlight-desc {
      font-size: 0.825rem;
      color: #94a3b8;
      font-weight: 400;
    }

    /* Bloco Inferior: Tech Stack */
    .tech-infra-block {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .infra-heading {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.95rem;
      font-weight: 800;
      color: #e2e8f0;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin: 0;
    }

    .tech-card-container {
      background: #18191e;
      border: 1px solid rgba(37, 99, 235, 0.3);
      border-radius: 0.85rem;
      padding: 1.25rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }

    .tech-card-header {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .tech-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #60a5fa;
      box-shadow: 0 0 6px #60a5fa;
    }

    .tech-header-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 700;
      color: #93c5fd;
      letter-spacing: 0.05em;
    }

    .tech-badges-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 600;
      color: #e2e8f0;
      transition: all 0.15s ease;
    }

    .tech-badge:hover {
      background: rgba(37, 99, 235, 0.12);
      border-color: rgba(96, 165, 250, 0.5);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .tech-badge-icon {
      display: flex;
      align-items: center;
      color: #60a5fa;
    }
  `],
})
export class SocialProofComponent {}
