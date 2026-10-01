import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

interface Persona {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  problem: string;
  solution: string;
  stat: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Announcement Banner -->
    <div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-500/20 px-4 py-2 text-center text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>AxiomLancer 2.0: Motor de Execução Financeira Autônoma ativo com Suporte ao BACEN PIX & BFF Seguro</span>
    </div>

    <!-- Navigation Bar -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-[#07090e]/85 border-b border-white/10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-3 text-decoration-none">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span class="text-xl font-black text-black">⚡</span>
          </div>
          <div>
            <span class="font-bold text-lg text-white font-['Outfit'] tracking-tight">Axiom<span class="text-emerald-400">Lancer</span></span>
            <span class="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Financial Core</span>
          </div>
        </a>

        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#features" class="hover:text-emerald-400 transition-colors">Funcionalidades</a>
          <a href="#roi" class="hover:text-emerald-400 transition-colors">Calculadora ROI</a>
          <a href="#panic" class="hover:text-emerald-400 transition-colors">Botão de Pânico</a>
          <a href="#pricing" class="hover:text-emerald-400 transition-colors">Preços</a>
        </nav>

        <div class="flex items-center gap-3">
          @if (authService.isAuthenticated()) {
            <a routerLink="/dashboard" class="btn-primary text-xs">
              <span>Painel Executivo</span>
              <span>→</span>
            </a>
          } @else {
            <a routerLink="/login" class="btn-secondary text-xs">Entrar</a>
            <a routerLink="/dashboard" class="btn-primary text-xs">Acessar Demonstração</a>
          }
        </div>
      </div>
    </header>

    <!-- 1. Hero Section com Headline de Alta Conversão -->
    <section class="relative pt-20 pb-28 px-4 overflow-hidden">
      <!-- Background Ambient Glows -->
      <div class="ambient-glow-emerald -top-20 -left-20"></div>
      <div class="ambient-glow-cyan top-40 -right-20"></div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-8">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>EXECUÇÃO FINANCEIRA ATIVA PARA QUEM ODEIA COBRAR CLIENTES</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-['Outfit'] tracking-tight leading-[1.1] mb-6">
          Transforme código e design em <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">dinheiro na conta</span>, sem constrangimento.
        </h1>

        <p class="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          O AxiomLancer substitui planilhas passivas por uma <strong class="text-white font-semibold">esteira autônoma de liquidação</strong>: régua preditiva multicanal (WhatsApp/PIX/Email), split fiscal instantâneo em cofre virtual e botão de pânico com resposta em 12ms.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a routerLink="/dashboard" class="btn-primary text-base px-8 py-3.5 w-full sm:w-auto shadow-xl shadow-emerald-500/25">
            <span>Iniciar Automação Agora</span>
            <span>⚡</span>
          </a>
          <a href="#panic" class="btn-secondary text-base px-6 py-3.5 w-full sm:w-auto">
            <span>Testar Botão de Pânico (12ms)</span>
          </a>
        </div>

        <!-- Telemetria HUD Flutuante no Hero -->
        <div class="glass-card p-6 border-white/10 max-w-3xl mx-auto shadow-2xl relative">
          <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4 text-xs font-mono">
            <span class="flex items-center gap-2 text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              TELEMETRIA DO MOTOR FINANCEIRO EM TEMPO REAL
            </span>
            <span class="text-slate-400">LATÊNCIA: 12ms | SLA: 99.98%</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Receita Liquidada</span>
              <span class="text-lg font-bold text-emerald-400 font-mono">R$ 48.750,00</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">A Receber</span>
              <span class="text-lg font-bold text-cyan-400 font-mono">R$ 24.320,00</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Cofre Fiscal (6%)</span>
              <span class="text-lg font-bold text-amber-400 font-mono">R$ 3.864,20</span>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5">
              <span class="text-[10px] font-mono uppercase text-slate-400 block mb-1">Health Score</span>
              <span class="text-lg font-bold text-emerald-400 font-mono">98.4 / 100</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Prova Social e Métricas de Impacto -->
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

    <!-- 3. Seletor Interativo de Perfis (Personas) com Signals -->
    <section class="py-20 px-4 max-w-5xl mx-auto">
      <div class="text-center mb-12">
        <span class="badge badge-cyan mb-3">EXPERIÊNCIA ADAPTADA</span>
        <h2 class="text-3xl sm:text-4xl font-bold font-['Outfit'] text-white">Como o AxiomLancer resolve a sua realidade</h2>
      </div>

      <!-- Abas de seleção reativas -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
        @for (persona of personas; track persona.id) {
          <button
            (click)="selectedPersona.set(persona)"
            [class.border-emerald-500]="selectedPersona().id === persona.id"
            [class.bg-emerald-500/10]="selectedPersona().id === persona.id"
            [class.text-emerald-400]="selectedPersona().id === persona.id"
            class="px-5 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 text-sm font-semibold hover:border-white/30 transition-all cursor-pointer">
            {{ persona.title }}
          </button>
        }
      </div>

      <!-- Card da Persona Selecionada -->
      <div class="glass-card p-8 border-emerald-500/30 bg-gradient-to-b from-slate-900/80 to-[#07090e]">
        <div class="flex items-center justify-between mb-4">
          <span class="badge badge-emerald">{{ selectedPersona().badge }}</span>
          <span class="text-xs font-mono text-slate-400">{{ selectedPersona().subtitle }}</span>
        </div>
        <div class="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 class="text-xl font-bold text-white mb-2">A Dor Principal:</h3>
            <p class="text-sm text-rose-300/90 mb-4 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg font-mono">
              "{{ selectedPersona().problem }}"
            </p>
            <h3 class="text-xl font-bold text-white mb-2">A Execução do AxiomLancer:</h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-4">
              {{ selectedPersona().solution }}
            </p>
          </div>
          <div class="bg-slate-950 p-6 rounded-xl border border-white/10 text-center">
            <span class="text-xs font-mono text-slate-400 block mb-2">GANHO DETERMINÍSTICO</span>
            <span class="text-4xl font-black text-emerald-400 font-mono block mb-2">{{ selectedPersona().stat }}</span>
            <span class="text-xs text-slate-300">Medido em esteiras ativas após 30 dias de operação</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Funcionalidades Core (Bento Grid) -->
    <section id="features" class="py-20 px-4 max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <span class="badge badge-emerald mb-3">ARQUITETURA ROBUSTA</span>
        <h2 class="text-3xl sm:text-5xl font-bold font-['Outfit'] text-white mb-4">Desenvolvido como infraestrutura de missão crítica</h2>
        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Construído sob Clean Architecture, DDD e isolamento de tenant com PostgreSQL e Convex Cloud.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Bento 1: Régua de Cobrança Preditiva -->
        <div class="glass-card p-8 md:col-span-2 relative overflow-hidden">
          <div class="ambient-glow-emerald -top-20 -right-20"></div>
          <span class="badge badge-cyan mb-4">AUTOMAÇÃO MULTICANAL</span>
          <h3 class="text-2xl font-bold text-white mb-2">Régua Preditiva com Tom de Voz Adaptativo</h3>
          <p class="text-sm text-slate-300 mb-6 leading-relaxed">
            Disparos programados antes e depois do vencimento via WhatsApp Business API, E-mail SMTP e geração automática de QR Code PIX dinâmico com expiração e conciliação bancária imediata.
          </p>
          <div class="p-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 space-y-2">
            <div class="text-emerald-400">> [WhatsApp D-3]: "Olá Felipe, tudo bem? Fatura #089 do Milestone 2 emitida com chave PIX copia-e-cola."</div>
            <div class="text-cyan-400">> [PIX BACEN D-0]: "Identificado pagamento instantâneo de R$ 18.500,00. Split de 6% retido no cofre."</div>
          </div>
        </div>

        <!-- Bento 2: Botão de Pânico Safe Mode -->
        <div class="glass-card p-8">
          <span class="badge badge-rose mb-4">CONTROLE TOTAL</span>
          <h3 class="text-2xl font-bold text-white mb-2">Botão de Pânico (12ms)</h3>
          <p class="text-sm text-slate-300 mb-4 leading-relaxed">
            Surgiu uma conversa delicada ou o cliente pediu um prazo? Congele instantaneamente todos os disparos da esteira com 1 clique.
          </p>
          <div class="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 font-mono text-xs text-center">
            Resposta garantida em 12 milissegundos
          </div>
        </div>

        <!-- Bento 3: Split Tributário no Recebimento -->
        <div class="glass-card p-8">
          <span class="badge badge-amber mb-4">BLINDAGEM FISCAL</span>
          <h3 class="text-xl font-bold text-white mb-2">Cofre Virtual Tributário</h3>
          <p class="text-sm text-slate-300 leading-relaxed">
            Nunca mais seja surpreendido pelo DAS do Simples Nacional ou MEI no dia 20. O imposto é separado na fração de segundo em que o cliente paga.
          </p>
        </div>

        <!-- Bento 4: Previsio BI & Scoring -->
        <div class="glass-card p-8 md:col-span-2">
          <span class="badge badge-emerald mb-4">FINANCIAL INTELLIGENCE</span>
          <h3 class="text-xl font-bold text-white mb-2">Score de Saúde Financeira & Previsão de Risco</h3>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            Algoritmo determinístico que calcula o risco de atraso com base no comportamento histórico de cada pagador, permitindo agir preventivamente.
          </p>
          <div class="grid grid-cols-3 gap-3 font-mono text-xs text-center">
            <div class="p-3 bg-slate-900 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px]">RISCO ATUAL</span>
              <span class="text-emerald-400 font-bold text-base">1.2%</span>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px]">HEALTH SCORE</span>
              <span class="text-cyan-400 font-bold text-base">98.4 / 100</span>
            </div>
            <div class="p-3 bg-slate-900 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px]">PROJEÇÃO DRE</span>
              <span class="text-amber-400 font-bold text-base">R$ 58.000</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Simulador Interativo de ROI com Signals -->
    <section id="roi" class="py-20 px-4 max-w-4xl mx-auto">
      <div class="glass-card p-8 sm:p-12 border-emerald-500/20 relative">
        <div class="text-center mb-10">
          <span class="badge badge-emerald mb-3">CALCULADORA DE RETORNO</span>
          <h2 class="text-3xl font-bold font-['Outfit'] text-white">Quanto dinheiro você perde cobrando clientes?</h2>
        </div>

