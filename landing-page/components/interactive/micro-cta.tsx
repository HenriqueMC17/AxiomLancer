import Link from "next/link";
import { ArrowRight, Sparkles, Play, Shield } from "lucide-react";

interface MicroCtaProps {
  variant?: "trial" | "demo" | "guarantee";
  title?: string;
  description?: string;
}

/**
 * Pure Server Component (RSC) - Intermediate Micro CTA
 * Inspired by Safe-Finance MicroCTA pattern.
 * Placed strategically between heavy informational blocks to capture intent.
 */
export function MicroCta({
  variant = "trial",
  title,
  description,
}: MicroCtaProps) {
  const configs = {
    trial: {
      icon: Sparkles,
      title: title || "Pronto para recuperar até 15 horas da sua semana?",
      description:
        description || "Comece em 3 minutos. Sem cartão de crédito e sem fidelidade.",
      cta: "Comece seu teste de 14 dias grátis",
      href: "#trial",
      badge: "Teste de 14 Dias",
    },
    demo: {
      icon: Play,
      title: title || "Deseja ver a esteira funcionando na prática?",
      description:
        description || "Agende uma sessão técnica rápida com a equipe de engenharia da 7Keys.",
      cta: "Agendar demonstração guiada",
      href: "#demo",
      badge: "Tour Técnico",
    },
    guarantee: {
      icon: Shield,
      title: title || "Zero Constrangimento Garantido",
      description:
        description || "Com o Botão de Pânico, você suspende qualquer cobrança automática instantaneamente.",
      cta: "Blindar Meu Fluxo de Caixa",
      href: "#trial",
      badge: "Garantia Operacional",
    },
  };

  const current = configs[variant];
  const Icon = current.icon;

  return (
    <aside className="w-full py-12 bg-[#0D0D0D]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A]/80 p-8 text-center shadow-xl relative overflow-hidden backdrop-blur-md">
          
          <div className="w-10 h-10 rounded-xl bg-[#0F1E36] border border-blue-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
            {current.title}
          </h3>

          <p className="mt-2 text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            {current.description}
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href={current.href}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition-[background-color,transform] duration-150 active:scale-98 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>{current.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </aside>
  );
}