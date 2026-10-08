import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Persona {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  problem: string;
  solution: string;
  stat: string;
}

@Component({
  selector: 'app-persona-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="persona-section-wrap">
      <div class="section-header">
        <span class="badge badge-cyan mb-3">EXPERIÊNCIA ADAPTADA</span>
        <h2 class="section-title">Como o AxiomLancer resolve a sua realidade</h2>
        <p class="section-desc">Fluxos desenhados cirurgicamente para as dores reais de quem trabalha com código e produto digital.</p>
      </div>

      <!-- Abas de seleção reativas -->
      <div class="tabs-container">
        @for (persona of personas; track persona.id) {
          <button
            (click)="selectedPersona.set(persona)"
            [class.active]="selectedPersona().id === persona.id"
            class="tab-btn">
            <span>{{ persona.title }}</span>
          </button>
        }
      </div>

      <!-- Card da Persona Selecionada -->
      <div class="glass-card persona-card">
        <div class="card-top-bar">
          <span class="badge badge-emerald">{{ selectedPersona().badge }}</span>
          <span class="subtitle-text">{{ selectedPersona().subtitle }}</span>
        </div>

        <div class="card-content-grid">
          <div class="content-left">
            <div class="pain-block">
              <span class="block-label text-rose">A Dor Principal:</span>
              <div class="quote-box">
                <p>"{{ selectedPersona().problem }}"</p>
              </div>
            </div>

            <div class="solution-block">
              <span class="block-label text-mint">A Execução do AxiomLancer:</span>
              <p class="solution-text">
                {{ selectedPersona().solution }}
              </p>
            </div>
          </div>

          <div class="stat-highlight-box">
            <span class="stat-tag">GANHO DETERMINÍSTICO</span>
            <span class="stat-number font-mono">{{ selectedPersona().stat }}</span>
            <span class="stat-caption">Medido em esteiras ativas após 30 dias de operação</span>
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

    .persona-section-wrap {
      max-width: 980px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin: 0.5rem 0 0.5rem 0;
    }

    .section-desc {
      font-size: 0.95rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Tabs */
    .tabs-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 0.7rem 1.4rem;
      border-radius: 9999px;
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn:hover {
      border-color: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }

    .tab-btn.active {
      background: rgba(16, 185, 129, 0.12);
      border-color: #10b981;
      color: #34d399;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.2);
    }

    /* Persona Card */
    .persona-card {
      padding: 2.25rem;
      border: 1px solid rgba(16, 185, 129, 0.25);
      background: linear-gradient(180deg, #18191e 0%, #14151a 100%);
    }

    .card-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 1.75rem;
    }

    .subtitle-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .card-content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: center;
    }

    @media (min-width: 768px) {
      .card-content-grid {
        grid-template-columns: 1.4fr 1fr;
      }
    }

    .content-left {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .block-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }

    .text-rose { color: #fb7185; }
    .text-mint { color: #34d399; }

    .quote-box {
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.2);
      border-radius: 0.65rem;
      padding: 0.85rem 1rem;
      font-size: 0.875rem;
      font-family: 'JetBrains Mono', monospace;
      color: #fecdd3;
      line-height: 1.5;
    }

    .quote-box p {
      margin: 0;
    }

    .solution-text {
      font-size: 0.95rem;
      color: #e2e8f0;
      line-height: 1.6;
      margin: 0;
    }

    /* Stat Highlight Box */
    .stat-highlight-box {
      background: #1e1f26;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .stat-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .stat-number {
      font-size: 2.25rem;
      font-weight: 900;
      color: #34d399;
      line-height: 1.2;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }

    .stat-caption {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.4;
    }
  `],
})
export class PersonaSelectorComponent {
  public personas: Persona[] = [
    {
      id: 'dev',
      title: 'Dev Freelancer Fullstack',
      subtitle: 'Trabalho solo sob demandas ágeis',
      badge: 'DEV AUTÔNOMO',
      problem: 'Cobrar cliente no WhatsApp dá vergonha e consome o tempo em que eu deveria estar codando.',
      solution: 'O AxiomLancer gera a fatura vinculada ao milestone de deploy e cuida da cobrança com régua educada e profissional.',
      stat: 'Economia de 14h/mês',
    },
    {
      id: 'designer',
      title: 'UI/UX Designer & Product',
      subtitle: 'Entregas visuais e protótipos Figma',
      badge: 'DESIGNER PRO',
      problem: 'Clientes aprovam o design mas enrolam semanas para pagar a última parcela.',
      solution: 'Escrows inteligentes liberam os arquivos finais somente após o comprovante ou compensação bancária confirmada.',
      stat: '-90% de atraso em entregas',
    },
    {
      id: 'agency',
      title: 'Fundador de Microagência',
      subtitle: 'Gestão de 5 a 20 contratos mensais recorrentes',
      badge: 'MICROAGÊNCIA',
      problem: 'Perco o controle de quem pagou e sou surpreendido pelo boleto do imposto no fim do mês.',
      solution: 'Livro razão automatizado com split fiscal na hora e visão preditiva de fluxo de caixa para 6 meses.',
      stat: 'Cofre Fiscal 100% em dia',
    },
  ];

  public selectedPersona = signal<Persona>(this.personas[0]);
}
