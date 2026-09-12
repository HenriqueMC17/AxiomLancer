import { TopBanner } from "@/components/navigation/top-banner";
import { Navbar } from "@/components/navigation/navbar";
import { HeroSection } from "@/components/hero-section/hero-section";
import { TrustedBy } from "@/components/social-proof-grid/trusted-by";
import { SocialProofGrid } from "@/components/social-proof-grid/social-proof-grid";
import { PainPoints } from "@/components/pain-points/pain-points";
import { PersonaSelector } from "@/components/interactive/persona-selector";
import { PitchHook } from "@/components/pitch-hook/pitch-hook";
import { MicroCta } from "@/components/interactive/micro-cta";
import { FeaturesBento } from "@/components/features-bento/features-bento";
import { RoiCalculator } from "@/components/roi-calculator/roi-calculator";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { PanicSandbox } from "@/components/panic-sandbox/panic-sandbox";
import { CaseStudies } from "@/components/case-studies/case-studies";
import { ClientQuote } from "@/components/social-proof-grid/client-quote";
import { PricingBento } from "@/components/pricing-bento/pricing-bento";
import { ObjectionsMatrix } from "@/components/objections-matrix/objections-matrix";
import { ClosingCta } from "@/components/closing-cta/closing-cta";
import { FooterSection } from "@/components/footer-section/footer-section";
import { Glow } from "@/components/ui/glow";

export const metadata = {
  title: "AxiomLancer | Gestão Financeira, Faturamento & Cobrança Autônoma",
  description:
    "Elimine o constrangimento de cobrar clientes. Faturamento automático com Asaas e Stripe, régua de cobrança preditiva e provisionamento de impostos para freelancers e microagências. Desenvolvido pela 7Keys.",
};

/**
 * Pure Server Component (RSC) - Landing Page Root
 * Assembles all layout slices with zero client JS overhead at the page root level.
 * Enhanced with patterns from Safe-Finance (Interactive Personas & Micro-CTAs) 
 * and EcoVolt (Volumetric Glow Lighting & Liquid Glass Depth).
 */
export default function LandingPage() {
  return (
    <>
      {/* Top Banner de Novidade */}
      <TopBanner />

      {/* Top Floating Navigation */}
      <Navbar />

      <main className="min-h-screen bg-dark-l0 text-white selection:bg-emerald-500/20 selection:text-emerald-400 overflow-x-hidden antialiased relative">
        {/* Layer 0 (Base): Grid Background pattern com radial spotlight */}
        <div 
          className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
          aria-hidden="true"
        />

        {/* 1. Hero Section com Headline Obrigatória, Duplo CTA e Telemetria HUD */}
        <HeroSection />

        {/* 2. Ecossistema & ICP ("Exército de um Homem Só") */}
        <TrustedBy />

        {/* 3. Métricas de Prova Social (80% menos tempo cobrando, -40% inadimplência) */}
        <SocialProofGrid />

        {/* 4. Agitação da Dor (As 15h perdidas, impostos corroendo margens, constrangimento) */}
        <PainPoints />

        {/* 5. Seletor Interativo de Perfis (Inspirado no Safe-Finance) */}
        <PersonaSelector />

        {/* 6. Pitch Hook ("Esteira de Execução Ativa vs. Relatório Bonito") */}
        <PitchHook />

        {/* 7. Micro-CTA Intermediário de Conversão (Inspirado no Safe-Finance) */}
        <MicroCta variant="trial" />

        {/* 8. Funcionalidades Core Bento com Ambient Glow (Inspirado no EcoVolt) */}
        <div className="relative overflow-hidden">
          <Glow color="navy" size="lg" position="top-right" />
          <FeaturesBento />
        </div>

        {/* 9. Simulador Interativo de ROI (Client Island com Sliders de Horas) */}
        <RoiCalculator />

        {/* 10. Como Funciona em 3 Passos */}
        <HowItWorks />

        {/* 11. Live Sandbox do Botão de Pânico & Régua Preditiva (Risk Reversal) */}
        <PanicSandbox />

        {/* 12. Estudos de Caso & Prova Social Qualificada */}
        <CaseStudies />

        {/* 13. Depoimento Editorial de Impacto */}
        <ClientQuote />

        {/* 14. Modelo de Monetização (Assinatura Core R$ 49,90 + Take Rate Transacional) */}
        <PricingBento />

        {/* 15. FAQ Estratégico & Tira-Dúvidas */}
        <ObjectionsMatrix />

        {/* 16. CTA de Fechamento com Risco Zero */}
        <ClosingCta />

        {/* 17. Rodapé Técnico 7Keys & Governança LGPD */}
        <FooterSection />
      </main>
    </>
  );
}