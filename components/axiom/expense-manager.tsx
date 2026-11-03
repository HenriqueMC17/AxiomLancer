"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Wallet, Plus, Trash2, CheckCircle2, RefreshCw, TrendingDown,
  AlertCircle, Filter, X, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MonetaryService } from "@/core/services/monetary.service";

type ExpenseCategory = "INFRA" | "SAAS" | "CONTABILIDADE" | "EQUIPAMENTO" | "IMPOSTOS" | "OUTROS";
type ExpenseStatus = "PENDING" | "PAID" | "CANCELED";

interface ExpenseData {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  due_date: string;
  paid_at?: string;
  status: ExpenseStatus;
  is_fixed: boolean;
  created_at: string;
}

const CAT_LABELS: Record<ExpenseCategory, string> = {
  INFRA: "Infraestrutura",
  SAAS: "SaaS / Assinaturas",
  CONTABILIDADE: "Contabilidade",
  EQUIPAMENTO: "Equipamento",
  IMPOSTOS: "Impostos",
  OUTROS: "Outros",
};

const CAT_COLORS: Record<ExpenseCategory, string> = {
  INFRA: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  SAAS: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  CONTABILIDADE: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  EQUIPAMENTO: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  IMPOSTOS: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  OUTROS: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const STATUS_COLORS: Record<ExpenseStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CANCELED: "bg-zinc-700/40 text-zinc-500 border-zinc-600/30",
};

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELED: "Cancelado",
};

const emptyForm = {
  description: "",
  category: "OUTROS" as ExpenseCategory,
  amount: "",
  due_date: new Date().toISOString().split("T")[0],
  is_fixed: false,
};

export function ExpenseManager() {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<ExpenseCategory | "ALL">("ALL");

  async function fetchExpenses() {
    setLoading(true);
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data.expenses ?? []);
    } catch {
      toast.error("Erro ao carregar despesas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchExpenses(); }, []);

  const filtered = useMemo(() =>
    filterCat === "ALL" ? expenses : expenses.filter((e) => e.category === filterCat),
    [expenses, filterCat]
  );

  const totals = useMemo(() => {
    const fixas = expenses.filter((e) => e.is_fixed && e.status !== "CANCELED").reduce((s, e) => s + e.amount, 0);
    const variaveis = expenses.filter((e) => !e.is_fixed && e.status !== "CANCELED").reduce((s, e) => s + e.amount, 0);
    const pendentes = expenses.filter((e) => e.status === "PENDING").reduce((s, e) => s + e.amount, 0);
    return { fixas, variaveis, pendentes };
  }, [expenses]);

  async function handleAdd() {
    const amountNum = parseFloat(String(form.amount).replace(",", "."));
    if (!form.description || isNaN(amountNum) || amountNum <= 0 || !form.due_date) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: amountNum }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Erro ao adicionar despesa"); return; }
      setExpenses((prev) => [data.expense, ...prev]);
      setForm(emptyForm);
      setAddOpen(false);
      toast.success("Despesa adicionada!");
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid(expense: ExpenseData) {
    try {
      const res = await fetch("/api/expenses/" + expense.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID", paid_at: new Date().toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Erro ao atualizar"); return; }
      setExpenses((prev) => prev.map((e) => (e.id === expense.id ? data.expense : e)));
      toast.success("Despesa marcada como paga!");
    } catch {
      toast.error("Erro de conexao");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/expenses/" + id, { method: "DELETE" });
      if (!res.ok) { toast.error("Erro ao remover"); return; }
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setDeleteId(null);
      toast.success("Despesa removida");
    } catch {
      toast.error("Erro de conexao");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30">
            <TrendingDown className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Gestao de Despesas</h2>
            <p className="text-xs text-zinc-500">{expenses.length} despesas registradas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchExpenses} className="text-zinc-400 hover:text-white h-8 w-8 p-0">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-500 text-white gap-1.5 h-8 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-rose-400" /> Adicionar Despesa
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Descricao</Label>
                  <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Ex: Servidor AWS EC2" className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 h-10 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Categoria</Label>
                    <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ExpenseCategory }))}>
                      <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-white h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {(Object.keys(CAT_LABELS) as ExpenseCategory[]).map((k) => (
                          <SelectItem key={k} value={k} className="text-zinc-200 focus:bg-zinc-800">{CAT_LABELS[k]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Valor (R$)</Label>
                    <Input type="number" min="0" step="0.01" value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                      placeholder="0,00" className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 h-10 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Vencimento</Label>
                    <Input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                      className="bg-zinc-800/60 border-zinc-700 text-white focus-visible:border-emerald-500 h-10 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Tipo</Label>
                    <Select value={form.is_fixed ? "true" : "false"} onValueChange={(v) => setForm((f) => ({ ...f, is_fixed: v === "true" }))}>
                      <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-white h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="true" className="text-zinc-200 focus:bg-zinc-800">Fixa (mensal)</SelectItem>
                        <SelectItem value="false" className="text-zinc-200 focus:bg-zinc-800">Variavel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setAddOpen(false)} className="flex-1 text-zinc-400">Cancelar</Button>
                <Button onClick={handleAdd} disabled={saving} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white gap-1.5">
                  {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">Remover despesa?</DialogTitle></DialogHeader>
          <p className="text-sm text-zinc-400">Esta acao nao pode ser desfeita.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1 text-zinc-400">Cancelar</Button>
            <Button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Despesas Fixas / Mes", value: totals.fixas, color: "text-rose-400", icon: Wallet },
          { label: "Despesas Variaveis", value: totals.variaveis, color: "text-amber-400", icon: TrendingDown },
          { label: "Total Pendente", value: totals.pendentes, color: "text-zinc-300", icon: AlertCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{label}</span><Icon className="h-4 w-4 text-zinc-600" />
            </div>
            <div className={"text-xl font-mono font-bold " + color}>{MonetaryService.formatBRL(value)}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-xs text-zinc-500">Filtrar:</span>
        {(["ALL", ...Object.keys(CAT_LABELS)] as (ExpenseCategory | "ALL")[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={
              "text-[11px] px-2.5 py-1 rounded-full border transition-colors " +
              (filterCat === cat
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200")
            }
          >
            {cat === "ALL" ? "Todas" : CAT_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Expense list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma despesa encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((expense, i) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                <Card className={
                  "border-zinc-800 bg-zinc-900/40 " +
                  (expense.status === "PAID" ? "opacity-60" : "") +
                  (expense.status === "CANCELED" ? "opacity-40" : "")
                }>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white truncate">{expense.description}</span>
                          <Badge className={"text-[10px] border " + CAT_COLORS[expense.category]}>{CAT_LABELS[expense.category]}</Badge>
                          {expense.is_fixed && (
                            <Badge className="text-[10px] bg-zinc-700/50 text-zinc-400 border border-zinc-600/30">Fixa</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                          <span>Vence: {new Date(expense.due_date + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                          <Badge className={"text-[10px] border " + STATUS_COLORS[expense.status]}>{STATUS_LABELS[expense.status]}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-base text-white">{MonetaryService.formatBRL(expense.amount)}</span>
                        <div className="flex items-center gap-1">
                          {expense.status === "PENDING" && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(expense)}
                              className="h-7 w-7 p-0 text-emerald-500 hover:bg-emerald-950/30 hover:text-emerald-400" title="Marcar como pago">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(expense.id)}
                            className="h-7 w-7 p-0 text-zinc-600 hover:text-rose-400 hover:bg-rose-950/20">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}