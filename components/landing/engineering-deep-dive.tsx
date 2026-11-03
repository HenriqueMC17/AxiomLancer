"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Binary, 
  CheckCircle2, 
  Key,
  Layers,
  FileCode2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EngineeringDeepDive() {
  const pillars = [
    {
      icon: Binary,
      title: "Aritmética Monetária Determinística",
      subtitle: "Zero imprecisão IEEE 754",
      description: "Em JavaScript, 0.1 + 0.2 = 0.30000000000000004. O AxiomLancer proíbe primitivos numéricos em moeda: todos os cálculos operam com decimal.js, arredondamento ROUND_HALF_UP e schema PostgreSQL DECIMAL(12,2).",
      tag: "PRECISÃO BANCÁRIA"
    },
    {
      icon: Database,
      title: "Idempotência Rigorosa & DeduplicationJournal",
      subtitle: "Zero disparos repetidos",
      description: "Toda intenção de cobrança, webhook PIX ou transição de estado registra uma chave SHA-256 imutável. Mesmo diante de re-execuções de jobs, instabilidades de rede ou clientes clicando duas vezes, cada ação é atômica e única.",
      tag: "RESILIENTE A FALHAS"
    },
    {
      icon: Zap,
      title: "Safe Mode em Tempo Real (< 12ms)",
      subtitle: "Trava atômica em memória",
      description: "Circuit Breaker atômico com switch transacional: quando acionado pelo usuário, todos os cronjobs, filas e webhooks são imediatamente pausados em menos de 12 milissegundos, evitando qualquer disparo não planejado.",
      tag: "CONTROLE TOTAL"
    },
    {
      icon: ShieldCheck,
      title: "Governança Constitucional @agente-core",
      subtitle: "Clean Architecture & Segurança Zod",
      description: "Inspirado na Constituição de Engenharia 7Keys: Fail Fast com contexto rico, validação na borda com esquemas Zod, isolamento de segredos em cookies HttpOnly com SameSite=Strict e conformidade nativa LGPD.",
      tag: "PADRÃO ENTERPRISE"
    }
  ];

  return (
    <section id="engenharia" className="py-24 bg-zinc-950 font-sans relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            ENGENHARIA SÊNIOR • STACK MODERNA
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Construído com os mesmos padrões de engenharia das grandes FinTechs.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Sem gambiarras. Sem arredondamentos que somem com centavos. Uma arquitetura concebida para quem entende e valoriza excelência técnica.
          </p>
        </div>

        {/* 4 Pillars Grid (Grade 8px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-700 text-zinc-400">
                  {pillar.tag}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400">{pillar.subtitle}</p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Code Snippet Comparison Terminal */}
        <div className="mt-12 rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 font-mono text-xs overflow-x-auto shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800 text-zinc-400">
            <span className="flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-emerald-400" />
              core/services/monetary.service.ts — Demonstração de Rigor Financeiro
            </span>
            <span className="text-emerald-400 text-[11px]">DECIMAL(12,2) • ROUND_HALF_UP</span>
          </div>
          <pre className="text-zinc-300 leading-relaxed">
            <span className="text-purple-400">import</span> {"{"} Decimal {"}"} <span className="text-purple-400">from</span> <span className="text-emerald-300">"decimal.js"</span>;{"\n\n"}
            <span className="text-zinc-500">// Configuração de padrão bancário determinístico</span>{"\n"}
            Decimal.set({"{"} precision: <span className="text-amber-400">20</span>, rounding: Decimal.ROUND_HALF_UP {"}"});{"\n\n"}
            <span className="text-purple-400">export class</span> <span className="text-yellow-400">MonetaryService</span> {"{"}{"\n"}
            {"  "}<span className="text-purple-400">static</span> calculateSplit(amount: <span className="text-blue-400">number</span>, taxRate: <span className="text-blue-400">number</span>) {"{"}{"\n"}
            {"    "}<span className="text-purple-400">const</span> decAmount = <span className="text-purple-400">new</span> Decimal(amount);{"\n"}
            {"    "}<span className="text-purple-400">const</span> decTax = decAmount.times(taxRate).toDecimalPlaces(<span className="text-amber-400">2</span>);{"\n"}
            {"    "}<span className="text-purple-400">const</span> netLiquid = decAmount.minus(decTax).toDecimalPlaces(<span className="text-amber-400">2</span>);{"\n"}
            {"    "}<span className="text-purple-400">return</span> {"{"} taxVault: decTax.toNumber(), netLiquid: netLiquid.toNumber() {"}"};{"\n"}
            {"  "}{"}"}{"\n"}
            {"}"}
          </pre>
        </div>
      </div>
    </section>
  );
}
