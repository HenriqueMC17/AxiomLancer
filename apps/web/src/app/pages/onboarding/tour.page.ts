import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface TourStep {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  mockupType: 'regua' | 'cofre' | 'panico' | 'cockpit';
}

@Component({
  selector: 'app-tour-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tour-wrapper">
      <!-- Glows de Ambientação -->
      <div class="ambient-glow glow-mint"></div>
      <div class="ambient-glow glow-blue"></div>

      <div class="tour-container">
        <!-- Topo: Header com Progresso -->
        <header class="tour-header">
          <div class="flex items-center gap-3">
            <div class="tour-logo-badge">⚡</div>
            <div>
              <span class="text-xs font-mono text-mint tracking-wider uppercase font-semibold">
                Tour de Boas-Vindas
              </span>
              <h1 class="text-lg font-bold text-white font-['Outfit']">AxiomLancer 2.0</h1>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span class="step-indicator font-mono">
              Etapa <strong class="text-white">{{ currentStep() }}</strong> de 4
            </span>
            <button
              type="button"
              (click)="skipTour()"
              class="skip-btn font-mono cursor-pointer">
              Pular Tour ↷
            </button>
          </div>
        </header>

        <!-- Barra de Progresso Superior -->
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            [style.width.%]="(currentStep() / 4) * 100">
          </div>
        </div>

        <!-- Conteúdo do Passo Atual -->
        <div class="tour-main-grid">
          <!-- Coluna da Esquerda: Explicação & Benefícios -->
          <div class="tour-copy-column">
            <span class="step-pill">
              {{ currentStepData().badge }}
            </span>

            <h2 class="step-title">
              {{ currentStepData().title }}
            </h2>

            <p class="step-subtitle">
              {{ currentStepData().subtitle }}
            </p>

            <p class="step-desc">
              {{ currentStepData().description }}
            </p>

            <ul class="step-bullets">
              @for (point of currentStepData().bulletPoints; track point) {
                <li class="bullet-item">
                  <span class="bullet-check">✓</span>
                  <span>{{ point }}</span>
                </li>
              }
            </ul>

            <!-- Navegação Inferior -->
            <div class="tour-actions-row">
              <button
                type="button"
                (click)="prevStep()"
                [disabled]="currentStep() === 1"
                class="btn-nav-prev cursor-pointer">
                ← Anterior
              </button>

              @if (currentStep() < 4) {
                <button
                  type="button"
                  (click)="nextStep()"
                  class="btn-nav-next cursor-pointer">
                  <span>Avançar</span>
                  <span>→</span>
                </button>
              } @else {
                <button
                  type="button"
                  (click)="finishTour()"
                  class="btn-finish cursor-pointer">
                  <span>Próximo: Completar Perfil</span>
                  <span>→</span>
                </button>
              }
            </div>
          </div>

          <!-- Coluna da Direita: Mockup Visual Interativo da Feature -->
          <div class="tour-visual-column">
            <div class="visual-card">
              <!-- Header do Mockup -->
              <div class="visual-card-header">
                <div class="mock-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <span class="mock-tag font-mono">
                  MÓDULO ATIVO: {{ currentStepData().badge }}
                </span>
              </div>

              <!-- MOCKUP 1: RÉGUA PREDITIVA -->
              @if (currentStepData().mockupType === 'regua') {
                <div class="mock-content p-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs text-slate-400 font-mono">FATURA REF #4892</div>
                      <div class="text-sm font-bold text-white">Acme Global Enterprise Inc.</div>
                    </div>
                    <span class="status-badge-mint">98% PREDITIVO</span>
                  </div>

                  <div class="metric-box bg-[#121316] p-3 rounded-lg border border-white/5">
                    <div class="flex justify-between text-xs text-slate-400 font-mono mb-1">
                      <span>Valor Faturado</span>
                      <span>Vencimento</span>
                    </div>
                    <div class="flex justify-between items-baseline">
                      <span class="text-lg font-bold text-mint font-mono tabular-nums">R$ 18.500,00</span>
                      <span class="text-xs text-slate-300 font-mono">Em 2 dias</span>
                    </div>
                  </div>

                  <div class="timeline-box space-y-2">
                    <div class="timeline-step active">
                      <span class="time-dot"></span>
                      <span class="text-xs text-slate-300">D-5: Disparo de lembrete cordial via WhatsApp</span>
                    </div>
                    <div class="timeline-step active">
                      <span class="time-dot"></span>
                      <span class="text-xs text-slate-300">D-2: Chave PIX Dinâmica enviada por E-mail</span>
                    </div>
                    <div class="timeline-step pending">
                      <span class="time-dot"></span>
                      <span class="text-xs text-slate-500">D-0: Conciliação instantânea esperada às 11:30</span>
                    </div>
                  </div>
                </div>
              }

              <!-- MOCKUP 2: COFRE VIRTUAL -->
              @if (currentStepData().mockupType === 'cofre') {
                <div class="mock-content p-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-mono">SPLIT AUTOMÁTICO PIX</span>
                    <span class="status-badge-blue">RECEBIDO R$ 10.000,00</span>
                  </div>

                  <div class="space-y-2">
                    <div class="split-row bg-[#121316] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <span class="text-base">🛡️</span>
                        <div>
                          <div class="text-xs font-bold text-white">Cofre Tributário (DAS/Simples)</div>
                          <div class="text-[11px] text-slate-400 font-mono">Retenção de 15%</div>
                        </div>
                      </div>
                      <span class="text-sm font-bold text-rose-400 font-mono tabular-nums">R$ 1.500,00</span>
                    </div>

                    <div class="split-row bg-[#121316] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <span class="text-base">💎</span>
                        <div>
                          <div class="text-xs font-bold text-white">Reserva de Emergência / PJ</div>
                          <div class="text-[11px] text-slate-400 font-mono">Provisão de 10%</div>
                        </div>
                      </div>
                      <span class="text-sm font-bold text-amber-400 font-mono tabular-nums">R$ 1.000,00</span>
                    </div>

                    <div class="split-row bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20 flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <span class="text-base">💵</span>
                        <div>
                          <div class="text-xs font-bold text-emerald-400">Caixa Líquido Operacional</div>
                          <div class="text-[11px] text-slate-400 font-mono">Saldo Livre para Uso</div>
                        </div>
                      </div>
                      <span class="text-sm font-bold text-emerald-400 font-mono tabular-nums">R$ 7.500,00</span>
                    </div>
                  </div>
                </div>
              }

              <!-- MOCKUP 3: BOTÃO DE PÂNICO -->
              @if (currentStepData().mockupType === 'panico') {
                <div class="mock-content p-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-rose-400 font-mono font-bold flex items-center gap-1">
                      <span>⚡</span> PROTOCOLO DE CONTENÇÃO
                    </span>
                    <span class="status-badge-rose">LATÊNCIA: 11.8ms</span>
                  </div>

                  <div class="panic-status-card bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl text-center">
                    <div class="text-3xl mb-1">🚨</div>
                    <div class="text-sm font-bold text-white">Safe Mode em Prontidão</div>
                    <p class="text-xs text-slate-400 mt-1">
                      Proteção contratual automatizada em caso de quebra de acordo pelo cliente
                    </p>
                  </div>

                  <div class="space-y-1 text-xs font-mono text-slate-400 bg-[#121316] p-3 rounded-lg">
                    <div class="text-emerald-400">✓ Repositório GitHub privado temporariamente</div>
                    <div class="text-emerald-400">✓ Token de staging invalidado com hash criptográfico</div>
                    <div class="text-slate-300">✓ Log auditável emitido com carimbo de tempo Bacen</div>
                  </div>
                </div>
              }

              <!-- MOCKUP 4: COCKPIT EXECUTIVO -->
              @if (currentStepData().mockupType === 'cockpit') {
                <div class="mock-content p-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-mono">DRE GERENCIAL LIVE</span>
                    <span class="status-badge-mint">PIX BACEN ATIVO</span>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-[#121316] p-3 rounded-lg border border-white/5">
                      <div class="text-[11px] text-slate-400 font-mono">Faturamento Mensal</div>
                      <div class="text-base font-bold text-white font-mono tabular-nums mt-1">R$ 34.200</div>
                      <div class="text-[10px] text-emerald-400 font-mono">+18% vs mês ant.</div>
                    </div>

                    <div class="bg-[#121316] p-3 rounded-lg border border-white/5">
                      <div class="text-[11px] text-slate-400 font-mono">Lucro Líquido Real</div>
                      <div class="text-base font-bold text-mint font-mono tabular-nums mt-1">R$ 27.360</div>
                      <div class="text-[10px] text-slate-400 font-mono">Após 100% tributos</div>
                    </div>
                  </div>

                  <div class="bg-[#121316] p-3 rounded-lg border border-white/5 space-y-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-400">Previsão Fluxo de Caixa (90D)</span>
                      <span class="text-mint font-mono font-bold">100% Saudável</span>
                    </div>
                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tour-wrapper {
      min-height: 100vh;
      background-color: #121212;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      position: relative;
      overflow: hidden;
      font-family: var(--font-sans, 'Inter', sans-serif);
    }

    .ambient-glow {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 9999px;
      filter: blur(120px);
      pointer-events: none;
      opacity: 0.15;
    }
    .glow-mint {
      background: #10b981;
      top: -100px;
      left: -100px;
    }
    .glow-blue {
      background: #2563eb;
      bottom: -100px;
      right: -100px;
    }

    .tour-container {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      max-width: 960px;
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 10;
      backdrop-filter: blur(16px);
    }

    .tour-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(24, 25, 30, 0.6);
    }

    .tour-logo-badge {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .step-indicator {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .skip-btn {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      font-size: 0.75rem;
      padding: 0.35rem 0.75rem;
      border-radius: 0.4rem;
      transition: all 0.15s ease;
    }
    .skip-btn:hover {
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.05);
    }

    .progress-bar-track {
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.06);
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #38bdf8);
      transition: width 0.3s ease;
    }

    .tour-main-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 2.5rem;
      padding: 2.5rem 2rem;
    }
    @media (max-width: 820px) {
      .tour-main-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    .step-pill {
      display: inline-block;
      font-size: 0.7rem;
      font-family: var(--font-mono, monospace);
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      margin-bottom: 0.75rem;
    }

    .step-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin-bottom: 0.5rem;
    }

    .step-subtitle {
      font-size: 0.92rem;
      font-weight: 600;
      color: #93c5fd;
      margin-bottom: 0.75rem;
    }

    .step-desc {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }

    .step-bullets {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      font-size: 0.825rem;
      color: #e2e8f0;
    }
    .bullet-check {
      color: #10b981;
      font-weight: bold;
    }

    .tour-actions-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-nav-prev {
      padding: 0.65rem 1.1rem;
      background: #21222a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      font-size: 0.825rem;
      font-weight: 600;
      border-radius: 0.55rem;
      transition: all 0.15s ease;
    }
    .btn-nav-prev:hover:not(:disabled) {
      background: #2a2b36;
      color: #ffffff;
    }
    .btn-nav-prev:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-nav-next {
      padding: 0.65rem 1.4rem;
      background: #10b981;
      color: #064e3b;
      font-size: 0.85rem;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.55rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      transition: all 0.15s ease;
    }
    .btn-nav-next:hover {
      background: #34d399;
      transform: translateY(-1px);
    }

    .btn-finish {
      padding: 0.65rem 1.5rem;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      color: #042f2e;
      font-size: 0.85rem;
      font-weight: 800;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.55rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
      transition: all 0.15s ease;
    }
    .btn-finish:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    /* Visual Column & Mockup */
    .visual-card {
      background: #1e1f26;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
    }

    .visual-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #18191e;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .mock-dots {
      display: flex;
      gap: 0.35rem;
    }
    .dot {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 50%;
    }
    .dot.red { background: #ef4444; }
    .dot.yellow { background: #f59e0b; }
    .dot.green { background: #10b981; }

    .mock-tag {
      font-size: 0.65rem;
      color: #64748b;
    }

    .status-badge-mint {
      font-size: 0.65rem;
      font-family: var(--font-mono, monospace);
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.15rem 0.45rem;
      border-radius: 0.35rem;
    }

    .status-badge-blue {
      font-size: 0.65rem;
      font-family: var(--font-mono, monospace);
      font-weight: 700;
      color: #60a5fa;
      background: rgba(37, 99, 235, 0.12);
      border: 1px solid rgba(37, 99, 235, 0.3);
      padding: 0.15rem 0.45rem;
      border-radius: 0.35rem;
    }

    .status-badge-rose {
      font-size: 0.65rem;
      font-family: var(--font-mono, monospace);
      font-weight: 700;
      color: #f87171;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 0.15rem 0.45rem;
      border-radius: 0.35rem;
    }

    .timeline-step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .time-dot {
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      background: #10b981;
    }
    .timeline-step.pending .time-dot {
      background: #475569;
    }
  `]
})
export class OnboardingTourPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public currentStep = signal<number>(1);

  public steps: TourStep[] = [
    {
      id: 1,
      badge: 'RÉGUA PREDITIVA',
      title: 'Antecipação Autônoma & Zero Inadimplência',
      subtitle: 'IA financeira que prevê atrasos antes do vencimento da fatura',
      description: 'A Régua Preditiva analisa o comportamento histórico de pagamento dos clientes corporativos e agenda avisos gentis multicanal (WhatsApp e E-mail com PIX dinâmico), eliminando cobranças desconfortáveis.',
      bulletPoints: [
        'Score preditivo com 94% de precisão de liquidação',
        'Disparo cordial pré-vencimento com chave PIX e QR Code dinâmico',
        'Notificações em tempo real assim que o cliente abre o link da fatura',
      ],
      mockupType: 'regua',
    },
    {
      id: 2,
      badge: 'COFRE VIRTUAL',
      title: 'Split Automático de Impostos e Reservas',
      subtitle: 'Nunca mais seja surpreendido pelo boleto do DAS no dia 20',
      description: 'Ao receber qualquer pagamento via Bacen PIX, o AxiomLancer reserva imediatamente a fração destinada aos tributos federais e à sua reserva de emergência antes de misturar o saldo no caixa.',
      bulletPoints: [
        'Separação automática de DAS / Simples Nacional e IRPJ',
        'Cofre com rendimento de liquidez diária protegido',
        'Visão transparente de quanto dinheiro é realmente lucro livre',
      ],
      mockupType: 'cofre',
    },
    {
      id: 3,
      badge: 'BOTÃO DE PÂNICO 12ms',
      title: 'Protocolo de Contenção & Garantia Contratual',
      subtitle: 'Proteção jurídica e técnica para profissionais e agências autônomas',
      description: 'Em caso de inadimplência severa ou tentativa de golpe, o Botão de Pânico aciona um protocolo de contenção em menos de 15ms: desativação temporária de tokens de acesso e emissão de log auditável com validade jurídica.',
      bulletPoints: [
        'Resposta ultra-rápida com latência garantida abaixo de 15ms',
        'Carimbo de tempo e hash SHA-256 para resolução de disputas',
        'Reativação instantânea e limpa assim que a fatura é quitada',
      ],
      mockupType: 'panico',
    },
    {
      id: 4,
      badge: 'COCKPIT EXECUTIVO',
      title: 'DRE Gerencial e Fluxo de Caixa em Tempo Real',
      subtitle: 'Gestão contábil e financeira sem abrir nenhuma planilha',
      description: 'Acesse um centro de comando de alto nível com faturamento bruto, deduções tributárias, despesas operacionais (OPEX) e projeção de caixa para até 90 dias, suportado por conciliação bancária PIX autônoma.',
      bulletPoints: [
        'DRE gerencial atualizado a cada transação financeira',
        'Projeção preditiva de caixa para 30, 60 e 90 dias',
        'Emissão de relatórios e extratos com números tabulares auditados',
      ],
      mockupType: 'cockpit',
    },
  ];

  public currentStepData(): TourStep {
    return this.steps[this.currentStep() - 1];
  }

  public nextStep(): void {
    if (this.currentStep() < 4) {
      this.currentStep.update((s) => s + 1);
    }
  }

  public prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
    }
  }

  public async finishTour(): Promise<void> {
    await this.authService.completeTour();
    this.router.navigate(['/onboarding/profile']);
  }

  public async skipTour(): Promise<void> {
    await this.authService.completeTour();
    this.router.navigate(['/onboarding/profile']);
  }
}