        <div class="space-y-6 max-w-xl mx-auto mb-10">
          <!-- Slider 1: Valor da Hora -->
          <div>
            <div class="flex justify-between text-sm font-semibold mb-2">
              <span class="text-slate-300">Seu valor por hora de trabalho:</span>
              <span class="font-mono text-emerald-400 text-base">R$ {{ hourlyRate() }},00</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              [value]="hourlyRate()"
              (input)="updateHourlyRate($event)"
              class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <!-- Slider 2: Horas Gastas em Cobrança/Mês -->
          <div>
            <div class="flex justify-between text-sm font-semibold mb-2">
              <span class="text-slate-300">Horas gastas em cobrança/financeiro por mês:</span>
              <span class="font-mono text-cyan-400 text-base">{{ hoursPerMonth() }} horas</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              [value]="hoursPerMonth()"
              (input)="updateHoursPerMonth($event)"
              class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        <!-- Resultado do Cálculo Reativo via computed() -->
        <div class="grid sm:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-white/10 text-center">
          <div>
            <span class="text-xs font-mono text-slate-400 uppercase block mb-1">Custo do seu tempo desperdiçado</span>
            <span class="text-3xl font-black text-rose-400 font-mono">R$ {{ annualTimeWaste() }},00/ano</span>
          </div>
          <div>
            <span class="text-xs font-mono text-slate-400 uppercase block mb-1">Economia líquida com AxiomLancer</span>
            <span class="text-3xl font-black text-emerald-400 font-mono">R$ {{ annualSavings() }},00/ano</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Botão de Pânico Sandbox Interativo -->
    <section id="panic" class="py-20 px-4 max-w-4xl mx-auto text-center">
      <span class="badge badge-rose mb-3">EXPERIÊNCIA EM TEMPO REAL</span>
      <h2 class="text-3xl sm:text-4xl font-bold font-['Outfit'] text-white mb-4">Teste o Botão de Pânico (Safe Mode)</h2>
      <p class="text-slate-400 max-w-2xl mx-auto text-sm mb-8">
        Clique no botão abaixo para simular o congelamento instantâneo da esteira de cobrança em 12ms.
      </p>

