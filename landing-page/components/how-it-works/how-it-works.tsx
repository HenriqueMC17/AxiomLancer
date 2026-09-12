import { Link2, FileCheck2, Zap, ArrowRight, ShieldCheck } from "lucide-react";

/**
 * Pure Server Component (RSC) - How It Works in 3 Steps
 * Enriched with operational pipeline telemetry badges and connecting architecture.
 */
export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Link2,
      badge: "Integração em 2 min",
      telemetry: "API: CONNECTED",
      title: "Conecte seu Gateway",
      desc: "Vincule suas credenciais da Stripe ou Asaas via chaves de API restritas. Não precisa abrir nova conta bancária nem migrar de banco.",
    },
    {
      num: "02",
      icon: FileCheck2,
      badge: "Régua & Milestones",
      telemetry: "QUEUE: ARMED",
      title: "Cadastre seus Contratos",
      desc: "Defina marcos de entrega de código ou honorários recorrentes. O sistema provisiona tributos (Simples/MEI) e agenda a régua preditiva.",
    },
    {
      num: "03",
      icon: Zap,
      badge: "Liquidação Instantânea",
      telemetry: "LATÊNCIA: 280ms",
      title: "Trabalhe em Paz",
      desc: "O robô cuida de lembrar os clientes com educação corporativa, concilia os pagamentos via webhooks e avisa você no momento em que o dinheiro cai.",
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-dark-l1/40 border-y border-white/5 relative scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
            SIMPLICIDADE OPERACIONAL
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">
            Como funciona em 3 passos simples
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Configuração rápida pensada para não tomar nem 5 minutos da sua rotina de desenvolvimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="rounded-2xl border border-white/10 bg-dark-l1 p-7 relative flex flex-col justify-between shadow-xl hover:border-emerald-500/30 transition-[border-color,transform] duration-150 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      PASSO {step.num}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-white/5 border border-white/8">
                      {step.telemetry}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#0F1E36] border border-blue-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white font-sans mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>{step.badge}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote callout */}
        <div className="mt-12 text-center">
          <span className="text-xs font-mono text-neutral-500 inline-flex items-center gap-2">
            ● Sem burocracia bancária: você continua recebendo diretamente na sua conta corrente habitual
          </span>
        </div>

      </div>
    </section>
  );
}