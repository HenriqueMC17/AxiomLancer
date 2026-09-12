import { CheckCircle2 } from "lucide-react";

const objections = [
  {
    title: "Meu cliente vai se sentir desconfortável com a cobrança do robô?",
    answer:
      "Não. As mensagens utilizam um padrão corporativo estritamente neutro e respeitoso, transmitindo a postura de uma empresa organizada. O cliente não sente cobrança pessoal, mas sim um aviso operacional com link direto de PIX para facilitar o pagamento.",
  },
  {
    title: "E se eu estiver renegociando o escopo com o cliente no WhatsApp?",
    answer:
      "Para isso existe o Botão de Pânico. Com 1 clique no painel daquele cliente, todo o agendamento de mensagens das filas BullMQ é congelado imediatamente, garantindo que o robô nunca cause uma gafe comercial.",
  },
  {
    title: "Preciso abrir uma conta nova em outro banco?",
    answer:
      "Não. O AxiomLancer conecta-se via credenciais criptografadas de API às suas contas habituais no Asaas ou na Stripe. O dinheiro recebido cai diretamente no seu domicílio bancário de costume.",
  },
  {
    title: "Como funciona o provisionamento automático de impostos?",
    answer:
      "Você define sua alíquota tributária média (ex: 6% do Simples Nacional ou MEI). A cada fatura emitida e paga, o sistema separa visualmente o valor do imposto no Cofre Fiscal, evitando sustos na guia do DAS.",
  },
  {
    title: "O que acontece ao final dos 14 dias de teste?",
    answer:
      "Não pedimos cartão de crédito para iniciar. Se ao final das duas semanas você não desejar continuar, sua conta simplesmente congela, sem cobranças indesejadas.",
  },
  {
    title: "Qual a segurança dos meus dados e faturamento?",
    answer:
      "Criptografia de ponta a ponta TLS 1.3 / AES-256, conformidade total com a LGPD e operações de filas assíncronas isoladas desenvolvidas pela engenharia da 7Keys.",
  },
];

/**
 * Pure Server Component (RSC) - FAQ & Friction Reduction
 */
export function ObjectionsMatrix() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]/30 border-t border-white/8 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 block font-mono">
            TIRA-DÚVIDAS & OBJEÇÕES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Tudo o que você precisa saber antes de iniciar o seu teste de 14 dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objections.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-[#1A1A1A] border border-white/8 space-y-3 shadow-lg shadow-black/30"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}