"use client";

import {
  TrendingUp,
  Clock,
  ArrowDownRight,
  ShieldCheck,
  Percent,
} from "lucide-react";

interface KpiSummaryCardsProps {
  metrics: {
    liquidatedRevenue: number;
    receivables: number;
    operationalExpenses: number;
    taxReserve: number;
    defaultRiskRate: number;
    financialHealthScore: number;
    monthlyGoal: number;
    growthRate: number;
  };
}

export function KpiSummaryCards({ metrics }: KpiSummaryCardsProps) {
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const goalPercentage = Math.min(
    100,
    Number(((metrics.liquidatedRevenue / metrics.monthlyGoal) * 100).toFixed(1))
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* 1. Faturamento Liquidado (Mês) */}
      <div className="rounded-xl border border-white/10 bg-[#162644]/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-lg shadow-black/20 transform translate3d(0,0,0) will-change-transform">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Faturamento Liquidado</span>
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {formatBRL(metrics.liquidatedRevenue)}
          </div>
          
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span>+{metrics.growthRate}% vs mês anterior</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
            <span>Meta do Mês</span>
            <span className="tabular-nums">{goalPercentage}% ({formatBRL(metrics.monthlyGoal)})</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-[width] duration-300"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. A Receber (Previsio BI) */}
      <div className="rounded-xl border border-white/10 bg-[#162644]/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-lg shadow-black/20 transform translate3d(0,0,0) will-change-transform">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>A Receber (Previsio BI)</span>
            <div className="p-1 rounded-md bg-sky-500/10 text-sky-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {formatBRL(metrics.receivables)}
          </div>
          
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-sky-400">
            <span>96.8% de certeza estatística</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>Próx. Liquidação</span>
          <span className="text-white font-medium">02/10 (R$ 14.250)</span>
        </div>
      </div>

      {/* 3. Despesas Operacionais (OPEX) */}
      <div className="rounded-xl border border-white/10 bg-[#162644]/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-lg shadow-black/20 transform translate3d(0,0,0) will-change-transform">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Despesas (OPEX)</span>
            <div className="p-1 rounded-md bg-rose-500/10 text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {formatBRL(metrics.operationalExpenses)}
          </div>
          
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span>-4.2% dentro do teto</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>Margem Operacional</span>
          <span className="text-emerald-400 font-medium tabular-nums">81.1% Líquida</span>
        </div>
      </div>

      {/* 4. Cofre Virtual (Split Tributário) */}
      <div className="rounded-xl border border-white/10 bg-[#162644]/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-lg shadow-black/20 transform translate3d(0,0,0) will-change-transform">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Cofre Tributário</span>
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-amber-400 tabular-nums">
            {formatBRL(metrics.taxReserve)}
          </div>
          
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-neutral-300">
            <span>Split 6% Simples Nacional</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>Vencimento DAS</span>
          <span className="text-amber-300 font-medium">20/10/2026</span>
        </div>
      </div>

      {/* 5. Health Score & Inadimplência */}
      <div className="rounded-xl border border-white/10 bg-[#162644]/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-lg shadow-black/20 transform translate3d(0,0,0) will-change-transform">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Health Score</span>
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-white tabular-nums flex items-baseline gap-1">
            <span>{metrics.financialHealthScore}</span>
            <span className="text-xs text-neutral-400 font-normal">/ 100</span>
          </div>
          
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span>Excelente • Zero risco</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>Inadimplência</span>
          <span className="text-emerald-400 font-medium tabular-nums">{metrics.defaultRiskRate}%</span>
        </div>
      </div>

    </div>
  );
}