      <div class="glass-card p-8 border-rose-500/20 max-w-lg mx-auto">
        <div class="mb-6">
          <span class="text-xs font-mono text-slate-400 block mb-2">STATUS ATUAL DA ESTEIRA:</span>
          @if (isSandboxPanicActive()) {
            <span class="badge badge-rose text-sm px-4 py-1.5">SAFE MODE ATIVADO (CONGELADA)</span>
          } @else {
            <span class="badge badge-emerald text-sm px-4 py-1.5">MOTOR OPERANDO NORMALMENTE</span>
          }
        </div>

        <button
          (click)="toggleSandboxPanic()"
          [class.btn-panic]="!isSandboxPanicActive()"
          [class.btn-panic-active]="isSandboxPanicActive()"
          class="w-full py-4 text-base font-bold rounded-xl cursor-pointer transition-all">
          @if (isSandboxPanicActive()) {
            <span>✓ Descongelar Esteira e Retomar Automação</span>
          } @else {
            <span>⚡ ACIONAR BOTÃO DE PÂNICO (12ms)</span>
          }
        </button>

        <p class="text-[11px] font-mono text-slate-400 mt-4">
          Latência de execução: 12ms | Sem notificação ao cliente | Bloqueio atômico em nível de banco
        </p>
      </div>
    </section>

