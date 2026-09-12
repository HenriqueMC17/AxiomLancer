import { Check, ShieldCheck, Zap, Building2, Sparkles } from "lucide-react";
import { copywriting } from "@/lib/content/copywriting";

/**
 * Pure Server Component (RSC) - Comparative 2-Tier Pricing Bento
 * Highlights the Freelancer Solo (Decoy / Anchor L2) and Microagência Plan.
 * Transparent transactional take rate explanation aligned with academic pitch.
 */
export function PricingBento() {
  const { pricing } = copywriting;

  return (
    <section id="precos" className="py-28 px-4 sm:px-6 lg:px-8 bg-dark-l0 scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3 block font-mono">
            {pricing.badge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 font-sans text-balance">
            {pricing.title}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {pricing.subtitle}
          </p>
        </div>

        {/* 2-Tier Comparative Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          
          {/* Plan 1: Freelancer Solo (Highlighted L2 Card) */}
          <div className="lg:col-span-6 rounded-3xl border border-emerald-500/40 bg-dark-l2 p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ transform: "translate3d(0,0,0)" }}>
            <div className="absolute top-0 right-0 bg-growth-emerald px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white rounded-bl-xl font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plano Mais Escolhido</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Para Solopreneurs & Devs PJ
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                Freelancer Solo
              </h3>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                A esteira autônoma completa para quem gerencia sua própria carreira e contratos sem assistente.
              </p>

              <div className="mt-6 flex items-baseline gap-1 border-b border-white/10 pb-6">
                <span className="text-5xl font-bold text-white tabular-nums tracking-tight font-sans">
                  R$ 49,90
                </span>
                <span className="text-sm text-neutral-400 font-mono">/mês</span>
                <span className="ml-3 text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Economia de até 15h/mês
                </span>
              </div>

              {/* Feature List */}
              <div className="mt-6 space-y-3">
                {[
                  "Faturamento ilimitado de PIX dinâmico e Boletos",
                  "Integração direta com Asaas e Stripe (Webhooks)",
                  "Conciliação bancária instantânea em 280ms",
                  "Régua de Cobrança Preditiva (D-5, D-0, D+2)",
                  "Botão de Pânico para congelamento em 1 clique",
                  "Provisionamento de tributos no ato (Simples/MEI)",
                  "Simulador de ROI e Previsio BI básico",
                  "1 Operador (Você no comando total)",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="#trial"
                className="w-full py-4 rounded-xl font-semibold text-sm text-center block bg-growth-emerald hover:bg-[#256629] text-white shadow-lg shadow-growth-emerald/25 transition-[background-color,transform] duration-150 active:scale-98 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Comece teste gratuito de 14 dias
              </a>
              <p className="mt-2 text-center text-[11px] text-neutral-400 font-mono">
                Sem cartão de crédito no cadastro • Cancele quando quiser
              </p>
            </div>
          </div>

          {/* Plan 2: Microagência / Studio (Layer 1 Card) */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-dark-l1 p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between" style={{ transform: "translate3d(0,0,0)" }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  Para Times Técnicos
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                Microagência / Studio
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Para estúdios e times de 2 a 8 pessoas que gerenciam múltiplos contratos, projetos simultâneos e metas de OPEX.
              </p>

              <div className="mt-6 flex items-baseline gap-1 border-b border-white/10 pb-6">
                <span className="text-5xl font-bold text-white tabular-nums tracking-tight font-sans">
                  R$ 129,90
                </span>
                <span className="text-sm text-neutral-400 font-mono">/mês</span>
                <span className="ml-3 text-[11px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  Até 5 Operadores
                </span>
              </div>

              {/* Feature List */}
              <div className="mt-6 space-y-3">
                {[
                  "Tudo incluído no plano Freelancer Solo",
                  "Até 5 operadores de equipe com níveis de permissão",
                  "Previsio BI Avançado com DRE Projetado a 90 dias",
                  "Scoring de Risco de Inadimplência do Pagador",
                  "Múltiplas contas bancárias e CNPJs integrados",
                  "OPEX Guardian (Monitor Preventivo de Teto de Gastos)",
                  "Exportação contábil pronta para seu contador",
                  "Suporte prioritário via WhatsApp com time técnico",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="#trial"
                className="w-full py-4 rounded-xl font-semibold text-sm text-center block bg-dark-l1 hover:bg-[#252525] text-white border border-white/15 transition-[background-color,border-color] duration-150 active:scale-98 outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Assinar Plano Microagência
              </a>
              <p className="mt-2 text-center text-[11px] text-neutral-500 font-mono">
                Faturamento unificado • Suporte para múltiplos CNPJs
              </p>
            </div>
          </div>

        </div>

        {/* Take Rate Transacional Explicado com Transparência */}
        <div className="rounded-2xl border border-white/10 bg-dark-l1 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              {pricing.takeRate.title}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-dark-l0 p-5 border border-white/5 text-left">
              <span className="font-bold text-white block text-sm">
                {pricing.takeRate.regular.title}
              </span>
              <span className="text-emerald-400 font-mono text-base font-bold mt-1 block">
                {pricing.takeRate.regular.rate}
              </span>
              <p className="mt-2 text-neutral-400 leading-relaxed">
                {pricing.takeRate.regular.desc}
              </p>
            </div>

            <div className="rounded-xl bg-dark-l0 p-5 border border-white/5 text-left">
              <span className="font-bold text-white block text-sm">
                {pricing.takeRate.recovered.title}
              </span>
              <span className="text-amber-400 font-mono text-base font-bold mt-1 block">
                {pricing.takeRate.recovered.rate}
              </span>
              <p className="mt-2 text-neutral-400 leading-relaxed">
                {pricing.takeRate.recovered.desc}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}