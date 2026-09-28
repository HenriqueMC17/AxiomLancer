"use client";

import { useState } from "react";
import { InvoiceItem } from "@/lib/services/dashboard-data";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  PlusCircle,
} from "lucide-react";

interface InvoicesTableProps {
  invoices: InvoiceItem[];
  onSettleInvoice: (invoiceId: string) => void;
  onOpenCreateInvoice: () => void;
}

export function InvoicesTable({
  invoices,
  onSettleInvoice,
  onOpenCreateInvoice,
}: InvoicesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "ISSUED" | "OVERDUE">("ALL");

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

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientTaxId.includes(searchTerm) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totals = filteredInvoices.reduce(
    (acc, inv) => {
      acc.gross += inv.grossAmount;
      acc.tax += inv.taxAmount;
      acc.net += inv.netAmount;
      return acc;
    },
    { gross: 0, tax: 0, net: 0 }
  );

  return (
    <div className="rounded-xl border border-white/10 bg-[#101C33]/90 backdrop-blur-md shadow-xl overflow-hidden">
      
      {/* Header com Filtros & Busca */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Gestão de Faturas & Recebíveis</span>
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              ({filteredInvoices.length} faturas)
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Split tributário automático e conciliação bancária determinística no ato do pagamento
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Campo de Busca */}
          <div className="relative min-w-50 sm:min-w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar cliente ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0F1D] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-hidden focus:border-emerald-500 transition-[border-color]"
            />
          </div>

          {/* Filtros de Status */}
          <div className="flex items-center bg-[#0A0F1D] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-neutral-400 ml-2 mr-1" />
            {(["ALL", "PAID", "ISSUED", "OVERDUE"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 rounded-md text-[11px] transition-[background-color,color] duration-150 ${
                  statusFilter === status
                    ? "bg-trust-navy text-white font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {status === "ALL" && "Todas"}
                {status === "PAID" && "Pagas"}
                {status === "ISSUED" && "Pendentes"}
                {status === "OVERDUE" && "Atrasadas"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-growth-emerald hover:bg-[#256629] text-white text-xs font-medium font-mono transition-[background-color] duration-150"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Emitir</span>
          </button>
        </div>
      </div>

      {/* Tabela de Faturas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0A0F1D]/80 border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 font-semibold">Fatura / Cliente</th>
              <th className="py-3 px-4 font-semibold">Vencimento</th>
              <th className="py-3 px-4 font-semibold text-right">Valor Bruto</th>
              <th className="py-3 px-4 font-semibold text-right">Split Fiscal (6%)</th>
              <th className="py-3 px-4 font-semibold text-right">Valor Líquido</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Ação</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-neutral-300">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500">
                  Nenhuma fatura encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-white/2 transition-[background-color] duration-100"
                >
                  {/* Fatura / Cliente */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{inv.clientName}</div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span className="text-emerald-400">{inv.id}</span>
                      <span>•</span>
                      <span>{inv.clientTaxId}</span>
                    </div>
                  </td>

                  {/* Vencimento */}
                  <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                    <div>{formatDate(inv.dueDate)}</div>
                    <div className="text-[10px] text-neutral-500">
                      {inv.paidAt ? `Pago em ${formatDate(inv.paidAt)}` : `Emitido ${formatDate(inv.issuedAt || "")}`}
                    </div>
                  </td>

                  {/* Valor Bruto */}
                  <td className="py-3.5 px-4 text-right font-bold text-white tabular-nums whitespace-nowrap">
                    {formatBRL(inv.grossAmount)}
                  </td>

                  {/* Split Fiscal */}
                  <td className="py-3.5 px-4 text-right text-sky-400 tabular-nums whitespace-nowrap">
                    {formatBRL(inv.taxAmount)}
                  </td>

                  {/* Valor Líquido */}
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-400 tabular-nums whitespace-nowrap">
                    {formatBRL(inv.netAmount)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {inv.status === "PAID" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Paga
                      </span>
                    )}
                    {inv.status === "ISSUED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        Pendente
                      </span>
                    )}
                    {inv.status === "OVERDUE" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Atrasada
                      </span>
                    )}
                    {inv.status === "DRAFT" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-500/10 text-neutral-300 border border-neutral-500/20">
                        Rascunho
                      </span>
                    )}
                  </td>

                  {/* Ação */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {inv.status !== "PAID" ? (
                      <button
                        type="button"
                        onClick={() => onSettleInvoice(inv.id)}
                        title="Simula a liquidação com split tributário no cofre virtual e partidas dobradas no Ledger"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-growth-emerald/20 hover:bg-growth-emerald border border-growth-emerald/40 text-emerald-300 hover:text-white transition-[background-color,color] duration-150 text-[11px]"
                      >
                        <DollarSign className="w-3 h-3" />
                        <span>Liquidar</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-500 italic">Liquidada</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Rodapé com Totais */}
          {filteredInvoices.length > 0 && (
            <tfoot className="bg-[#0A0F1D] border-t border-white/10 font-bold text-white text-[11px]">
              <tr>
                <td colSpan={2} className="py-3 px-4">
                  TOTALIZADOR (FILTRO ATUAL)
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-white">
                  {formatBRL(totals.gross)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-sky-400">
                  {formatBRL(totals.tax)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-emerald-400">
                  {formatBRL(totals.net)}
                </td>
                <td colSpan={2} className="py-3 px-4 text-neutral-400 text-center">
                  Partidas Dobradas Sincronizadas
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

    </div>
  );
}
