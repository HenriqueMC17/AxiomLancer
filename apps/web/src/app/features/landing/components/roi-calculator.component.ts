import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roi-calculator',
  standalone: true,
  imports: [CommonModule],
  template: `
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
  `,
})
export class RoiCalculatorComponent {
  public hourlyRate = signal<number>(120);
  public hoursPerMonth = signal<number>(12);

  public annualTimeWaste = computed(() => {
    return this.hourlyRate() * this.hoursPerMonth() * 12;
  });

  public annualSavings = computed(() => {
    const timeSavedValue = this.annualTimeWaste() * 0.82;
    const softwareCost = 49.9 * 12;
    return Math.max(0, Math.round(timeSavedValue - softwareCost));
  });

  public updateHourlyRate(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.hourlyRate.set(val);
  }

  public updateHoursPerMonth(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.hoursPerMonth.set(val);
  }
}
