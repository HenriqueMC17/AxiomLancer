"use client";

import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck, Heart, Terminal, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingFooter() {
  return (
    <footer className="bg-zinc-950 font-sans border-t border-zinc-900 pt-20 pb-12 relative overflow-hidden">
      {/* Background glow behind CTA */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Pre-Footer Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-teal-950/40 border border-emerald-500/30 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl shadow-emerald-950/20 text-center space-y-6 max-w-5xl mx-auto">
          <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
            CHEGA DE PERDER HORAS COM PLANILHAS
          </Badge>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
            Pronto para colocar seu financeiro no piloto automático determinístico?
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Junte-se aos desenvolvedores, designers e donos de agência que transformaram cobrança em uma esteira silenciosa e eficiente.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-6 rounded-xl shadow-xl shadow-emerald-500/25 gap-2.5"
              >
                <Zap className="h-4 w-4 fill-zinc-950" />
                Criar Minha Conta — R$ 49,90/mês
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm font-semibold border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 px-6 py-6 rounded-xl"
              >
                Explorar Dashboard Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Garantia de 14 Dias
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Cancele Quando Quiser
            </span>
          </div>
        </div>

        {/* Footer Navigation & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-zinc-900 text-xs">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 text-black font-black text-lg shadow-md shadow-emerald-500/20">
                A
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">AxiomLancer</span>
                <span className="text-zinc-500 text-xs font-mono">por</span>
                <Badge className="bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-zinc-700">7Keys</Badge>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Motor de Execução Financeira Autônoma, Faturamento Inteligente e Cobrança Preditiva para freelancers seniores, engenheiros de software e estúdios boutique.
            </p>

            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistemas 100% Operacionais • Latência Média: 8.4ms</span>
            </div>
          </div>

          {/* Navigation Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-mono text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Plataforma</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#recursos" className="hover:text-emerald-400 transition-colors">Régua Autônoma</a></li>
                <li><a href="#bento-grid" className="hover:text-emerald-400 transition-colors">Safe Mode (12ms)</a></li>
                <li><a href="#bento-grid" className="hover:text-emerald-400 transition-colors">Previsio BI</a></li>
                <li><a href="#bento-grid" className="hover:text-emerald-400 transition-colors">Split Tributário</a></li>
                <li><a href="#bento-grid" className="hover:text-emerald-400 transition-colors">Smart Escrows</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Arquitetura</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#engenharia" className="hover:text-emerald-400 transition-colors">Motor decimal.js</a></li>
                <li><a href="#engenharia" className="hover:text-emerald-400 transition-colors">DeduplicationJournal</a></li>
                <li><a href="#roi-calc" className="hover:text-emerald-400 transition-colors">Calculadora de ROI</a></li>
                <li><a href="#comparativo" className="hover:text-emerald-400 transition-colors">Tabela Comparativa</a></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Live Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Conformidade</h4>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>LGPD / Marco Civil</span>
                </li>
                <li><span className="text-zinc-500">PIX Bacen Compliant</span></li>
                <li><span className="text-zinc-500">Criptografia AES-256</span></li>
                <li><span className="text-zinc-500">Simples Nacional Fator R</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div>
            © {new Date().getFullYear()} AxiomLancer. Desenvolvido pelo time <strong className="text-zinc-300">7Keys</strong> sob governança de <strong className="text-zinc-300">Henrique Monteiro Cardoso</strong>.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600">v2.4.0-enterprise</span>
            <span>Feito com rigor e paixão por código</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
