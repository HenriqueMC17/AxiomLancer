"use client";

import { useState } from "react";
import { X, PlusCircle, Calculator, CheckCircle2 } from "lucide-react";
import { InvoiceItem } from "@/lib/services/dashboard-data";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (newInvoice: InvoiceItem) => void;
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
  onCreateInvoice,
}: CreateInvoiceModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientTaxId, setClientTaxId] = useState("");
  const [description, setDescription] = useState("");
  const [grossAmountStr, setGrossAmountStr] = useState("12000");
  const [taxRatePercent, setTaxRatePercent] = useState("6.00");
  const [dueDate, setDueDate] = useState("2026-10-15");

  if (!isOpen) return null;

  const gross = parseFloat(grossAmountStr) || 0;
  const rate = parseFloat(taxRatePercent) || 0;
  const taxAmount = Number(((gross * rate) / 100).toFixed(2));
  const netAmount = Number((gross - taxAmount).toFixed(2));

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || gross <= 0) return;

    const newInvoice: InvoiceItem = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      clientTaxId: clientTaxId || "00.000.000/0001-00",
      description: description || "Desenvolvimento de Software & Arquitetura",
      grossAmount: gross,
      taxAmount,
      netAmount,
      status: "ISSUED",
      dueDate,
      issuedAt: new Date().toISOString().split("T")[0],
      paidAt: null,
    };

    onCreateInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0F1D] p-6 shadow-2xl relative font-mono text-xs">
        
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-[color]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Título */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Emitir Nova Fatura & Régua Ativa
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Faturamento com Split Tributário automático e escrow de entrega
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-neutral-300 font-medium mb-1">
              Razão Social / Nome do Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Nubank Pagamentos S.A."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                CNPJ ou CPF do Tomador
              </label>
              <input
                type="text"
                placeholder="12.345.678/0001-90"
                value={clientTaxId}
                onChange={(e) => setClientTaxId(e.target.value)}
                className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">
              Descrição do Serviço / Milestone
            </label>
            <input
              type="text"
              placeholder="Ex: Sprint 03 - API de Cobrança e Gateway PIX"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Valor Bruto (R$) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="1"
                value={grossAmountStr}
                onChange={(e) => setGrossAmountStr(e.target.value)}
                className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500 tabular-nums font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Alíquota Fiscal (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(e.target.value)}
                className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-emerald-500 tabular-nums"
              />
            </div>
          </div>

          {/* Simulação em Tempo Real do Split */}
          <div className="p-3 rounded-lg bg-[#162644] border border-white/10 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-neutral-400 font-semibold mb-1">
              <Calculator className="w-3.5 h-3.5 text-sky-400" />
              <span>Simulação Automática do Split no Recebimento:</span>
            </div>
            
            <div className="flex justify-between text-neutral-300">
              <span>Valor Bruto da Fatura:</span>
              <span className="font-bold text-white tabular-nums">{formatBRL(gross)}</span>
            </div>
            
            <div className="flex justify-between text-sky-400">
              <span>Cofre Tributário Retido ({rate}%):</span>
              <span className="font-bold tabular-nums">-{formatBRL(taxAmount)}</span>
            </div>

            <div className="pt-1.5 border-t border-white/10 flex justify-between text-emerald-400 font-bold">
              <span>Líquido Direto na sua Conta:</span>
              <span className="text-sm tabular-nums">{formatBRL(netAmount)}</span>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-[#101C33] hover:bg-trust-navy text-neutral-300 transition-[background-color]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-growth-emerald hover:bg-[#256629] text-white font-semibold shadow-md shadow-emerald-950 transition-[background-color,transform] active:scale-98"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Emitir & Ativar Régua</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
