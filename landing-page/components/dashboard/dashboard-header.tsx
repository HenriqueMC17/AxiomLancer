"use client";

import Link from "next/link";
import {
  ShieldAlert,
  PlusCircle,
  Receipt,
  FileSpreadsheet,
  Activity,
  ArrowLeft,
  Calendar,
} from "lucide-react";

interface DashboardHeaderProps {
  isSafeModeActive: boolean;
  onToggleSafeMode: () => void;
  onOpenCreateInvoice: () => void;
  onOpenCreateExpense: () => void;
  onOpenExportReport: () => void;
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

export function DashboardHeader({
  isSafeModeActive,
  onToggleSafeMode,
  onOpenCreateInvoice,
  onOpenCreateExpense,
  onOpenExportReport,
  selectedPeriod,
  onSelectPeriod,
}: DashboardHeaderProps) {
  const periods = [
    { id: "7D", label: "7 Dias" },
    { id: "30D", label: "30 Dias" },
    { id: "MES", label: "Este Mês (Set/26)" },
    { id: "ANO", label: "Ano 2026" },
  ];

  return (
    <header className="border-b border-white/10 bg-[#0A0F1D]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Lado Esquerdo: Identidade & Telemetria HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-[color] duration-150 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site</span>
          </Link>

          <div className="hidden sm:block h-4 w-px bg-white/10" aria-hidden="true" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-mono tracking-tight text-white flex items-center gap-2">
                <span>Dashboard Analítico</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Núcleo Financeiro
                </span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AUTONOMOUS ENGINE: ONLINE
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-sky-400">
                <Activity className="w-3 h-3" />
                ZERO CLS: 60 FPS
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Período & Ações Rápidas */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Seletor de Período */}
          <div className="flex items-center bg-[#101C33] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 ml-2 mr-1" />
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPeriod(p.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-[background-color,color] duration-150 ${
                  selectedPeriod === p.id
                    ? "bg-[#1A2B4C] text-white font-semibold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Botão de Pânico (Safe Mode) */}
          <button
            type="button"
            onClick={onToggleSafeMode}
            title="Congela imediatamente todas as réguas de cobrança em 12ms"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-[background-color,border-color,color] duration-150 border ${
              isSafeModeActive
                ? "bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse shadow-md shadow-rose-900/30"
                : "bg-[#101C33] border-white/10 text-neutral-300 hover:border-rose-500/50 hover:text-rose-400"
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${isSafeModeActive ? "text-rose-400" : "text-neutral-400"}`} />
            <span>{isSafeModeActive ? "SAFE MODE: ATIVO (12ms)" : "Botão de Pânico"}</span>
          </button>

          {/* Ação Nova Fatura */}
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-medium transition-[background-color,transform] duration-150 active:scale-98 shadow-sm shadow-emerald-950"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Fatura</span>
          </button>

          {/* Ação Registrar Despesa */}
          <button
            type="button"
            onClick={onOpenCreateExpense}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#162644] hover:bg-[#1E3259] border border-white/10 text-neutral-200 text-xs font-medium transition-[background-color] duration-150"
          >
            <Receipt className="w-3.5 h-3.5 text-neutral-400" />
            <span>Despesa</span>
          </button>

          {/* Ação Exportar DRE */}
          <button
            type="button"
            onClick={onOpenExportReport}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#101C33] hover:bg-[#1A2B4C] border border-white/10 text-neutral-300 text-xs font-medium transition-[background-color] duration-150"
            title="Exportar DRE e Extrato Contábil"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-400" />
            <span>Exportar</span>
          </button>
        </div>

      </div>
    </header>
  );
}
