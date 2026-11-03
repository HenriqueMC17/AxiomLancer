"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Layers, 
  Receipt, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  GitPullRequest,
  Check,
  Percent,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function InteractiveBento() {
  // Bento 1: Autonomous Rules state
  const [selectedRuleStage, setSelectedRuleStage] = useState<"D-3" | "D-0" | "D+3" | "D+7">("D-0");

  // Bento 2: Panic Button state
  const [panicActive, setPanicActive] = useState(false);
  const [panicLatency, setPanicLatency] = useState(8.2);

  // Bento 3: Cashflow forecast period
  const [forecastPeriod, setForecastPeriod] = useState<30 | 60 | 90>(60);

  // Bento 4: Tax Split slider
  const [invoiceAmount, setInvoiceAmount] = useState<number>(15000);
  const taxAnexo3 = invoiceAmount * 0.06;
  const taxAnexo5 = invoiceAmount * 0.155;
  const taxSavings = taxAnexo5 - taxAnexo3;

  // Bento 5: Escrow milestone state
  const [escrowStatus, setEscrowStatus] = useState<"locked" | "approved">("locked");

  const rulesData = {
    "D-3": {
      tag: "D-3 • Cortesia Preventiva",
      tone: "Amigável & Cordial",
      preview: "Olá Carlos! Lembrando que a fatura do sprint atual vence em 3 dias. Segue o link com desconto de pontualidade de 2% disponível no PIX.",
      discount: "Desconto pontualidade ativado",
      action: "Disparo via WhatsApp Bot",
      journalHash: "dedup_d3_8f0a3e"
    },
    "D-0": {
      tag: "D-0 • Dia do Vencimento",
      tone: "Profissional & Executivo",
      preview: "Prezado Carlos, sua fatura #FAT-2026 vence hoje. Chave PIX Dinâmica com conciliação bancária imediata já está vinculada.",
      discount: "Valor nominal exato",
      action: "Disparo WhatsApp + Email + SMS",
      journalHash: "dedup_d0_4b1c99"
    },
    "D+3": {
      tag: "D+3 • Cobrança Assertiva",
      tone: "Direto & Objetivo",
      preview: "Aviso de pendência: A fatura #FAT-2026 encontra-se com 3 dias de atraso. Evite acréscimo de juros e mora atualizando via PIX.",
      discount: "Multa de 2% + Juros pro-rata",
      action: "Disparo com QR Code Atualizado",
      journalHash: "dedup_dp3_7a8d12"
    },
    "D+7": {
      tag: "D+7 • Notificação Formal",
      tone: "Jurídico & Extrajudicial",
      preview: "Notificação formal de inadimplência ref. prestação de serviços técnicos. Prazo limite de 48h antes de suspensão de acessos/servidores.",
      discount: "Encaminhado para recuperação ativa",
      action: "Notificação com registro de entrega",
      journalHash: "dedup_dp7_1e5f33"
    }
  };

  const handleTogglePanic = () => {
    const randomLatency = (Math.random() * 4 + 7).toFixed(1);
    setPanicLatency(parseFloat(randomLatency));
    setPanicActive(!panicActive);
  };

  return (
    <section id="bento-grid" className="py-24 bg-zinc-950 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            BENTO DEMO INTERATIVO • TESTE EM TEMPO REAL
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Cinco motores determinísticos trabalhando pelo seu caixa.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Esqueça softwares financeiros burocráticos e passivos. O AxiomLancer executa regras atômicas, protege suas finanças e nunca descansa.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* CARD 1: Autonomous Billing Engine (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Régua de Cobrança Autônoma</h3>
                    <p className="text-xs text-zinc-400">Máquina de estados determinística com idempotência estrita</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                  Zero Spam
                </Badge>
              </div>

              {/* Stage selector buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {(["D-3", "D-0", "D+3", "D+7"] as const).map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setSelectedRuleStage(stage)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                      selectedRuleStage === stage
                        ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800/60"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* Live Preview of stage */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">
                    {rulesData[selectedRuleStage].tag}
                  </span>
                  <span className="text-zinc-500">
                    Tom: {rulesData[selectedRuleStage].tone}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/60 text-xs text-zinc-200 leading-relaxed font-sans">
                  "{rulesData[selectedRuleStage].preview}"
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{rulesData[selectedRuleStage].action}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end text-zinc-500">
                    <span>Journal: {rulesData[selectedRuleStage].journalHash}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-800/80 text-xs text-zinc-400">
              <span>Evita cobranças duplicadas via <code>DeduplicationJournal</code></span>
              <span className="text-emerald-400 font-semibold font-mono">100% Determinístico</span>
            </div>
          </div>

          {/* CARD 2: Safe Mode Panic Button (5 cols) */}
          <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between transition-colors duration-300 ${
            panicActive 
              ? "bg-red-950/20 border-red-500/40 shadow-2xl shadow-red-950/30" 
              : "bg-zinc-900/50 border-zinc-800/80"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl transition-colors ${
                    panicActive ? "bg-red-500/20 text-red-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Safe Mode: Botão de Pânico</h3>
                    <p className="text-xs text-zinc-400">Interrupção atômica de disparos em &lt; 12ms</p>
                  </div>
                </div>
                <Badge className={`font-mono text-[10px] ${
                  panicActive 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}>
                  {panicActive ? "CONGELADO" : "STANDBY"}
                </Badge>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Fechou um acordo no almoço com o cliente ou precisa alinhar um detalhe antes de cobrar?
                Acione o Safe Mode para congelar imediatamente toda a esteira sem risco de mensagens indevidas.
              </p>

              {/* Interactive Panic Button */}
              <div className="pt-2 text-center">
                <Button
                  onClick={handleTogglePanic}
                  size="lg"
                  className={`w-full font-bold font-mono text-xs py-6 rounded-xl transition-all shadow-lg ${
                    panicActive
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 ring-2 ring-red-400"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                  }`}
                >
                  {panicActive ? "DESATIVAR TRAVA DE PÂNICO" : "TESTAR ACIONAMENTO DO MODO PÂNICO"}
                </Button>
              </div>

              {/* Telemetry Display */}
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Latência de Execução Medida:</span>
                  <span className={`font-bold ${panicActive ? "text-red-400" : "text-emerald-400"}`}>
                    {panicLatency}ms
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Status da Fila:</span>
                  <span className={panicActive ? "text-amber-400" : "text-zinc-400"}>
                    {panicActive ? "Workers Pausados (Memória Travada)" : "Fila Pronta (Consumo Normal)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500">
              Resposta garantida inferior a 12ms auditada em cada requisição.
            </div>
          </div>

          {/* CARD 3: Previsio BI & Risk Scoring (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Previsio BI & Risco</h3>
                    <p className="text-xs text-zinc-400">Projeção determinística de fluxo e inadimplência</p>
                  </div>
                </div>
                <div className="flex gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                  {([30, 60, 90] as const).map((days) => (
                    <button
                      key={days}
                      onClick={() => setForecastPeriod(days)}
                      className={`text-[10px] font-mono px-2 py-1 rounded ${
                        forecastPeriod === days
                          ? "bg-zinc-800 text-white font-bold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Projection Preview */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">Saldo Projetado ({forecastPeriod} dias):</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    {forecastPeriod === 30 && "R$ 28.840,00"}
                    {forecastPeriod === 60 && "R$ 54.120,00"}
                    {forecastPeriod === 90 && "R$ 79.950,00"}
                  </span>
                </div>

                {/* Simulated Risk Meter */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Risco Médio de Inadimplência:</span>
                    <span className="text-amber-400 font-semibold">14.8% (Baixo)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full w-[14.8%]" />
                  </div>
                </div>

                {/* Client risk breakdown preview */}
                <div className="text-[11px] space-y-1 pt-2 border-t border-zinc-800/80">
                  <div className="flex justify-between text-zinc-300">
                    <span>Agência Horizonte</span>
                    <span className="text-emerald-400 font-mono">Score A+ (0% atraso)</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Startup NovaTech</span>
                    <span className="text-amber-400 font-mono">Score C (Atraso típico 6d)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex justify-between">
              <span>Cruza Contas a Pagar x Faturas a Receber</span>
              <span className="text-cyan-400 font-mono">Previsão Contábil</span>
            </div>
          </div>

          {/* CARD 4: Split Tributário Automático no Cofre (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                    <Percent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Split Tributário Automático (Fator R)</h3>
                    <p className="text-xs text-zinc-400">Isola o imposto do Simples Nacional no exato instante do pagamento</p>
                  </div>
                </div>
                <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/30 text-xs font-mono">
                  Cofre Virtual DAS
                </Badge>
              </div>

              {/* Interactive Amount Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Simular Faturamento Mensal:</span>
                  <span className="text-white font-bold text-sm">
                    R$ {invoiceAmount.toLocaleString("pt-BR")},00
                  </span>
                </div>
                <Slider
                  value={[invoiceAmount]}
                  min={5000}
                  max={50000}
                  step={1000}
                  onValueChange={(val) => setInvoiceAmount(val[0])}
                  className="py-2"
                />
              </div>

              {/* Comparison Box: Anexo III vs Anexo V */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">Com AxiomLancer (Anexo III)</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Fator R &gt; 28%</Badge>
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    R$ {taxAnexo3.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-zinc-400">Apenas 6% de alíquota efetiva provisionada</p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Sem Fator R (Anexo V)</span>
                    <span className="text-red-400 text-[10px]">Alíquota 15.5%</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-zinc-400 line-through">
                    R$ {taxAnexo5.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    Economia de R$ {taxSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between">
              <span>Dinheiro do imposto nunca se mistura com seu lucro pessoal</span>
              <span className="text-emerald-400 font-mono font-semibold">Zero Susto no DAS</span>
            </div>
          </div>

          {/* CARD 5: Smart Escrows & Deploy Gate (12 cols full width) */}
          <div className="lg:col-span-12 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <GitPullRequest className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Smart Escrows & Deploy Gate</h3>
                    <p className="text-xs text-zinc-400">Liberação automática de pagamento mediante entrega técnica auditada</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  O cliente deposita o valor da etapa em custódia segura. Assim que o PR for aprovado ou o deploy em staging/produção for verificado, o AxiomLancer liquida o valor via PIX direto para você.
                </p>
              </div>

              {/* Interactive Escrow Simulator */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 min-w-[300px] sm:min-w-[360px] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Marco: Deploy v2.0 (Vercel)</span>
                  <Badge className={escrowStatus === "approved" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-purple-500/20 text-purple-300 border-purple-500/30"}>
                    {escrowStatus === "approved" ? "LIBERADO" : "CUSTODIADO"}
                  </Badge>
                </div>
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-zinc-400 text-xs">Valor em Escrow:</span>
                  <span className="text-lg font-bold text-white">R$ 8.000,00</span>
                </div>

                <Button
                  onClick={() => setEscrowStatus(escrowStatus === "locked" ? "approved" : "locked")}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs font-mono border-zinc-700 hover:border-emerald-500 text-zinc-200 gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {escrowStatus === "locked" ? "Simular Aprovação de Deploy" : "Resetar Simulação de Custódia"}
                </Button>

                <div className="text-[11px] text-zinc-500 text-center font-mono">
                  {escrowStatus === "approved" ? "PIX creditado com taxa zero para o desenvolvedor" : "Aguardando webhook do GitHub/Vercel"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
