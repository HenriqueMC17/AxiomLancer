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
  `,
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
