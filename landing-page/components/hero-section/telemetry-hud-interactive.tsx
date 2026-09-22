"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, RefreshCw, Zap, Lock, Pause, CheckCircle2 } from "lucide-react";

/**
 * Client Island - Telemetry HUD Interactive
 * Materialidade: Layer 1 (#1A1A1A) com Layer 2 (#2D2D2D) e destaque térmico Amber (#FF9900).
 * Core Web Vitals: Tabular Nums para Zero CLS e aceleração por GPU com translate3d.
 */
export function TelemetryHudInteractive() {
  const [isStressMode, setIsStressMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-4xl rounded-2xl p-[1px] bg-linear-to-b from-white/12 via-white/4 to-transparent shadow-2xl shadow-black/90"
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {/* Container Layer 1 */}
      <div className="w-full bg-[#1A1A1A] border border-white/8 rounded-[15px] overflow-hidden backdrop-blur-xl">
        
        {/* Window Chrome / Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 border-b border-white/8 bg-[#141414] gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 text-xs font-mono text-neutral-400">
              axiom-core.telemetry://live-node
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Alternador de Carga (Simulação Interativa) */}
            <button
              type="button"
              onClick={() => setIsStressMode((prev) => !prev)}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-[#2D2D2D] hover:bg-[#383838] border border-white/10 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 text-[#FF9900] ${isStressMode ? "animate-spin" : ""}`} />
              <span>{isStressMode ? "Simulação: Pico de Carga" : "Simulação: Fluxo Normal"}</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isStressMode ? "42 ops/s" : "Esteira Ativa"}</span>
            </div>

            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {isStressMode ? "2.1ms" : "1.8ms"}
            </span>
          </div>
        </div>

        {/* Conteúdo do HUD (Grid com Tabular Nums) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
          
          {/* Card Primário: Volume de Liquidação */}
          <div className="md:col-span-8 p-5 rounded-xl bg-[#0D0D0D] border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider">
                  Volume Executado no Ciclo Atual
                </p>
                <p className="text-3xl font-bold text-white tabular-nums tracking-tight mt-1">
                  {isStressMode ? "R$ 94.200,00" : "R$ 38.450,00"}
                  <span className="text-xs text-emerald-400 font-normal ml-2.5 font-sans inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% conciliado
                  </span>
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#2D2D2D] border border-white/10 text-[#FF9900]">
                <Activity className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            {/* Barra de Progresso Fila BullMQ */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>Régua Preditiva Automatizada</span>
                <span className="text-[#FF9900] font-semibold tabular-nums">Zero Inadimplência</span>
              </div>
              <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: isStressMode ? 0.9 : 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-linear-to-r from-amber-500 to-[#FF9900] rounded-full"
                />
              </div>
            </div>

            {/* Subcards em Layer 2 */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-white/8">
                <span className="text-[10px] text-neutral-400 block font-mono">Última Fatura</span>
                <span className="text-sm font-semibold text-white tabular-nums block mt-0.5">
                  {isStressMode ? "R$ 12.800,00" : "R$ 4.500,00"}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">PIX Pago D-0</span>
              </div>

              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-white/8">
                <span className="text-[10px] text-neutral-400 block font-mono">Cofre Simples 6%</span>
                <span className="text-sm font-semibold text-[#FF9900] tabular-nums block mt-0.5">
                  {isStressMode ? "R$ 768,00" : "R$ 270,00"}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Retido no ato</span>
              </div>

              <div className="p-3 rounded-lg bg-[#1A1A1A] border border-white/8">
                <span className="text-[10px] text-neutral-400 block font-mono">Botão de Pânico</span>
                <span className="text-sm font-semibold text-emerald-400 tabular-nums block mt-0.5">
                  Pronto (12ms)
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Pausa em 1 clique</span>
              </div>
            </div>
          </div>

          {/* Card Lateral: Eventos Autônomos em Fila */}
          <div className="md:col-span-4 p-5 rounded-xl bg-[#0D0D0D] border border-white/8 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
                Eventos em Execução
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#1A1A1A] border border-white/5 flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#FF9900] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-200 block font-medium">Split Fiscal Provisionado</span>
                    <span className="text-neutral-500 text-[10px] font-mono">ISS/IRPJ isolados no cofre</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#1A1A1A] border border-white/5 flex items-start gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-200 block font-medium">Webhook Conciliado</span>
                    <span className="text-neutral-500 text-[10px] font-mono">Asaas API • baixa em 280ms</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#1A1A1A] border border-white/5 flex items-start gap-2">
                  <Pause className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-200 block font-medium">Safe Mode Armado</span>
                    <span className="text-neutral-500 text-[10px] font-mono">Zero risco de disparo duplo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#FF9900]" /> AES-256
              </span>
              <span>LGPD Compliant</span>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
