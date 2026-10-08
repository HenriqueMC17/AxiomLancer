import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bento-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="features" class="bento-section-wrap">
      <div class="section-header">
        <span class="badge badge-emerald mb-3">ARQUITETURA ROBUSTA</span>
        <h2 class="section-title">Desenvolvido como infraestrutura de missão crítica</h2>
        <p class="section-desc">
          Construído sob Clean Architecture, DDD e isolamento de tenant com PostgreSQL e Convex Cloud.
        </p>
      </div>

      <div class="bento-grid">
        <!-- Bento 1: Régua de Cobrança Preditiva (Grande) -->
        <div class="glass-card bento-card card-regua">
          <span class="badge badge-cyan mb-3">AUTOMAÇÃO MULTICANAL</span>
          <h3 class="card-title">Régua Preditiva com Tom de Voz Adaptativo</h3>
          <p class="card-desc">
            Disparos programados antes e depois do vencimento via WhatsApp Business API, E-mail SMTP e geração automática de QR Code PIX dinâmico com expiração e conciliação bancária imediata.
          </p>
          <div class="terminal-mockup">
            <div class="terminal-line line-emerald">
              <span class="prompt-icon">›</span>
              <span>[WhatsApp D-3]: "Olá Felipe, tudo bem? Fatura #089 do Milestone 2 emitida com chave PIX copia-e-cola."</span>
            </div>
            <div class="terminal-line line-cyan">
              <span class="prompt-icon">›</span>
              <span>[PIX BACEN D-0]: "Identificado pagamento instantâneo de R$ 18.500,00. Split de 6% retido no cofre."</span>
            </div>
          </div>
        </div>

        <!-- Bento 2: Botão de Pânico Safe Mode -->
        <div class="glass-card bento-card card-panic">
          <span class="badge badge-rose mb-3">CONTROLE TOTAL</span>
          <h3 class="card-title">Botão de Pânico (12ms)</h3>
          <p class="card-desc">
            Surgiu uma conversa delicada ou o cliente pediu um prazo? Congele instantaneamente todos os disparos da esteira com 1 clique.
          </p>
          <div class="panic-spec-box">
            <div class="pulse-red"></div>
            <span class="panic-spec-text">Resposta garantida em 12 milissegundos</span>
          </div>
        </div>

        <!-- Bento 3: Split Tributário no Recebimento -->
        <div class="glass-card bento-card card-tax">
          <span class="badge badge-amber mb-3">BLINDAGEM FISCAL</span>
          <h3 class="card-title">Cofre Virtual Tributário</h3>
          <p class="card-desc">
            Nunca mais seja surpreendido pelo DAS do Simples Nacional ou MEI no dia 20. O imposto é separado na fração de segundo em que o cliente paga.
          </p>
          <div class="tax-auto-badge">
            <span>Retenção atômica no ato do PIX</span>
          </div>
        </div>

        <!-- Bento 4: Previsão BI & Scoring (Grande) -->
        <div class="glass-card bento-card card-bi">
          <span class="badge badge-emerald mb-3">FINANCIAL INTELLIGENCE</span>
          <h3 class="card-title">Score de Saúde Financeira &amp; Previsão de Risco</h3>
          <p class="card-desc">
            Algoritmo determinístico que calcula o risco de atraso com base no comportamento histórico de cada pagador, permitindo agir preventivamente.
          </p>
          <div class="bi-metrics-grid">
            <div class="bi-metric-tile">
              <span class="tile-label">RISCO ATUAL</span>
              <span class="tile-value value-emerald">1.2%</span>
            </div>
            <div class="bi-metric-tile">
              <span class="tile-label">HEALTH SCORE</span>
              <span class="tile-value value-cyan">98.4 / 100</span>
            </div>
            <div class="bi-metric-tile">
              <span class="tile-label">PROJEÇÃO DRE</span>
              <span class="tile-value value-amber">R$ 58.000</span>
            </div>
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

    .bento-section-wrap {
      max-width: 1120px;
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
      margin: 0.5rem 0 0.75rem 0;
    }

    .section-desc {
      font-size: 1rem;
      color: #94a3b8;
      max-width: 650px;
      margin: 0 auto;
    }

    /* Bento Grid */
    .bento-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 900px) {
      .bento-grid {
        grid-template-columns: 1.4fr 1fr;
      }
    }

    .bento-card {
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: #18191e;
      transition: all 0.2s ease;
    }

    .bento-card:hover {
      border-color: rgba(255, 255, 255, 0.18);
      transform: translateY(-2px);
    }

    .card-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.65rem 0;
    }

    .card-desc {
      font-size: 0.9rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }

    /* Terminal Mockup */
    .terminal-mockup {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      padding: 1rem 1.25rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .terminal-line {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      line-height: 1.5;
    }

    .prompt-icon {
      font-weight: bold;
    }

    .line-emerald { color: #34d399; }
    .line-cyan { color: #22d3ee; }

    /* Panic Box */
    .panic-spec-box {
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.25);
      border-radius: 0.65rem;
      padding: 0.9rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      justify-content: center;
    }

    .pulse-red {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f43f5e;
      box-shadow: 0 0 8px #f43f5e;
    }

    .panic-spec-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      font-weight: 700;
      color: #fb7185;
    }

    /* Tax Badge */
    .tax-auto-badge {
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 0.5rem;
      padding: 0.65rem 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #fbbf24;
      text-align: center;
    }

    /* BI Metrics Grid */
    .bi-metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.85rem;
    }

    .bi-metric-tile {
      background: #0d0e12;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 0.65rem;
      padding: 0.85rem 0.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .tile-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }

    .tile-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      font-weight: 800;
    }

    .value-emerald { color: #34d399; }
    .value-cyan { color: #22d3ee; }
    .value-amber { color: #fbbf24; }
  `],
})
export class BentoFeaturesComponent {}
