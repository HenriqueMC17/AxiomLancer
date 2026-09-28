"use client";

import { useState } from "react";
import { X, Receipt, CheckCircle2 } from "lucide-react";
import { LedgerEntry } from "@/lib/services/dashboard-data";

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExpense: (amount: number, description: string, category: string) => void;
}

export function CreateExpenseModal({
  isOpen,
  onClose,
  onCreateExpense,
}: CreateExpenseModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infraestrutura Cloud");
  const [amountStr, setAmountStr] = useState("1200");

  if (!isOpen) return null;

  const amount = parseFloat(amountStr) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    onCreateExpense(amount, description, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A0F1D] p-6 shadow-2xl relative font-mono text-xs">
        
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
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Registrar Despesa Operacional (OPEX)
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Lançamento automático de DÉBITO no Livro-Razão Contábil
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-neutral-300 font-medium mb-1">
              Descrição do Custo / Fornecedor *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Cluster AWS ECS & Bancos RDS"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-rose-500"
            >
              <option value="Infraestrutura Cloud">Infraestrutura Cloud (AWS, GCP, Vercel)</option>
              <option value="Softwares & SaaS">Assinaturas & Ferramentas SaaS</option>
              <option value="Subcontratação">Subcontratação & Especialistas</option>
              <option value="Marketing">Marketing & Aquisição</option>
              <option value="Operacional">Operacional Geral</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">
              Montante (R$) *
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0.01"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-[#101C33] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-rose-500 tabular-nums font-bold"
            />
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-[background-color,transform] active:scale-98"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Registrar no Ledger</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
