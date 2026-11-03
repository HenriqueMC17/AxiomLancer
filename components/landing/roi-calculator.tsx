"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Zap, CheckCircle2, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RoiCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(18000);
  const [weeklyAdminHours, setWeeklyAdminHours] = useState(10);
  const [yearlyLateInvoices, setYearlyLateInvoices] = useState(15000);

  // Calculations
  const hourlyRate = monthlyRevenue / 160; // based on 160h standard billing
  const hoursSavedPerYear = weeklyAdminHours * 50; // 50 working weeks
  const productiveValueSaved = hoursSavedPerYear * hourlyRate;
  const recoveredInvoices = yearlyLateInvoices * 0.85; // 85% recovery rate
  const annualAxiomCost = 49.9 * 12; // R$ 598,80
  const netFinancialGain = productiveValueSaved + recoveredInvoices - annualAxiomCost;
  const roiPercentage = Math.round((netFinancialGain / annualAxiomCost) * 100);

  return (
    <section id="roi-calc" className="py-24 bg-[#09090b] font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            CALCULADORA DE RETORNO • MATEMÁTICA PURA
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Descubra o valor exato das horas que você perde cobrando clientes.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Um desenvolvedor sênior não deveria gastar seu tempo gerando PDFs, conferindo extratos e cobrando no WhatsApp. Simule o ROI da esteira autônoma.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Inputs Column */}
          <div className="lg:col-span-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-400" />
              Parâmetros da Sua Operação
            </h3>

            {/* Slider 1: Monthly Revenue */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Seu Faturamento Mensal Médio:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  R$ {monthlyRevenue.toLocaleString("pt-BR")},00
                </span>
              </div>
              <Slider
                value={[monthlyRevenue]}
                min={5000}
                max={60000}
                step={1000}
                onValueChange={(val) => setMonthlyRevenue(val[0])}
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                <span>R$ 5k/mês</span>
                <span>Hora Técnica Estimada: R$ {hourlyRate.toFixed(2)}/h</span>
                <span>R$ 60k/mês</span>
              </div>
            </div>

            {/* Slider 2: Weekly Admin Hours */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Horas gastas com finanças e cobranças/sem:</span>
                <span className="text-white font-bold text-sm">{weeklyAdminHours} horas/semana</span>
              </div>
              <Slider
                value={[weeklyAdminHours]}
                min={2}
                max={20}
                step={1}
                onValueChange={(val) => setWeeklyAdminHours(val[0])}
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                <span>2 horas/sem</span>
                <span>Total de {hoursSavedPerYear}h salvas no ano</span>
                <span>20 horas/sem</span>
              </div>
            </div>

            {/* Slider 3: Yearly Late Invoices */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Estimativa de atrasos/inadimplência ao ano:</span>
                <span className="text-amber-400 font-bold text-sm">
                  R$ {yearlyLateInvoices.toLocaleString("pt-BR")},00
                </span>
              </div>
              <Slider
                value={[yearlyLateInvoices]}
                min={2000}
                max={40000}
                step={1000}
                onValueChange={(val) => setYearlyLateInvoices(val[0])}
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                <span>R$ 2.000</span>
                <span>Taxa de Recuperação: 85%</span>
                <span>R$ 40.000</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950/95 to-zinc-900/90 border border-emerald-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-emerald-950/20 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <span className="text-xs font-mono text-zinc-400">RETORNO ESTIMADO (ANUAL)</span>
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs font-mono">
                ROI +{roiPercentage.toLocaleString("pt-BR")}%
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-zinc-400">Ganho Líquido Projetado:</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                R$ {netFinancialGain.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-zinc-400">
                Soma de horas técnicas faturáveis reaproveitadas + cobranças recuperadas.
              </p>
            </div>

            {/* Breakdown lines */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  {hoursSavedPerYear}h salvas para codar:
                </span>
                <span className="text-emerald-400 font-bold">
                  + R$ {productiveValueSaved.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-teal-400" />
                  Inadimplência recuperada (85%):
                </span>
                <span className="text-teal-400 font-bold">
                  + R$ {recoveredInvoices.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800">
                <span>Investimento AxiomLancer (12 meses):</span>
                <span className="text-red-400 font-semibold">- R$ {annualAxiomCost.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/login" className="block w-full">
              <Button className="w-full text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-6 rounded-xl shadow-lg shadow-emerald-500/20 gap-2">
                Começar a Recuperar Minhas Horas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
