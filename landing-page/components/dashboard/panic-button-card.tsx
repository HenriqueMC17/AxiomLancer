"use client";

import { ShieldAlert, ShieldCheck, CheckCircle2, Zap } from "lucide-react";

interface PanicButtonCardProps {
  isSafeModeActive: boolean;
  onToggleSafeMode: () => void;
  panicData: {
    responseTimeMs: number;
    monitoredChannels: string[];
    recoverySuccessRate: number;
    activeEscrowMilestones: number;
  };
}

export function PanicButtonCard({
  isSafeModeActive,
  onToggleSafeMode,
  panicData,
}: PanicButtonCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 backdrop-blur-md shadow-xl transition-[border-color,background-color] duration-200 transform translate3d(0,0,0) will-change-transform ${
        isSafeModeActive
          ? "border-rose-500/60 bg-rose-950/20"
          : "border-white/10 bg-[#101C33]/90"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Lado Esquerdo: Info da Tecnologia */}
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border ${
              isSafeModeActive
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {isSafeModeActive ? (
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-mono tracking-tight text-white">
                Esteira Ativa de Cobrança & Botão de Pânico
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isSafeModeActive
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {isSafeModeActive ? "ESTEIRA CONGELADA (12ms)" : "AUTÔNOMO ATIVO"}
              </span>
            </div>

            <p className="text-xs text-neutral-400 font-mono mt-1 max-w-xl">
              {isSafeModeActive
                ? "Safe Mode ativo: todos os disparos automáticos de régua (WhatsApp e E-mail) estão congelados para preservação total do relacionamento comercial."
                : "A esteira autônoma monitora faturas a vencer e executa cobranças elegantes com 89.3% de recuperação sem constrangimento manual."}
            </p>
          </div>
        </div>

        {/* Lado Direito: Toggle Switch Tátil */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            type="button"
            role="switch"
            aria-checked={isSafeModeActive}
            onClick={onToggleSafeMode}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-[background-color] duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 ${
              isSafeModeActive ? "bg-rose-600" : "bg-neutral-700"
            }`}
          >
            <span className="sr-only">Alternar Botão de Pânico Safe Mode</span>
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-[transform] duration-200 ease-in-out ${
                isSafeModeActive ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

      </div>

      {/* Canais Conectados & Telemetria */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Latência de Interrupção:</span>
          <span className="text-white font-bold tabular-nums">
            {panicData.responseTimeMs}ms
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Canais Monitorados:</span>
          <span className="text-neutral-400">3 de 3 Ativos</span>
        </div>

        <div className="flex items-center gap-2 text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Milestones em Escrow:</span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {panicData.activeEscrowMilestones} entregas
          </span>
        </div>
      </div>
    </div>
  );
}
