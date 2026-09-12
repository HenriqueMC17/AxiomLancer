"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  PauseCircle, 
  PlayCircle, 
  MessageSquare, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle 
} from "lucide-react";
import { copywriting } from "@/lib/content/copywriting";

export function PanicSandboxIsland() {
  const { panicSandbox } = copywriting;
  const [selectedStageId, setSelectedStageId] = useState<string>("d-0");
  const [isPanicActive, setIsPanicActive] = useState<boolean>(false);

  const currentStage =
    panicSandbox.stages.find((s) => s.id === selectedStageId) || panicSandbox.stages[1];

  const handleTogglePanic = () => {
    setIsPanicActive((prev) => !prev);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-dark-l1 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative top indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPanicActive ? "bg-amber-400 animate-pulse" : "bg-emerald-400 animate-ping"
              }`}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              Ambiente de Simulação Ativa
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Alterne os estágios e teste o congelamento instantâneo da régua.
          </p>
        </div>

        {/* Emergency Panic Trigger */}
        <button
          type="button"
          onClick={handleTogglePanic}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-[background-color,border-color,transform] duration-150 active:scale-98 cursor-pointer ${
            isPanicActive
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 shadow-lg shadow-red-500/10"
          }`}
        >
          {isPanicActive ? (
            <>
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Retomar Esteira Autônoma</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Acionar Botão de Pânico</span>
            </>
          )}
        </button>
      </div>

      {/* Panic Status Banner if Active */}
      {isPanicActive && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start sm:items-center gap-3.5 transition-all">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-left text-xs">
            <span className="font-bold text-amber-300 block font-mono uppercase tracking-wide">
              ESTEIRA CONGELADA PELO USUÁRIO (SAFE MODE ATIVADO)
            </span>
            <p className="text-neutral-300 mt-0.5">
              Fila BullMQ pausada em <strong className="text-white font-mono">12ms</strong>. Todas as notificações automáticas para este cliente foram suspensas. Você mantém 100% do controle da conversa.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Timeline Stepper & Message Preview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Stage Switcher Buttons */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400 block mb-2 text-left">
            Selecione o Marco da Régua:
          </span>

          {panicSandbox.stages.map((stage) => {
            const isSelected = selectedStageId === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-[border-color,background-color] duration-150 flex items-center justify-between ${
                  isSelected
                    ? "bg-dark-l2 border-emerald-500/60 shadow-lg shadow-black/40"
                    : "bg-dark-l0/60 border-white/5 hover:border-white/20 hover:bg-dark-l0"
                }`}
              >
                <div>
                  <span className="text-sm font-bold text-white block font-sans">
                    {stage.label}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
                    Tom: <strong className="text-emerald-400">{stage.tone}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                    {stage.channel}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </button>
            );
          })}

          <div className="mt-6 p-4 rounded-xl bg-dark-l0/50 border border-white/5 text-left">
            <span className="text-[11px] font-mono font-semibold text-neutral-400 block">
              DIRETRIZ DE RELACIONAMENTO:
            </span>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              O AxiomLancer nunca usa tom agressivo ou constrangedor. Nossas réguas são redigidas no padrão corporativo cortês, preservando sua autoridade técnica.
            </p>
          </div>
        </div>

        {/* Right: Interactive Message Preview Screen */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-white/10 bg-dark-l0 overflow-hidden shadow-2xl">
            {/* Window header */}
            <div className="px-5 py-3 border-b border-white/8 bg-dark-l1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-xs font-mono text-neutral-400">
                  whatsapp-dispatch://client-contact
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {isPanicActive ? "ENVIO BLOQUEADO" : "PRONTO PARA DISPARO"}
                </span>
              </div>
            </div>

            {/* Message Body Simulation */}
            <div className="p-6 text-left space-y-4">
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Horário programado: 09:15h (Segunda a Sexta)</span>
              </div>

              {/* Message bubble */}
              <div
                className={`p-5 rounded-2xl border max-w-lg transition-[border-color,background-color] ${
                  isPanicActive
                    ? "bg-amber-950/20 border-amber-500/30 opacity-60"
                    : "bg-dark-l1 border-white/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">
                    AxiomLancer Billing Assistant
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 ml-auto">
                    Agora
                  </span>
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                  {currentStage.message}
                </p>

                {/* Simulated dynamic PIX card */}
                <div className="mt-4 p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <span className="text-[11px] font-mono text-white block">
                        PIX Dinâmico • R$ 4.500,00
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Liquidação em 280ms no Asaas
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    Copia & Cola
                  </span>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>● Canal Oficial de Notificação</span>
                <span className="text-emerald-400">Criptografia AES-256</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
