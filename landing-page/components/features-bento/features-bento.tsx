import { 
  Layers, 
  BellRing, 
  Vault, 
  TrendingUp, 
  RefreshCw, 
  PauseCircle, 
  CheckCircle2, 
  Lock 
} from "lucide-react";
import { Glow } from "@/components/ui/glow";

const bentoItems = [
  {
    id: "smart-escrow",
    icon: Layers,
    title: "Smart Escrows & Liberação por Milestone",
    description:
      "Custódia bancária programada vinculada a marcos de entrega. O dinheiro do cliente fica retido com segurança e é liberado na sua conta assim que o deploy ou etapa de design for aprovada.",
    colSpan: "md:col-span-6",
    badge: "Smart Escrow",
    metric: "100% de proteção contra calote de entrega",
    color: "text-blue-400",
    bgAccent: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "preditive-sequence",
    icon: BellRing,
    title: "Régua de Cobrança Preditiva Multicanal",
    description:
      "Disparos automáticos elegantes em D-5, D-0 e D+2 via WhatsApp e E-mail. Faturas com QR Code PIX dinâmico que liquidam no mesmo instante sem taxa de boleto.",
    colSpan: "md:col-span-6",
    badge: "Redis & BullMQ",
    metric: "-42% de inadimplência média",
    color: "text-emerald-400",
    bgAccent: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "tax-vault",
    icon: Vault,
    title: "Split Tributário Automático no Recebimento",
    description:
      "Cálculo automático da alíquota (Simples Nacional, MEI ou ISS). Ao liquidar a fatura, o imposto é apartado em um cofre virtual para você nunca ser pego de surpresa pelo DAS.",
    colSpan: "md:col-span-4",
    badge: "Blindagem Fiscal",
    metric: "Zero surpresa no DAS/Darf",
    color: "text-amber-400",
    bgAccent: "bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "previsio-bi",
    icon: TrendingUp,
    title: "Previsio BI & Scoring de Recebíveis",
    description:
      "Modelagem preditiva de fluxo de caixa a 30, 60 e 90 dias. Algoritmo de risco que classifica a pontualidade do pagador com intervalo de confiança antes do vencimento.",
    colSpan: "md:col-span-4",
    badge: "Previsio BI Engine",
    metric: "96% de acurácia de caixa",
    color: "text-purple-400",
    bgAccent: "bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "instant-reconciliation",
    icon: RefreshCw,
    title: "Conciliação Bancária em Tempo Real",
    description:
      "Baixa automática em 280 milissegundos via webhooks criptografados do Asaas e Stripe. Elimine completamente a importação de extratos OFX e comprovantes manuais.",
    colSpan: "md:col-span-4",
    badge: "Webhooks 200 OK",
    metric: "Baixa média em 280ms",
    color: "text-cyan-400",
    bgAccent: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "panic-button-feature",
    icon: PauseCircle,
    title: "Botão de Pânico & Auditoria Contratual com IA",
    description:
      "Renegociando escopo? Congele a régua daquele cliente com 1 toque. O motor analisa o contrato e assegura que nenhuma cobrança indevida manche sua relação comercial.",
    colSpan: "md:col-span-12",
    badge: "Controle & Governança",
    metric: "Pausa em 12ms • Zero constrangimento",
    color: "text-emerald-400",
    bgAccent: "bg-emerald-500/10 border-emerald-500/20",
    isHighlight: true,
  },
];

/**
 * Pure Server Component (RSC) - Bento Grid of Core Features
 * Fully aligned with Previsio BI & Smart Escrow technical specifications.
 * Strict adherence to transition-all prohibition using explicit GPU-accelerated transforms.
 */
export function FeaturesBento() {
  return (
    <section id="funcionalidades" className="py-28 px-4 sm:px-6 lg:px-8 bg-dark-l0 relative scroll-mt-20 overflow-hidden">
      <Glow color="navy" size="lg" position="top-right" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3 block font-mono">
            ARQUITETURA DE EXECUÇÃO ATIVA
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance font-sans">
            O motor de software que cuida do seu caixa
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Seis pilares integrados para transformar a prestação de serviços técnicos em uma operação financeira determinística e sem atrito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {bentoItems.map((item) => (
            <div
              key={item.id}
              className={`${item.colSpan} p-8 rounded-2xl bg-dark-l1 border border-white/8 hover:border-emerald-500/40 hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-200 relative group overflow-hidden shadow-xl will-change-transform flex flex-col justify-between`}
              style={{ transform: "translate3d(0,0,0)" }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl border ${item.bgAccent} ${item.color}`}>
                    <item.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 font-sans flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.isHighlight && (
                    <span className="ai-cursor inline-block" aria-hidden="true" />
                  )}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Métrica Validada:</span>
                <span className="text-emerald-400 font-semibold">{item.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}