"use client";

import { Check, X, Minus, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComparisonTable() {
  const comparisonItems = [
    {
      feature: "Régua Ativa Autônoma (WhatsApp + PIX)",
      axiom: true,
      sheets: false,
      erps: "Parcial (Email passivo apenas)",
      detail: "Disparo autônomo com tom adaptável e conciliação bancária instantânea via webhook."
    },
    {
      feature: "Safe Mode: Botão de Pânico (< 12ms)",
      axiom: true,
      sheets: false,
      erps: false,
      detail: "Trava atômica em memória para congelar qualquer disparo com um clique."
    },
    {
      feature: "Split Tributário em Cofre Virtual (Fator R)",
      axiom: true,
      sheets: false,
      erps: false,
      detail: "Provisão instantânea da alíquota do Simples Nacional no exato segundo do pagamento."
    },
    {
      feature: "Previsio BI & Risco de Inadimplência",
      axiom: true,
      sheets: "Manual (complexo)",
      erps: "Parcial (relatório atrasado)",
      detail: "Cruzamento preditivo de faturas a receber com score histórico de pontualidade do cliente."
    },
    {
      feature: "Smart Escrows com Aprovação de Deploy",
      axiom: true,
      sheets: false,
      erps: false,
      detail: "Custódia de marco vinculada à entrega técnica (PR/Vercel) antes da liberação do saldo."
    },
    {
      feature: "Aritmética Monetária decimal.js",
      axiom: true,
      sheets: false,
      erps: "Variável",
      detail: "Eliminação total de erros de precisão flutuante em centavos e conciliação."
    },
    {
      feature: "Tempo Semanal Gasto na Gestão",
      axiom: "~ 15 minutos",
      sheets: "10 a 15 horas",
      erps: "4 a 6 horas",
      detail: "O motor cuida da execução, você só acompanha os alertas e aprovações."
    },
    {
      feature: "Investimento Mensal",
      axiom: "R$ 49,90/mês",
      sheets: "R$ 0 (mas custa R$ 3k em horas)",
      erps: "R$ 180 a R$ 450/mês",
      detail: "Preço acessível sem limite abusivo de emissões ou cobranças extras por usuário."
    }
  ];

  return (
    <section id="comparativo" className="py-24 bg-[#09090b] font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            COMPARAÇÃO TÉCNICA E OPERACIONAL
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Por que planilhas e ERPs antigos não resolvem sua vida?
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Planilhas exigem que você trabalhe para elas. ERPs corporativos são pesados, caros e burocráticos. O AxiomLancer é uma esteira de execução feita para criadores de software e design.
          </p>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-xs">
                  <th className="py-4 px-6 text-zinc-400">Recurso / Capacidade</th>
                  <th className="py-4 px-6 text-emerald-400 font-bold bg-emerald-500/10 border-x border-emerald-500/20">
                    AxiomLancer (7Keys)
                  </th>
                  <th className="py-4 px-6 text-zinc-400">Planilhas / Notion</th>
                  <th className="py-4 px-6 text-zinc-400">ERPs Tradicionais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {comparisonItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{item.feature}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{item.detail}</div>
                    </td>

                    {/* AxiomLancer Column */}
                    <td className="py-4 px-6 bg-emerald-500/5 border-x border-emerald-500/15 font-semibold text-emerald-300">
                      {typeof item.axiom === "boolean" ? (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <Check className="h-4 w-4 stroke-[3]" />
                          <span>Sim, nativo</span>
                        </div>
                      ) : (
                        <span className="font-mono text-emerald-400 font-bold">{item.axiom}</span>
                      )}
                    </td>

                    {/* Sheets Column */}
                    <td className="py-4 px-6 text-zinc-400">
                      {typeof item.sheets === "boolean" ? (
                        item.sheets ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-400/80">
                            <X className="h-4 w-4" />
                            <span>Não</span>
                          </div>
                        )
                      ) : (
                        <span>{item.sheets}</span>
                      )}
                    </td>

                    {/* ERPs Column */}
                    <td className="py-4 px-6 text-zinc-400">
                      {typeof item.erps === "boolean" ? (
                        item.erps ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-400/80">
                            <X className="h-4 w-4" />
                            <span>Não</span>
                          </div>
                        )
                      ) : (
                        <span>{item.erps}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
