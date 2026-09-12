import { Clock, TrendingDown, MessageSquareX } from "lucide-react";

/**
 * Pure Server Component (RSC) - Pain Points / Agitation Section
 * Directly addresses the 3 silent killers of solopreneurs and microagencies.
 */
export function PainPoints() {
  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-red-400">
            A REALIDADE DO EXÉRCITO DE UM HOMEM SÓ
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A rotina invisível que drena as suas horas mais caras.
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Você estudou anos para ser um excelente desenvolvedor ou designer. Por que passa as sextas-feiras fazendo papel de cobrador amador?
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: 15h Perdidas */}
          <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">10 a 15 Horas Não Faturáveis</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Emitir boletos avulsos, conferir extratos no banco, checar se o PIX caiu, reenviar links... No fim do mês, são até 15 horas semanais jogadas no lixo em tarefas que não geram 1 centavo de receita.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-xs text-red-400">
              Prejuízo médio: R$ 6.000+/mês em tempo técnico perdido
            </div>
          </div>

          {/* Card 2: Margens Corroídas */}
          <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">Margens Corroídas por Impostos</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Entraram R$ 20.000 na conta jurídica e você achou que o mês foi incrível. Mas sem provisionar a alíquota do Simples Nacional ou ISS no ato, a guia chega com juros e destrói sua precificação real.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-xs text-amber-400">
              Risco: Precificação ilusória e multas fiscais retroativas
            </div>
          </div>

          {/* Card 3: Constrangimento */}
          <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <MessageSquareX className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">O Constrangimento da Cobrança</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                &ldquo;Oi, tudo bem? Desculpa incomodar, conseguiu ver o pagamento?&rdquo;. Cobrar clientes manualmente desgasta o relacionamento, passa sensação de amadorismo e incentiva atrasos recorrentes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-xs text-blue-400">
              Impacto: Perda de autoridade e desgaste emocional crônico
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}