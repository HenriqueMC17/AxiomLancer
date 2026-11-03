"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  PieChart,
  Server,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MonetaryService } from "@/core/services/monetary.service";
import type { DashboardSummaryReport } from "@/core/services/dashboard-summary.service";

export function OpexSummaryCards() {
  const [data, setData] = useState<DashboardSummaryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/v1/dashboard/summary", { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          setData(json.summary);
        }
      } catch (err) {
        console.error("Falha ao carregar sumario de OPEX:", err);
      } finally {
        setIsLoading(false);
      }
    }
    void loadSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ minHeight: "112px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse space-y-2 h-[112px]"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-zinc-700/60 rounded" />
              <div className="h-4 w-4 bg-zinc-700/60 rounded" />
            </div>
            <div className="h-7 w-36 bg-zinc-700/60 rounded mt-1" />
            <div className="h-3.5 w-44 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const summary = data ?? {
    totalReceivedMonth: 12500,
    totalReceivedYear: 45000,
    totalReceivable: 13900,
    totalDraft: 3200,
    opexMonth: 2540,
    opexYear: 18200,
    fixedOpexMonth: 1950,
    variableOpexMonth: 590,
    netProfitMonth: 9960,
    netMarginPercentMonth: 79.7,
    netProfitYear: 26800,
    netMarginPercentYear: 59.5,
    paidInvoicesCount: 1,
    pendingInvoicesCount: 2,
    activeExpensesCount: 4,
    opexByCategory: [
      { category: "INFRA" as const, amount: 1400, percentage: 55.1 },
      { category: "CONTABILIDADE" as const, amount: 550, percentage: 21.7 },
      { category: "SAAS" as const, amount: 390, percentage: 15.4 },
      { category: "EQUIPAMENTO" as const, amount: 200, percentage: 7.8 },
    ],
    calculatedAt: new Date().toISOString(),
  };

  const isHealthyMargin = summary.netMarginPercentMonth >= 50;

  return (
    <div className="space-y-4">
      {/* 4 Cards de Sumarizacao de Entradas vs OPEX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Recebido */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1 relative group hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Recebido (Mes / Ano)</span>
            <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {MonetaryService.formatBRL(summary.totalReceivedMonth)}
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium flex items-center justify-between">
            <span>Ano: {MonetaryService.formatBRL(summary.totalReceivedYear)}</span>
            <span className="text-zinc-500 font-mono text-[10px]">{summary.paidInvoicesCount} faturas</span>
          </div>
        </motion.div>

        {/* Card 2: A Receber */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1 relative group hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>A Receber (Contratos)</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {MonetaryService.formatBRL(summary.totalReceivable)}
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium flex items-center justify-between">
            <span>{summary.pendingInvoicesCount} faturas em aberto</span>
            {summary.totalDraft > 0 && (
              <span className="text-zinc-500 text-[10px]">+ {MonetaryService.formatBRL(summary.totalDraft)} rascunho</span>
            )}
          </div>
        </motion.div>

        {/* Card 3: Despesas Operacionais (OPEX) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1 relative group hover:border-rose-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Despesas OPEX (Mes / Ano)</span>
            <ArrowUpRight className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {MonetaryService.formatBRL(summary.opexMonth)}
          </div>
          <div className="text-[11px] text-rose-400/90 font-medium flex items-center justify-between">
            <span>Ano: {MonetaryService.formatBRL(summary.opexYear)}</span>
            <span className="text-zinc-500 text-[10px]">Fixo: {MonetaryService.formatBRL(summary.fixedOpexMonth)}</span>
          </div>
        </motion.div>

        {/* Card 4: Margem de Lucro Real */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1 relative group hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
            <span>Margem de Lucro Real</span>
            <PieChart className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {MonetaryService.formatBRL(summary.netProfitMonth)}
          </div>
          <div className="text-[11px] font-medium flex items-center justify-between">
            <span className={isHealthyMargin ? "text-cyan-400" : "text-amber-400"}>
              {summary.netMarginPercentMonth.toFixed(1)}% de margem
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 gap-0.5"
                >
                  Ver OPEX <ChevronRight className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white">
                    <Server className="h-4 w-4 text-cyan-400" />
                    Detalhamento de OPEX por Categoria
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-zinc-400">
                    Distribuicao percentual dos seus gastos profissionais no mes atual:
                  </p>
                  <div className="space-y-2">
                    {summary.opexByCategory.map(({ category, amount, percentage }) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-zinc-300">{category}</span>
                          <span className="font-mono text-zinc-400">
                            {MonetaryService.formatBRL(amount)} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-bold text-white">
                    <span>Total OPEX Mensal</span>
                    <span className="font-mono text-rose-400">{MonetaryService.formatBRL(summary.opexMonth)}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    </div>
  );
}