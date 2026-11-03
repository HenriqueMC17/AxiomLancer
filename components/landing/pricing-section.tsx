"use client";

import Link from "next/link";
import { Check, Zap, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const coreFeatures = [
    "Régua de cobrança autônoma ilimitada (D-3, D-0, D+3, D+7)",
    "Disparos via WhatsApp Bot, Email e SMS com tom adaptável",
    "PIX dinâmico com webhook e conciliação instantânea",
    "Previsio BI: Projeção de caixa em 30, 60 e 90 dias",
    "Split Tributário Automático (Simples Nacional Fator R)",
    "Safe Mode: Botão de Pânico com parada em < 12ms",
    "Smart Escrows com liberação vinculada a Deploy/PR",
    "Calculadora de Precificação da Hora Técnica e DRE",
    "DeduplicationJournal com idempotência atômica",
    "Suporte prioritário via WhatsApp direto com o time 7Keys"
  ];

  return (
    <section id="precos" className="py-24 bg-zinc-950 font-sans relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            PRECIFICAÇÃO TRANSPARENTE • ZERO SURPRESAS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Um valor fixo e justo. Sem fidelidade, sem pegadinhas.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            A infraestrutura financeira completa que se paga no primeiro cliente que você não precisou cobrar manualmente.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Main Core Plan (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border-2 border-emerald-500/40 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-emerald-950/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 font-mono font-bold text-[10px] uppercase tracking-wider py-1.5 px-6 rounded-bl-xl shadow-md">
              Mais Escolhido
            </div>

            <div className="space-y-6">
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs font-mono mb-2">
                  PLANO CORE ENTERPRISE
                </Badge>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono">R$ 49,90</span>
                  <span className="text-zinc-400 text-sm">/ mês</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  Cobrança mensal simplificada. Cancele a qualquer momento com 1 clique.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Tudo o que está incluído:
                </span>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  {coreFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link href="/login" className="block w-full">
                <Button
                  size="lg"
                  className="w-full text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-6 rounded-xl shadow-xl shadow-emerald-500/25 gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="h-4 w-4 fill-zinc-950" />
                  Ativar AxiomLancer Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="text-[11px] text-zinc-500 text-center font-mono mt-3">
                Garantia incondicional de 14 dias • Devolução sem burocracia
              </div>
            </div>
          </div>

          {/* Secondary Card: Take Rate on Recovered Invoices (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8 sm:p-10 backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="text-xs font-mono text-zinc-400 border-zinc-700 mb-2">
                  SUCCESS FEE PURO
                </Badge>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">5.00%</span>
                  <span className="text-zinc-400 text-xs">/ sobre faturas recuperadas</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Aplicado estritamente sobre inadimplências vencidas que o motor autônomo resgatar. Clientes que pagam em dia têm custo de R$ 0.
                </p>
              </div>

              {/* Comparison box */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 text-xs">
                <div className="font-semibold text-white">Como Funciona o Alinhamento:</div>
                <div className="space-y-2 text-zinc-300">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Cliente pagou na data? Você retém 100% do seu valor.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Cliente atrasou 15 dias e a régua recuperou? Retemos 5% do valor resgatado.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Se não recuperar, você não paga 1 centavo sequer pelo esforço.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                <div className="font-bold text-emerald-400">Zero Risco Financeiro</div>
                <p className="text-zinc-400 text-[11px]">
                  Nosso modelo incentiva a eficácia do algoritmo de recuperação de faturas perdidas.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 font-mono">
              Suporte a clientes PJ, MEI, EIRELI e Simples Nacional.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
