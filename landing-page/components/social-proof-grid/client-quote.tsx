import { ShieldCheck } from "lucide-react";
import { BlueprintDivider } from "@/components/ui/blueprint-divider";

/**
 * Pure Server Component (RSC) - Editorial Testimonial
 */
export function ClientQuote() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/20 border-y border-white/8 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <BlueprintDivider variant="diamond" />

        <blockquote className="text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed tracking-tight text-balance mb-10 italic">
          &ldquo;O AxiomLancer eliminou completamente a dor de cabeça e o constrangimento de ficar cobrando faturas atrasadas no WhatsApp. O robô emite o PIX com cálculo de impostos e cobra no dia certo com tom corporativo neutro. Recuperei 12 horas por semana para codificar.&rdquo;
        </blockquote>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1A2B4C] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#2E7D32]/20">
              LS
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm font-sans">Lucas Silveira</p>
              <p className="text-xs text-neutral-400 font-mono">
                Engenheiro Full Stack PJ • Desenvolvedor Independente
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-neutral-700 font-mono">|</div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>0% de inadimplência nos últimos 12 meses</span>
          </div>
        </div>
      </div>
    </section>
  );
}