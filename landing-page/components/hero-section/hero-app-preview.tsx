"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

/**
 * Client Island - Hero App Preview
 * Demonstrates real-time financial telemetry, autonomous actions and the .ai-cursor effect.
 */
export function HeroAppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative w-full max-w-5xl mx-auto mt-14 rounded-2xl p-px bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl shadow-black/90 group"
      style={{ transform: "translate3d(0,0,0)" }}
    >
      {/* Layer 1 (Surface): Main Canvas Container (#1A1A1A) */}
      <div className="relative w-full bg-[#1A1A1A] border border-white/8 rounded-[15px] overflow-hidden backdrop-blur-2xl">
        
        {/* Top Control Bar (Mac-style status header) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-[#0D0D0D]/70 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" aria-hidden="true" />
            <span className="ml-3 text-xs font-mono text-neutral-400">axiom-intelligence-v2.1.4.service</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </div>
            <span className="text-xs font-mono text-neutral-500 tabular-nums">4.2ms latency</span>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5 bg-[#1A1A1A]">
          
          {/* Main Financial Telemetry Widget */}
          <div className="md:col-span-8 p-5 rounded-xl bg-[#0D0D0D]/90 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider font-mono">
                  Escrow Telemetry & Pipeline
                </p>
                <h2 className="text-2xl font-bold text-white tabular-nums tracking-tight font-sans mt-0.5">
                  $142,850.00{" "}
                  <span className="text-xs text-emerald-400 font-normal ml-2 inline-flex items-center gap-0.5">
                    +18.4% vs last cycle
                  </span>
                </h2>
              </div>
              <div className="p-2 rounded-lg bg-neutral-800/60 border border-white/10 text-amber-400">
                <Activity className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            {/* Simulated Live Sparkline / Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-neutral-400 font-mono">
                <span>Milestone #04: Smart Escrow Release</span>
                <span className="text-amber-400 font-bold tabular-nums">84% Executed</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/5">
                <span className="text-[11px] text-neutral-400 block font-mono">Auto-Invoiced</span>
                <span className="text-sm font-semibold text-white tabular-nums">$48,200</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/5">
                <span className="text-[11px] text-neutral-400 block font-mono">Dispute Risk</span>
                <span className="text-sm font-semibold text-emerald-400 tabular-nums">0.00%</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900/60 border border-white/5">
                <span className="text-[11px] text-neutral-400 block font-mono">Verification Time</span>
                <span className="text-sm font-semibold text-amber-400 tabular-nums">1.2 sec</span>
              </div>
            </div>
          </div>

          {/* Side AI Agent Status Panel */}
          <div className="md:col-span-4 p-5 rounded-xl bg-[#0D0D0D]/90 border border-white/8 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Autonomous Stream
                </span>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-900/80 border border-white/5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-neutral-200 font-medium block">Scope Audit Passed</span>
                    <span className="text-neutral-500 text-[11px]">Git commit matched PRD spec #412</span>
                  </div>
                </div>

                {/* AI Streaming micro-interaction with .ai-cursor */}
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-900/80 border border-white/5 text-xs">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-neutral-200 font-medium block">Instant Payout Triggered</span>
                    <span className="text-neutral-400 text-[11px] font-mono ai-cursor">
                      USDC transferred to cold vault
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition-[background-color,border-color,color] duration-200 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Open Audit Log
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Blueprint & Liquid Glass: Layer 2 (Overlay) Floating Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute bottom-6 right-6 hidden lg:flex items-center gap-3 p-3.5 rounded-xl bg-[#2D2D2D]/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/80"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">SOC2 Type II & Escrow Verified</span>
            <span className="text-[11px] text-neutral-400 font-mono">Zero-Trust Encryption Active</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