    <!-- 7. Preços Transparentes -->
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

    <!-- Rodapé -->
    <footer class="py-12 px-4 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 AxiomLancer FinTech Core. Iniciativa 7Keys Engineering.</span>
        <span>Conformidade estrita LGPD & BACEN PIX Dinâmico.</span>
      </div>
    </footer>
  `,
})
export class LandingPageComponent {
  public authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Signals para a Calculadora de ROI
  public hourlyRate = signal<number>(120);
  public hoursPerMonth = signal<number>(12);

  public annualTimeWaste = computed(() => {
    return this.hourlyRate() * this.hoursPerMonth() * 12;
  });

  public annualSavings = computed(() => {
    // Estimativa de 82% de tempo poupado menos o custo do software
    const timeSavedValue = this.annualTimeWaste() * 0.82;
    const softwareCost = 49.9 * 12;
    return Math.max(0, Math.round(timeSavedValue - softwareCost));
  });

  // Signals para o Sandbox do Botão de Pânico
  public isSandboxPanicActive = signal<boolean>(false);

  public toggleSandboxPanic(): void {
    const next = !this.isSandboxPanicActive();
    this.isSandboxPanicActive.set(next);
    if (next) {
      this.toastService.show('Sandbox: Safe Mode ativado em 12ms! Réguas congeladas.', 'alert');
    } else {
      this.toastService.show('Sandbox: Esteira de cobrança reativada.', 'success');
    }
  }

  public updateHourlyRate(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.hourlyRate.set(val);
  }

  public updateHoursPerMonth(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.hoursPerMonth.set(val);
  }

  // Lista de Personas
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
