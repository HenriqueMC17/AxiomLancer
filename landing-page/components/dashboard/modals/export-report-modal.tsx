"use client";

import { useState } from "react";
import { X, Download, Printer, Copy, Check, FileSpreadsheet } from "lucide-react";
import { DashboardData } from "@/lib/services/dashboard-data";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DashboardData;
}

export function ExportReportModal({
  isOpen,
  onClose,
  data,
}: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { metrics, taxBreakdown } = data;
  const netRevenue = metrics.liquidatedRevenue - metrics.taxReserve;
  const netProfit = netRevenue - metrics.operationalExpenses;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ["DEMONSTRATIVO FINANCEIRO - AXIOM LANCER CORE", ""],
      ["Data de Emissão", new Date().toLocaleDateString("pt-BR")],
      ["Regime Tributário", taxBreakdown.regime],
      ["", ""],
      ["Item DRE", "Valor (R$)"],
      ["Receita Operacional Bruta", metrics.liquidatedRevenue.toFixed(2)],
      ["(-) Split Tributário Simples Nacional", (-metrics.taxReserve).toFixed(2)],
      ["(=) Receita Operacional Líquida", netRevenue.toFixed(2)],
      ["(-) Despesas Operacionais OPEX", (-metrics.operationalExpenses).toFixed(2)],
      ["(=) Lucro Líquido do Período", netProfit.toFixed(2)],
      ["", ""],
      ["Faturas Emitidas a Receber", metrics.receivables.toFixed(2)],
      ["Health Score Operacional", `${metrics.financialHealthScore}/100`],
    ]
      .map((row) => row.join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DRE_AxiomLancer_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const text = `=== DRE EXECUTIVO AXIOM LANCER ===
Receita Bruta: ${formatBRL(metrics.liquidatedRevenue)}
Split Tributário (6%): ${formatBRL(metrics.taxReserve)}
Receita Líquida: ${formatBRL(netRevenue)}
Despesas (OPEX): ${formatBRL(metrics.operationalExpenses)}
Lucro Líquido: ${formatBRL(netProfit)}
A Receber: ${formatBRL(metrics.receivables)}
Health Score: ${metrics.financialHealthScore}/100`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0F1D] p-6 shadow-2xl relative font-mono text-xs">
        
        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-[color]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Título */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Exportar DRE & Extrato Financeiro
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Demonstração de Resultado do Exercício com auditoria de partidas dobradas
            </p>
          </div>
        </div>

        {/* DRE Formatado */}
        <div className="rounded-xl border border-white/10 bg-[#101C33] p-4 space-y-2.5 text-xs">
          <div className="flex justify-between text-neutral-300">
            <span>Receita Bruta Faturada:</span>
            <span className="font-bold text-white tabular-nums">
              {formatBRL(metrics.liquidatedRevenue)}
            </span>
          </div>

          <div className="flex justify-between text-sky-400">
            <span>(-) Split Tributário Simples Nacional ({taxBreakdown.effectiveRate}%):</span>
            <span className="font-bold tabular-nums">
              -{formatBRL(metrics.taxReserve)}
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between text-neutral-200 font-semibold">
            <span>(=) Receita Operacional Líquida:</span>
            <span className="tabular-nums">{formatBRL(netRevenue)}</span>
          </div>

          <div className="flex justify-between text-rose-400">
            <span>(-) Despesas Operacionais (OPEX):</span>
            <span className="font-bold tabular-nums">
              -{formatBRL(metrics.operationalExpenses)}
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between text-emerald-400 font-bold text-sm bg-emerald-500/5 p-2 rounded-lg">
            <span>(=) Lucro Líquido Operacional:</span>
            <span className="tabular-nums">{formatBRL(netProfit)}</span>
          </div>
        </div>

        {/* Ações de Exportação */}
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#162644] hover:bg-[#1E3259] text-white transition-[background-color]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copiado!" : "Copiar"}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#162644] hover:bg-[#1E3259] text-white transition-[background-color]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-growth-emerald hover:bg-[#256629] text-white font-semibold transition-[background-color,transform] active:scale-98 shadow-md shadow-emerald-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </button>
        </div>

      </div>
    </div>
  );
}
