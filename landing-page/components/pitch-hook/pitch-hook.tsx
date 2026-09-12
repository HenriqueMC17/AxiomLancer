/**
 * Pure Server Component (RSC) - Pitch Hook Section
 * Highlights the mandatory strategic value proposition and contrast model.
 */
export function PitchHook() {
  return (
    <section id="esteira-ativa" className="py-24 border-y border-white/10 bg-[#1A1A1A]/80 relative scroll-mt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#2E7D32]">
          A GRANDE VIRADA OPERACIONAL
        </span>

        {/* Pitch Hook Obrigatório */}
        <blockquote className="mt-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-snug text-balance">
          &ldquo;Transformamos a contabilidade passiva em uma Esteira de Execução Ativa. O AxiomLancer não é apenas um relatório bonito; é o motor de software que executa suas cobranças de forma profissional.&rdquo;
        </blockquote>

        <p className="mt-6 max-w-2xl mx-auto text-base text-neutral-400">
          Enquanto outros sistemas esperam você fazer login para exibir gráficos vermelhos de faturas atrasadas, o AxiomLancer age de forma autônoma antes que o atraso aconteça.
        </p>

        {/* Matriz Comparativa CRO */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          <div className="rounded-2xl border border-red-500/20 bg-[#0D0D0D] p-7">
            <h4 className="font-bold text-red-400 flex items-center gap-2 text-base">
              <span>✕</span> O Jeito Passivo (Planilhas & Dashboards Antigos)
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Mostra que o cliente atrasou apenas depois de 15 dias de vencido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Exige importação manual de arquivos OFX e conferência linha por linha.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Obriga você a mandar mensagens tímidas no WhatsApp pessoal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Mistura receita bruta com tributos, iludindo seu saldo de caixa.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#2E7D32]/40 bg-[#0D0D0D] p-7 shadow-xl shadow-[#2E7D32]/5">
            <h4 className="font-bold text-[#2E7D32] flex items-center gap-2 text-base">
              <span>✓</span> A Esteira Ativa (Motor AxiomLancer)
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm text-neutral-200">
              <li className="flex items-start gap-2">
                <span className="text-[#2E7D32] font-bold">✓</span>
                <span>Dispara avisos corteses em D-3 com link direto de PIX e QR Code dinâmico.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2E7D32] font-bold">✓</span>
                <span>Baixa imediata em tempo real via Webhooks Asaas e Stripe (zero extratos).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2E7D32] font-bold">✓</span>
                <span>Régua corporativa neutra em nome da plataforma, com Botão de Pânico.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2E7D32] font-bold">✓</span>
                <span>Split automático de impostos e alerta preventivo de teto de gastos (OPEX).</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}