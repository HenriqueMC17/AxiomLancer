"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function FaqSection() {
  const faqs = [
    {
      question: "Como o AxiomLancer cobra meus clientes sem parecer agressivo ou spam?",
      answer: "A régua autônoma foi redigida por especialistas em negociação executiva e psicologia comportamental. Ela adota uma curva progressiva: inicia com lembretes cordiais e benefícios de pontualidade em D-3 e D-0, passando para alertas pontuais em D+3 e escalando para avisos formais com registros de entrega somente se houver inadimplência prolongada (D+7). Cada mensagem é personalizada com o nome do cliente, serviço prestado e chave PIX de conciliação imediata."
    },
    {
      question: "O que acontece se eu precisar congelar uma cobrança de última hora?",
      answer: "Você aciona o Safe Mode (Botão de Pânico). Desenvolvido com resposta em memória garantida inferior a 12ms, o botão interrompe imediatamente todas as filas assíncronas, webhooks e cronjobs em execução para aquele cliente ou para toda a sua conta. Se você estiver almoçando com o cliente e ele prometer o pagamento para o dia seguinte, com um toque no celular tudo fica congelado."
    },
    {
      question: "Como funciona o Split Tributário do Simples Nacional (Fator R)?",
      answer: "Ao faturar um projeto, o motor calcula a alíquota exata da sua empresa considerando a proporção da folha de pagamento/pró-labore sobre o faturamento (Fator R, conforme a LC 123/2006). Em vez de deixar todo o montante na sua conta corrente para ser gasto por impulso, o AxiomLancer calcula e reserva a cota do DAS em um cofre virtual. No dia do vencimento do imposto, você tem exatamente o valor necessário."
    },
    {
      question: "Quando o Take Rate de 5.00% é cobrado?",
      answer: "O Take Rate de 5% é estritamente um Success Fee de Recuperação. Ele só incide sobre faturas vencidas e em atraso que foram ativamente recuperadas pelo motor de cobrança da plataforma. Em faturas ordinárias pagas em dia ou dentro do prazo regular, a taxa é de 0,00%, sendo coberta exclusivamente pela sua assinatura Core de R$ 49,90/mês."
    },
    {
      question: "Preciso abrir uma nova conta bancária para receber via PIX?",
      answer: "Não! O AxiomLancer se integra à sua conta jurídica (PJ) ou física (PF) existente através de APIs bancárias e PIX dinâmico (Banco do Brasil, Inter, Nubank, Itaú, Cora, etc.). Os pagamentos caem instantaneamente na sua conta de costume, e a plataforma apenas detecta a liquidação via webhook seguro para atualizar o saldo e dar baixa na fatura."
    },
    {
      question: "Existe contrato de fidelidade ou período mínimo de permanência?",
      answer: "Nenhum. Acreditamos que você deve continuar usando o AxiomLancer porque ele economiza seu tempo e recupera seu dinheiro, não por uma cláusula contratual punitiva. Você pode pausar ou cancelar sua assinatura a qualquer momento com um único clique no painel de configurações."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-zinc-950 font-sans relative border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            DÚVIDAS FREQUENTES • TRANSPARÊNCIA TOTAL
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Perguntas & Respostas
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Tudo o que você precisa saber sobre a segurança, funcionamento e tecnologia do AxiomLancer.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-zinc-800/80 px-2 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-white hover:text-emerald-400 transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-zinc-300 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
