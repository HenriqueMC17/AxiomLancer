import { ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { HeroCaptureForm } from "./hero-capture-form";
import { TelemetryHudInteractive } from "./telemetry-hud-interactive";

/**
 * Pure Server Component (RSC) - Hero Section Enterprise
 * Diretrizes: Dark Mode Tri-Layer (#0D0D0D), Zero layout shift e tipografia tabular.
 */
export function HeroSection() {
  return (
    <section 
      id="hero"
      aria-labelledby="hero-title"
      className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0D0D0D]"
    >
      {/* Grid Blueprint Estático Sutil (Layer 0 Background) */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,#000_65%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Volumetric Glow Amber de Conversão */}
      <div 
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[340px] bg-[#FF9900]/10 blur-[130px] rounded-full z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        
        {/* Eyebrow Pill com Live Status */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] border border-white/8 text-xs font-mono mb-8 shadow-lg shadow-black/40">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9900] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9900]" />
          </span>
          <span className="text-neutral-300 tracking-wider uppercase text-[11px] font-semibold">
            Motor de Execução Financeira Autônoma
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-[#FF9900] font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" /> Latência 12ms
          </span>
        </div>

        {/* Headline de Alta Conversão (Direta, Afirmativa e Sem Pergunta Passiva) */}
        <h1 
          id="hero-title"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance mb-6"
        >
          Transforme código e design em dinheiro na conta.{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF9900] via-[#FFB84D] to-amber-200">
            Sem o constrangimento de cobrar clientes.
          </span>
        </h1>

        {/* Subtítulo de Alívio e Clareza Operacional */}
        <p className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10 text-pretty">
          A esteira autônoma que isola impostos no ato do pagamento, liquida via PIX/Boleto e despacha réguas preditivas corteses. Você entrega o trabalho; o robô garante o recebimento.
        </p>

        {/* Client Island: Formulário de Captura de Alta Intenção */}
        <div className="mb-8 flex flex-col items-center">
          <HeroCaptureForm />
        </div>

        {/* ICP Trust Signals & Risk Reversal */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-medium mb-14">
          <div className="flex items-center gap-1.5 min-h-[48px]">
            <CheckCircle2 className="w-4 h-4 text-[#FF9900] shrink-0" aria-hidden="true" />
            <span>Sem cartão de crédito no cadastro</span>
          </div>
          <div className="flex items-center gap-1.5 min-h-[48px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Setup funcional em 3 minutos</span>
          </div>
          <div className="flex items-center gap-1.5 min-h-[48px]">
            <CheckCircle2 className="w-4 h-4 text-[#FF9900] shrink-0" aria-hidden="true" />
            <span>Conexão nativa Asaas & Stripe</span>
          </div>
        </div>

        {/* Client Island: HUD de Telemetria Interativo (Liquid Glass L1/L2) */}
        <TelemetryHudInteractive />

      </div>
    </section>
  );
}