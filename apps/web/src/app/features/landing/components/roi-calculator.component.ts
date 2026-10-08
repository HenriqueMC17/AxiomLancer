import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roi-calculator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="roi" class="roi-section-wrap">
      <div class="glass-card roi-card">
        <div class="section-header">
          <span class="badge badge-emerald mb-3">CALCULADORA DE RETORNO</span>
          <h2 class="section-title">Quanto dinheiro você perde cobrando clientes?</h2>
          <p class="section-desc">Simule o impacto de substituir planilhas manuais pela esteira autônoma de liquidação.</p>
        </div>

        <div class="sliders-container">
          <!-- Slider 1: Valor da Hora -->
          <div class="slider-group">
            <div class="slider-label-row">
              <span class="slider-label">Seu valor por hora de trabalho:</span>
              <span class="slider-value value-emerald font-mono">R$ {{ hourlyRate() }},00</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              [value]="hourlyRate()"
              (input)="updateHourlyRate($event)"
              class="custom-range-input accent-emerald"
            />
            <div class="range-limits">
              <span>R$ 50/h</span>
              <span>R$ 500/h</span>
            </div>
          </div>

          <!-- Slider 2: Horas Gastas em Cobrança/Mês -->
          <div class="slider-group">
            <div class="slider-label-row">
              <span class="slider-label">Horas gastas em cobrança/financeiro por mês:</span>
              <span class="slider-value value-cyan font-mono">{{ hoursPerMonth() }} horas</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              [value]="hoursPerMonth()"
              (input)="updateHoursPerMonth($event)"
              class="custom-range-input accent-cyan"
            />
            <div class="range-limits">
              <span>2h/mês</span>
              <span>40h/mês</span>
            </div>
          </div>
        </div>

        <!-- Resultado do Cálculo Reativo via computed() -->
        <div class="roi-results-grid">
          <div class="result-tile tile-waste">
            <span class="tile-tag">CUSTO DO SEU TEMPO DESPERDIÇADO</span>
            <span class="tile-number text-rose font-mono">R$ {{ annualTimeWaste() }},00<span class="per-year">/ano</span></span>
            <span class="tile-note">Horas que poderiam estar faturando novos projetos</span>
          </div>

          <div class="result-tile tile-savings">
            <span class="tile-tag text-mint">ECONOMIA LÍQUIDA COM AXIOM LANCER</span>
            <span class="tile-number text-mint font-mono">R$ {{ annualSavings() }},00<span class="per-year">/ano</span></span>
            <span class="tile-note">ROI superior a 2.400% já no plano Freelancer Pro</span>
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

    .roi-section-wrap {
      max-width: 860px;
      margin: 0 auto;
    }

    .roi-card {
      padding: 3rem 2.5rem;
      border: 1px solid rgba(16, 185, 129, 0.2);
      background: #18191e;
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
    }

    /* Sliders */
    .sliders-container {
      max-width: 620px;
      margin: 0 auto 2.5rem auto;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .slider-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .slider-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .slider-label {
      color: #cbd5e1;
    }

    .slider-value {
      font-size: 1.15rem;
      font-weight: 800;
    }

    .value-emerald { color: #34d399; }
    .value-cyan { color: #22d3ee; }

    .custom-range-input {
      width: 100%;
      height: 8px;
      background: #0d0e12;
      border-radius: 9999px;
      appearance: none;
      outline: none;
      cursor: pointer;
    }

    .custom-range-input::-webkit-slider-thumb {
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .accent-emerald::-webkit-slider-thumb {
      background: #10b981;
      border: 2px solid #34d399;
    }

    .accent-cyan::-webkit-slider-thumb {
      background: #06b6d4;
      border: 2px solid #22d3ee;
    }

    .range-limits {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      font-family: 'JetBrains Mono', monospace;
      color: #64748b;
    }

    /* Results Grid */
    .roi-results-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .roi-results-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .result-tile {
      background: #121317;
      border-radius: 0.85rem;
      padding: 1.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
    }

    .tile-waste {
      border: 1px solid rgba(244, 63, 94, 0.25);
    }

    .tile-savings {
      border: 1px solid rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.04);
    }

    .tile-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }

    .tile-number {
      font-size: 1.85rem;
      font-weight: 900;
      line-height: 1.2;
    }

    .per-year {
      font-size: 0.85rem;
      font-weight: 500;
      opacity: 0.8;
    }

    .text-rose { color: #fb7185; }
    .text-mint { color: #34d399; }

    .tile-note {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
  `],
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
