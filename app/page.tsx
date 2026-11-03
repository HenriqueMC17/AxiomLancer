import { Metadata } from "next";
import {
  LandingNavbar,
  HeroSection,
  InteractiveBento,
  RoiCalculator,
  EngineeringDeepDive,
  ComparisonTable,
  PricingSection,
  TestimonialsSection,
  FaqSection,
  LandingFooter,
} from "@/components/landing";

export const metadata: Metadata = {
  title: "AxiomLancer — Motor de Execução Financeira Autônoma & Cobrança Preditiva (7Keys)",
  description:
    "Plataforma SaaS FinTech para freelancers, desenvolvedores e microagências. Régua autônoma via PIX dinâmico, Previsio BI em 30/60/90 dias, cálculo de Fator R e Safe Mode em menos de 12ms.",
  keywords: [
    "AxiomLancer",
    "7Keys",
    "SaaS Financeiro",
    "Cobrança Autônoma",
    "PIX Dinâmico",
    "Freelancers",
    "Desenvolvedores",
    "Fator R",
    "Previsio BI",
    "Henrique Monteiro Cardoso"
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <LandingNavbar />
      <HeroSection />
      <div id="recursos" />
      <InteractiveBento />
      <RoiCalculator />
      <EngineeringDeepDive />
      <ComparisonTable />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <LandingFooter />
    </main>
  );
}
