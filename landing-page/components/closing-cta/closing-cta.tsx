import { Calendar } from "lucide-react";

/**
 * Pure Server Component (RSC) - Closing CTA Section
 */
export function ClosingCta() {
  return (
    <section className="py-24 bg-[#0D0D0D] relative overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="rounded-3xl border border-emerald-500/30 bg-[#1A1A1A] p-8 sm:p-14 shadow-2xl relative">
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute inset-0 bg-radial from-[#2E7D32]/10 to-transparent blur-2xl" 
          />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
            Pare de financiar o fluxo de caixa dos outros com a sua própria saúde mental.
          </h2>

          <p className="mt-5 text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Junte-se a desenvolvedores, designers e donos de microagências que trocaram o desgaste da cobrança manual pela certeza de ver o dinheiro na conta no dia certo.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#trial"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#2E7D32] hover:bg-[#256629] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition-[background-color,transform] duration-150 active:scale-98 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Comece seu teste gratuito de 14 dias →
            </a>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-4 text-sm font-semibold text-neutral-300 transition-[background-color,border-color] duration-150 hover:bg-white/5 hover:border-white/30"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Agendar demonstração</span>
            </a>
          </div>

          <p className="mt-5 text-xs text-neutral-500 font-mono">
            Setup em 3 minutos • Sem cartão de crédito • Suporte pela engenharia 7Keys
          </p>
        </div>

      </div>
    </section>
  );
}