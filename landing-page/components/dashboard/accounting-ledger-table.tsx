"use client";

import { useState } from "react";
import { LedgerEntry } from "@/lib/services/dashboard-data";
import { BookOpen, Layers, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface AccountingLedgerTableProps {
  entries: LedgerEntry[];
}

export function AccountingLedgerTable({ entries }: AccountingLedgerTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (selectedCategory === "ALL") return true;
    return e.accountCategory === selectedCategory;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "ASSET":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Ativo (ASSET)
          </span>
        );
      case "TAX_RESERVE":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Reserva Fiscal (TAX)
          </span>
        );
      case "EXPENSE":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Despesa (OPEX)
          </span>
        );
      case "REVENUE":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Receita (REV)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
            {cat}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#101C33]/90 backdrop-blur-md shadow-xl overflow-hidden">
      
      {/* Header com Filtros */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Livro-Razão Contábil (Core Fact Ledger)</span>
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
              Partidas Dobradas ACID
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Registro imutável de lançamentos de débito e crédito com rastreabilidade de correlação
          </p>
        </div>

        {/* Filtros por Categoria Contábil */}
        <div className="flex flex-wrap items-center bg-[#0A0F1D] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-neutral-400 ml-2 mr-1" />
          {[
            { id: "ALL", label: "Todas" },
            { id: "ASSET", label: "Ativo" },
            { id: "TAX_RESERVE", label: "Cofre Fiscal" },
            { id: "EXPENSE", label: "Despesas" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded-md text-[11px] transition-[background-color,color] duration-150 ${
                selectedCategory === cat.id
                  ? "bg-trust-navy text-white font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela do Livro-Razão */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0A0F1D]/80 border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 font-semibold">Data / Lançamento</th>
              <th className="py-3 px-4 font-semibold">Descrição da Transação</th>
              <th className="py-3 px-4 font-semibold text-center">Conta Contábil</th>
              <th className="py-3 px-4 font-semibold text-center">Tipo</th>
              <th className="py-3 px-4 font-semibold text-right">Montante</th>
              <th className="py-3 px-4 font-semibold text-right">Saldo Resultante</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-neutral-300">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">
                  Nenhum lançamento registrado para esta conta.
                </td>
              </tr>
            ) : (
              filteredEntries.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-white/2 transition-[background-color] duration-100"
                >
                  {/* Data / ID */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-white font-medium">{formatDateTime(tx.transactionDate)}</div>
                    <div className="text-[10px] text-neutral-500">{tx.id}</div>
                  </td>

                  {/* Descrição & Correlação */}
                  <td className="py-3 px-4">
                    <div className="text-white font-medium">{tx.description}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      Ref: {tx.correlationId}
                    </div>
                  </td>

                  {/* Conta Contábil */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getCategoryBadge(tx.accountCategory)}
                  </td>

                  {/* Tipo (Débito / Crédito) */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {tx.entryType === "CREDIT" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <ArrowDownLeft className="w-3 h-3" />
                        CRÉDITO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                        <ArrowUpRight className="w-3 h-3" />
                        DÉBITO
                      </span>
                    )}
                  </td>

                  {/* Montante */}
                  <td
                    className={`py-3 px-4 text-right font-bold tabular-nums whitespace-nowrap ${
                      tx.entryType === "CREDIT" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {tx.entryType === "CREDIT" ? "+" : "-"}
                    {formatBRL(tx.amount)}
                  </td>

                  {/* Saldo Resultante */}
                  <td className="py-3 px-4 text-right font-mono text-white font-bold tabular-nums whitespace-nowrap">
                    {formatBRL(tx.balanceAfter)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
