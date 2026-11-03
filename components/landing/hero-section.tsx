"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Sparkles,
  Layers,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const [copiedPix, setCopiedPix] = useState(false);

  function handleCopySimulatedPix() {
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  }

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden font-sans flex flex-col justify-center">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Background subtle grid pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium shadow-sm backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ESTEIRA FINANCEIRA AUTÔNOMA • 7KEYS CORE</span>
            <span className="text-emerald-500/50">|</span>
            <span className="text-zinc-300">ARQUITETURA DETERMINÍSTICA</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] text-balance"
          >
            Transforme código e design em dinheiro na conta.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Sem o constrangimento de cobrar clientes.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal text-balance"
          >
            A esteira autônoma que assume a régua de cobrança via PIX dinâmico,
            isola seus impostos do Simples Nacional em cofres automáticos e prevê seu fluxo de caixa em 30, 60 e 90 dias com parada garantida em 12ms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-6 rounded-xl shadow-xl shadow-emerald-500/25 gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="h-4 w-4 fill-zinc-950" />
                Iniciar Esteira Autônoma — R$ 49,90/mês
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#bento-grid" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm font-semibold border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-white text-zinc-300 px-6 py-6 rounded-xl backdrop-blur-md gap-2"
              >
                <Terminal className="h-4 w-4 text-emerald-400" />
                Ver Demonstração Interativa
              </Button>
            </a>
          </motion.div>

          {/* Micro Guarantee Label */}
          <div className="flex items-center justify-center gap-6 text-xs text-zinc-400 pt-1 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Zero Fidelidade Contratual
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Take Rate de 5% Só no Sucesso
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Setup em 3 Minutos
            </span>
          </div>
        </div>

        {/* Live Mockup / Interactive Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-emerald-950/30 ring-1 ring-white/10">
            {/* Top terminal bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-zinc-400 hidden sm:inline">
                  axiom-engine://worker/autonomous-pipeline.ts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/10 gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  MOTOR ATIVO • EM EXECUÇÃO
                </Badge>
                <span className="text-zinc-500 font-mono text-[11px] hidden md:inline">
                  SAFE-MODE: 8.4ms
                </span>
              </div>
            </div>

            {/* Simulated Live Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Transaction Feed */}
              <div className="md:col-span-7 space-y-3">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Fatura #FAT-2026-089</div>
                        <div className="text-xs text-zinc-400">Cliente: FinTech Nexus Brasil S.A.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-emerald-400">R$ 12.500,00</div>
                      <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-[10px]">
                        Régua D-0 Ativada
                      </Badge>
                    </div>
                  </div>

                  {/* Split breakdown */}
                  <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>Split Tributário (Simples Fator R - 6.0%):</span>
                      <span className="text-cyan-400 font-semibold">- R$ 750,00</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Provisão Cofre Virtual:</span>
                      <span className="text-emerald-400 font-semibold">Destinado p/ Reserva DAS</span>
                    </div>
                    <div className="flex justify-between text-zinc-200 pt-1 border-t border-zinc-800/80 font-bold">
                      <span>Líquido Freelancer Disponível:</span>
                      <span className="text-white">R$ 11.750,00</span>
                    </div>
                  </div>
                </div>

                {/* Autonomous Message Preview */}
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      WhatsApp Autônomo Disparado (Tom Executivo)
                    </span>
                    <span>Deduplication ID: 9f7a2...</span>
                  </div>
                  <p className="text-zinc-300 italic bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/60 font-sans text-xs">
                    "Olá time financeiro da Nexus. A fatura do marco de deploy foi gerada com QR Code PIX dinâmico com conciliação imediata. Segue a chave para liquidação."
                  </p>
                </div>
              </div>

              {/* Right Column: Instant Action / QR Code Simulation */}
              <div className="md:col-span-5 flex flex-col justify-between p-4 rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-zinc-800/80">
                <div className="space-y-2 text-center">
                  <div className="inline-flex p-3 rounded-2xl bg-white text-zinc-950 shadow-md">
                    <QrCode className="h-28 w-28" />
                  </div>
                  <div className="text-xs font-mono font-medium text-zinc-300">
                    PIX Dinâmico com Webhook Instantâneo
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Validação em 1.2s • Retenção zero de saldo
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    onClick={handleCopySimulatedPix}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-mono border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-200 hover:text-emerald-300 gap-2"
                  >
                    {copiedPix ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Código Copiado com Sucesso!
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3.5 w-3.5" />
                        Copiar Código PIX Simulado
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Trust Metrics Cards (Grade 8px) */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">15h/sem</div>
            </div>
            <div className="text-xs font-semibold text-zinc-300">Horas Salvas</div>
            <p className="text-xs text-zinc-400 mt-1">Zero planilhas manuais e conciliação bancária redundante.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">R$ 0</div>
            </div>
            <div className="text-xs font-semibold text-zinc-300">Constrangimento</div>
            <p className="text-xs text-zinc-400 mt-1">Cobrança institucional profissional no WhatsApp e Email.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
            </div>
            <div className="text-xs font-semibold text-zinc-300">Determinístico</div>
            <p className="text-xs text-zinc-400 mt-1">Precisão com decimal.js e ACID sem erros de float.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 12ms</div>
            </div>
            <div className="text-xs font-semibold text-zinc-300">Safe Mode Instantâneo</div>
            <p className="text-xs text-zinc-400 mt-1">Botão de pânico para congelar disparos com 1 clique.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
