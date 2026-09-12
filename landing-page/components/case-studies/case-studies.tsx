import { ArrowUpRight, CheckCircle2, Code2, Palette, Users } from "lucide-react";
import { CountUp } from "@/components/social-proof-grid/count-up";

const studies = [
  {
    icon: Code2,
    role: "Dev Full Stack PJ",
    title: "Lucas Silveira",
    subtitle: "Engenheiro de Software Autônomo",
    description:
      "Gastava todo fim de mês mandando mensagens no WhatsApp de clientes e me sentindo um pedinte. Com o AxiomLancer via Asaas, tudo chega em formato corporativo com QR Code PIX dinâmico.",
    metrics: [
      { label: "Tempo de Cobrança", value: "-85%", icon: ArrowUpRight },
      { label: "Inadimplência", value: "0.00%", icon: CheckCircle2 },
      { label: "Horas Salvas", value: "14h/sem", icon: ArrowUpRight },
    ],
    verifiedOutcome: "Faturas liquidadas em D-0 sem cobrança manual no WhatsApp",
  },
  {
    icon: Palette,
    role: "Brand & Product Designer",
    title: "Mariana Esteves",
    subtitle: "Designer Independente",
    description:
      "O Botão de Pânico é a melhor invenção já feita para freelancers. Quando um cliente pediu prazo no meio de um redesign, congelei a régua dele em 5 segundos sem travar os outros projetos.",
    metrics: [
      { label: "Projetos Ativos", value: "8", icon: ArrowUpRight },
      { label: "Uso Botão Pânico", value: "100% sob controle", icon: CheckCircle2 },
      { label: "Margem Preservada", value: "98.5%", icon: ArrowUpRight },
    ],
    verifiedOutcome: "Controle humano total preservando o relacionamento comercial",
  },
  {
    icon: Users,
    role: "Microagência Digital",
    title: "Rafael Mendonça",
    subtitle: "Fundador de Estúdio Tech",
    description:
      "Faturávamos R$ 40 mil e não entendíamos por que sobrava tão pouco lucro. O provisionamento automático de impostos e o alerta de OPEX salvaram nossa operação de tomar multas fiscais.",
    metrics: [
      { label: "Previsibilidade Caixa", value: "+92%", icon: ArrowUpRight },
      { label: "Economia Fiscal", value: "R$ 3.8K/mês", icon: CheckCircle2 },
      { label: "Retorno da Assinatura", value: "76x ROI", icon: ArrowUpRight },
    ],
    verifiedOutcome: "Separação rigorosa entre saldo bruto e receita líquida real",
  },
];

/**
 * Pure Server Component (RSC) - Case Studies & Social Proof
 */
export function CaseStudies() {
  return (
    <section id="estudos-de-caso" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D] scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3 block font-mono">
            RESULTADOS REAIS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Quem produz sem medo de cobrar
          </h2>
          <p className="mt-4 text-sm text-neutral-400 max-w-xl mx-auto">
            Histórias de quem trocou o constrangimento da cobrança manual pela certeza de ver o dinheiro cair na conta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {studies.map((study) => (
            <div
              key={study.title}
              className="p-8 rounded-2xl bg-[#1A1A1A] border border-white/8 hover:border-emerald-500/30 transition-[transform,border-color] duration-200 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {study.role}
                  </span>
                  <div className="p-2 rounded-lg bg-[#0F1E36] border border-blue-500/20 text-blue-400">
                    <study.icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white font-sans">{study.title}</h3>
                <p className="text-xs text-neutral-400 font-mono mb-4">{study.subtitle}</p>

                <p className="text-neutral-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{study.description}&rdquo;
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {study.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="p-2.5 rounded-xl bg-[#0D0D0D]/90 border border-white/5 text-center"
                    >
                      <div className="text-xs font-bold text-white tabular-nums tracking-tight font-sans">
                        <CountUp value={metric.value} />
                      </div>
                      <div className="text-[9px] text-neutral-400 font-mono uppercase tracking-wider mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8 flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="font-mono text-[11px] text-neutral-400">
                  {study.verifiedOutcome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}