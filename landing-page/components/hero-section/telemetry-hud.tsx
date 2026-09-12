"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Lock, ShieldCheck, Zap, PauseCircle, RefreshCw } from "lucide-react";

/**
 * Client Island - Telemetry HUD (Interactive Engine Preview)
 * Demonstrates real-time financial execution, BullMQ queue status, and tax vaults.
 * Strict Layer 1 (bg-dark-l1) with Layer 2 (bg-dark-l2) overlay.
 * Includes interactive Stress Test simulation toggle.
 */
export function TelemetryHud() {
  const [simulationMode, setSimulationMode] = useState<"nominal" | "stress">("nominal");

  const isStress = simulationMode === "stress";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative mx-auto max-w-5xl rounded-2xl p-1 bg-linear-to-b from-white/15 via-white/5 to-transparent shadow-2xl shadow-black/80"
    >
      <div className="relative w-full bg-dark-l1 border border-white/8 rounded-[15px] overflow-hidden backdrop-blur-2xl">
        
        {/* Top Window Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 border-b border-white/8 bg-[#0F1E36]/60 backdrop-blur-md gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" aria-hidden="true" />
            <span className="ml-3 text-xs font-mono text-neutral-400">
              axiom-engine.bullmq-queue://production
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulation Toggle */}
            <button
              type="button"
              onClick={() => setSimulationMode((prev) => (prev === "nominal" ? "stress" : "nominal"))}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clique para alternar o modo de estresse da esteira"
            >
              <RefreshCw className={`w-3 h-3 text-emerald-400 ${isStress ? "animate-spin" : ""}`} />
              <span>{isStress ? "Modo: Pico de Carga" : "Modo: Nominal"}</span>
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isStress ? "45 Faturas / seg" : "Motor Ativo 24/7"}
            </div>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {isStress ? "latência 2.1ms" : "latência 1.8ms"}
            </span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5 bg-dark-l1">
          
          {/* Main Card: Fluxo de Liquidação e Impostos */}
          <div className="md:col-span-8 p-6 rounded-xl bg-dark-l0/95 border border-white/8 space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest font-mono">
                  Execução Financeira em Tempo Real
                </p>
                <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight mt-1">
                  {isStress ? "R$ 94.200,00" : "R$ 38.450,00"}{" "}
                  <span className="text-xs text-emerald-400 font-normal ml-2 inline-flex items-center gap-0.5 font-sans">
                    +100% recebido em dia
                  </span>
                </h2>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0F1E36] border border-blue-500/20 text-blue-400">
                <Activity className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            {/* Fila BullMQ de Lembretes */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-neutral-400 font-mono">
                <span>
                  {isStress
                    ? "Régua Preditiva Concorrente (Cluster de Workers Ativo)"
                    : "Régua Preditiva D-3 (Asaas / Stripe Webhooks)"}
                </span>
                <span className="text-emerald-400 font-bold tabular-nums">100% Automatizado</span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: isStress ? 0.8 : 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-linear-to-r from-blue-600 via-teal-400 to-emerald-400 rounded-full"
                />
              </div>
            </div>

            {/* Sub-painel com Tabular Nums para Zero CLS */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-white/5">
                <span className="text-[11px] text-neutral-400 block font-mono">
                  {isStress ? "Fatura #2041 PIX" : "Fatura #1084 PIX"}
                </span>
                <span className="text-base font-semibold text-white tabular-nums">
                  {isStress ? "R$ 12.800,00" : "R$ 4.500,00"}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  {isStress ? "Liquidado em 280ms" : "Quitado D-0 (09:14h)"}
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-white/5">
                <span className="text-[11px] text-neutral-400 block font-mono">Cofre Simples 6%</span>
                <span className="text-base font-semibold text-emerald-400 tabular-nums">
                  {isStress ? "R$ 768,00" : "R$ 270,00"}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Provisionado no ato</span>
              </div>
              <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-white/5">
                <span className="text-[11px] text-neutral-400 block font-mono">Inadimplência</span>
                <span className="text-base font-semibold text-blue-400 tabular-nums">0.00%</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Zero atrasos hoje</span>
              </div>
            </div>
          </div>

          {/* Stream Lateral de Ações Autônomas */}
          <div className="md:col-span-4 p-6 rounded-xl bg-dark-l0/95 border border-white/8 flex flex-col justify-between text-left space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Esteira em Execução
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950/90 border border-white/5 text-xs">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-neutral-200 font-medium block">Split Fiscal Provisionado</span>
                    <span className="text-neutral-500 text-[11px] font-mono">ISS + IRPJ separados no cofre</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950/90 border border-white/5 text-xs">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-neutral-200 font-medium block">Lembrete D-3 Despachado</span>
                    <span className="text-neutral-400 text-[11px] font-mono">
                      PIX com QR Code dinâmico
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950/90 border border-white/5 text-xs">
                  <PauseCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-neutral-200 font-medium block">Botão de Pânico Armado</span>
                    <span className="text-neutral-500 text-[11px] font-mono">1 clique para congelar fila</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-mono text-neutral-500 block text-center">
                ● Integrado com Asaas & Stripe APIs
              </span>
            </div>
          </div>
        </div>

        {/* Layer 2 (Elevated Overlay) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute bottom-6 right-6 hidden lg:flex items-center gap-3.5 p-4 rounded-xl bg-dark-l2/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/90"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white block">LGPD & Segurança Bancária</span>
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              Criptografia AES-256 de Ponta a Ponta
            </span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}