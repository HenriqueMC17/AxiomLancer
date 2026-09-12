import { CheckCircle2, ShieldCheck, Calendar } from "lucide-react";
import { LeadCaptureForm } from "./lead-capture-form";
import { TelemetryHud } from "./telemetry-hud";
import { Glow } from "@/components/ui/glow";

/**
 * Pure Server Component (RSC) - Hero Section
 * Mandatory headline, dual CTAs, risk reversal, and live telemetry preview.
 * Ambient lighting inspired by EcoVolt Glow engine.
 */
export function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0D0D0D]">
      {/* Ambient Lighting Volumétrica (EcoVolt Glow pattern) */}
      <Glow color="hybrid" size="xl" position="top-center" />
      <Glow color="emerald" size="md" position="top-right" />

      <div className="relative max-w-6xl mx-auto text-center z-10">
        
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-white/10 text-[#2E7D32] text-xs font-medium tracking-wide mb-8 shadow-xl shadow-black/60">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]" />
          </span>
          <span className="text-neutral-300 font-mono text-[11px] uppercase tracking-wider">
            GESTÃO FINANCEIRA AUTÔNOMA PARA FREELANCERS & MICROAGÊNCIAS
          </span>
        </div>

        {/* Headline Obrigatória */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance mb-6">
          Cansado de passar o final do mês correndo atrás de clientes atrasados sem saber quanto realmente vai entrar na conta?
        </h1>

        {/* Subtítulo de Conexão e Alívio Emocional */}
        <p className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-10 text-pretty">
          Deixe de ser o cobrador constrangido do seu próprio trabalho. O <strong className="text-white font-semibold">AxiomLancer</strong> é a esteira autônoma que calcula impostos, emite cobranças via PIX/Boleto e executa réguas preditivas inteligentes. Você programa, cria e entrega; o nosso robô garante que o dinheiro caia na sua conta.
        </p>

        {/* Primary Form CTA Island & Secondary Demo Action */}
        <div id="trial" className="mb-8 scroll-mt-28 flex flex-col items-center">
          <LeadCaptureForm />
          
          <div className="mt-4">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-[color] duration-150 py-1 border-b border-transparent hover:border-neutral-500"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ou prefere ver a plataforma guiada? Agendar demonstração</span>
            </a>
          </div>
        </div>

        {/* Micro-copy de Descompressão de Risco */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-medium mb-14">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" aria-hidden="true" />
            <span>Sem cartão de crédito no cadastro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
            <span>Setup em 3 minutos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" aria-hidden="true" />
            <span>Integrado com Asaas e Stripe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" aria-hidden="true" />
            <span>Cancele quando quiser</span>
          </div>
        </div>

        {/* Telemetria HUD Client Island com Liquid Glass e Preview do Motor */}
        <TelemetryHud />

      </div>
    </section>
  );
}