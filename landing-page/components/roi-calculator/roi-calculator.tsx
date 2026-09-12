"use client";

import { useState, useId } from "react";

/**
 * Client Island - ROI Calculator
 * Interactive sliders calculating saved hours, recovered default, and ROI multiplier.
 * Uses tabular-nums for zero layout shifts and aria-live for accessibility.
 */
export function RoiCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(100);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(15000);

  const hoursInputId = useId();
  const rateInputId = useId();
  const revenueInputId = useId();

  // 1. Custo do tempo gasto em cobrança (4 semanas/mês)
  const monthlyWastedCost = hoursPerWeek * 4 * hourlyRate;
  
  // 2. Inadimplência média típica estimada (5% da receita)
  const estimatedDefault = monthlyRevenue * 0.05;
  
  // 3. Economia com AxiomLancer (80% das horas salvas + 40% da inadimplência resgatada)
  const savedHoursValue = monthlyWastedCost * 0.8;
  const recoveredDefaultValue = estimatedDefault * 0.4;
  const totalMonthlyGain = savedHoursValue + recoveredDefaultValue;
  const netMonthlyGain = totalMonthlyGain - 49.9;
  const roiMultiplier = Math.max(1, Math.round(totalMonthlyGain / 49.9));

  return (
    <section id="calculadora-roi" className="py-24 bg-[#0D0D0D] scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center">
          <div className="inline-block rounded-full border border-white/10 bg-[#1A1A1A] px-3.5 py-1 text-xs font-mono text-emerald-400">
            SIMULADOR DE RETORNO (ROI)
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">
            Quanto o constrangimento de cobrar custa todo mês?
          </h2>
          <p className="mt-3 text-sm text-neutral-400 max-w-xl mx-auto">
            Simule o impacto financeiro de automatizar a esteira de cobranças com a mensalidade de R$ 49,90.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controles do Simulador (Layer 1) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              
              {/* Slider 1: Horas */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <label htmlFor={hoursInputId} className="text-neutral-300 font-medium">
                    Horas semanais gastas com cobranças e finanças:
                  </label>
                  <span className="font-mono text-white font-semibold tabular-nums text-base">
                    {hoursPerWeek}h / semana
                  </span>
                </div>
                <input
                  id={hoursInputId}
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-neutral-800 rounded-lg cursor-pointer h-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
                <span className="text-[11px] text-neutral-500">Média de mercado para solopreneurs: 10 a 15 horas</span>
              </div>

              {/* Slider 2: Valor/Hora */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <label htmlFor={rateInputId} className="text-neutral-300 font-medium">
                    Valor médio da sua hora técnica:
                  </label>
                  <span className="font-mono text-white font-semibold tabular-nums text-base">
                    R$ {hourlyRate},00
                  </span>
                </div>
                <input
                  id={rateInputId}
                  type="range"
                  min="30"
                  max="400"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-neutral-800 rounded-lg cursor-pointer h-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
              </div>

              {/* Slider 3: Faturamento */}
              <div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <label htmlFor={revenueInputId} className="text-neutral-300 font-medium">
                    Faturamento bruto mensal aproximado:
                  </label>
                  <span className="font-mono text-white font-semibold tabular-nums text-base">
                    R$ {monthlyRevenue.toLocaleString("pt-BR")},00
                  </span>
                </div>
                <input
                  id={revenueInputId}
                  type="range"
                  min="3000"
                  max="60000"
                  step="1000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-neutral-800 rounded-lg cursor-pointer h-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-neutral-500">
              * Estimativa com base em 80% de tempo economizado em rotinas financeiras e 40% de recuperação de inadimplência.
            </div>
          </div>

          {/* Card de Diagnóstico & Retorno (Layer 2) */}
          <div 
            aria-live="polite"
            className="lg:col-span-5 rounded-2xl border border-emerald-500/30 bg-[#2D2D2D] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Retorno Mensal Projetado
              </span>
              
              <div className="mt-4">
                <p className="text-xs text-neutral-400">Prejuízo mensal invisível sem automação:</p>
                <p className="text-2xl font-mono font-bold text-red-400 tabular-nums">
                  - R$ {(monthlyWastedCost + estimatedDefault).toLocaleString("pt-BR")},00
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Tempo resgatado para trabalho faturável:</span>
                  <span className="font-mono text-white tabular-nums">+ R$ {savedHoursValue.toLocaleString("pt-BR")},00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-300">Inadimplência recuperada pelo robô:</span>
                  <span className="font-mono text-white tabular-nums">+ R$ {recoveredDefaultValue.toLocaleString("pt-BR")},00</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Assinatura Core AxiomLancer:</span>
                  <span className="font-mono tabular-nums">- R$ 49,90</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#1A1A1A] border border-white/10">
                <span className="text-xs text-neutral-400 block">Lucro Líquido Adicional Estimado:</span>
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 tabular-nums">
                  + R$ {netMonthlyGain.toLocaleString("pt-BR")},00
                </span>
                <span className="block mt-1 text-[11px] font-mono text-neutral-400">
                  Retorno de investimento: <strong className="text-white">{roiMultiplier}x</strong> a assinatura
                </span>
              </div>
            </div>

            <a
              href="#trial"
              className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-[#2E7D32] hover:bg-[#256629] py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#2E7D32]/20 transition-[background-color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Começar Teste de 14 Dias Grátis
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}