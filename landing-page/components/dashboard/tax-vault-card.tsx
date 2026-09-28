"use client";

import { Percent, ShieldCheck, Calendar, Info } from "lucide-react";

interface TaxVaultCardProps {
  taxBreakdown: {
    regime: string;
    effectiveRate: number;
    iss: number;
    pisCofins: number;
    irpjCsll: number;
    projectedDasAmount: number;
    dasDueDate: string;
  };
}

export function TaxVaultCard({ taxBreakdown }: TaxVaultCardProps) {
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#101C33]/90 backdrop-blur-md p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Cofre Virtual & Split Tributário
            </h3>
            <p className="text-[11px] font-mono text-neutral-400">
              Provisionamento autônomo retido no ato de cada pagamento
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
          {taxBreakdown.regime}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Saldo Retido no Cofre */}
        <div className="p-3.5 rounded-lg bg-[#0A0F1D] border border-white/5">
          <span className="text-xs font-mono text-neutral-400">Reserva Acumulada para o DAS</span>
          <div className="mt-1 text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {formatBRL(taxBreakdown.projectedDasAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>Vencimento da Guia:</span>
            <span className="text-white font-medium">{formatDate(taxBreakdown.dasDueDate)}</span>
          </div>
        </div>

        {/* Breakdown de Alíquotas */}
        <div className="p-3.5 rounded-lg bg-[#0A0F1D] border border-white/5 flex flex-col justify-between">
          <span className="text-xs font-mono text-neutral-400">Composição da Alíquota ({taxBreakdown.effectiveRate.toFixed(2)}%)</span>
          
          <div className="mt-2 space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between text-neutral-300">
              <span>ISS Municipal (Prestação Serviços):</span>
              <span className="text-white font-bold tabular-nums">{taxBreakdown.iss.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>PIS / COFINS Federal:</span>
              <span className="text-white font-bold tabular-nums">{taxBreakdown.pisCofins.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>IRPJ / CSLL / CPP:</span>
              <span className="text-white font-bold tabular-nums">{taxBreakdown.irpjCsll.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destaque de Governança */}
      <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-start gap-2 text-xs font-mono text-neutral-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          O Split Tributário do AxiomLancer garante que você nunca chegue ao dia 20 sem o montante exato do DAS em caixa. Sem surpresas ou juros da Receita Federal.
        </span>
      </div>
    </div>
  );
}
