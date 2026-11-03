"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Users, Plus, Trash2, Edit3, Pause, Play, Star, RefreshCw, X, Check,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ToneOfVoice = "AMIGAVEL" | "FIRME" | "EXECUTIVO";

interface ClientData {
  id: string;
  legal_name: string;
  email: string;
  tone_of_voice: ToneOfVoice;
  billing_paused: boolean;
  payment_reliability_score: number;
  avg_payment_delay_days: number;
  created_at: string;
}

interface FormState {
  legal_name: string;
  email: string;
  tone_of_voice: ToneOfVoice;
}

const TONE_LABELS: Record<ToneOfVoice, string> = {
  AMIGAVEL: "Amigavel",
  FIRME: "Firme",
  EXECUTIVO: "Executivo",
};

const TONE_COLORS: Record<ToneOfVoice, string> = {
  AMIGAVEL: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  FIRME: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  EXECUTIVO: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: score + "%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={color + " h-full rounded-full"}
      />
    </div>
  );
}

// FIX: ClientForm definido FORA do ClientManager para evitar remount a cada keystroke.
// Recebe form e setForm como props -- identidade do componente e estavel entre renders.
interface ClientFormProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

function ClientForm({ form, setForm }: ClientFormProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Nome / Razao Social
        </Label>
        <Input
          autoFocus
          value={form.legal_name}
          onChange={(e) => setForm((f) => ({ ...f, legal_name: e.target.value }))}
          placeholder="Ex: Acme Corp Ltda"
          className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 h-10 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          E-mail Financeiro
        </Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="financeiro@empresa.com"
          className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 h-10 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Tom de Cobranca
        </Label>
        <Select
          value={form.tone_of_voice}
          onValueChange={(v) => setForm((f) => ({ ...f, tone_of_voice: v as ToneOfVoice }))}
        >
          <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-white h-10 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="AMIGAVEL" className="text-zinc-200 focus:bg-zinc-800">
              Amigavel - Para clientes fieis
            </SelectItem>
            <SelectItem value="FIRME" className="text-zinc-200 focus:bg-zinc-800">
              Firme - Para pagadores lentos
            </SelectItem>
            <SelectItem value="EXECUTIVO" className="text-zinc-200 focus:bg-zinc-800">
              Executivo - Para corporacoes
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

const emptyForm: FormState = { legal_name: "", email: "", tone_of_voice: "AMIGAVEL" };

export function ClientManager() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editClient, setEditClient] = useState<ClientData | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients ?? []);
    } catch {
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchClients(); }, []);

  async function handleAdd() {
    if (!form.legal_name || !form.email) {
      toast.error("Preencha todos os campos obrigatorios");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Erro ao adicionar cliente"); return; }
      setClients((prev) => [data.client, ...prev]);
      setForm(emptyForm);
      setAddOpen(false);
      toast.success("Cliente adicionado!");
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editClient) return;
    setSaving(true);
    try {
      const res = await fetch("/api/clients/" + editClient.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legal_name: form.legal_name,
          email: form.email,
          tone_of_voice: form.tone_of_voice,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Erro ao salvar"); return; }
      setClients((prev) => prev.map((c) => (c.id === editClient.id ? data.client : c)));
      setEditClient(null);
      toast.success("Cliente atualizado!");
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePause(client: ClientData) {
    try {
      const res = await fetch("/api/clients/" + client.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing_paused: !client.billing_paused }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Erro ao alterar status"); return; }
      setClients((prev) => prev.map((c) => (c.id === client.id ? data.client : c)));
      toast.success(data.client.billing_paused ? "Cobranca pausada para este cliente." : "Cobranca reativada!");
    } catch {
      toast.error("Erro de conexao");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/clients/" + id, { method: "DELETE" });
      if (!res.ok) { toast.error("Erro ao remover"); return; }
      setClients((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
      toast.success("Cliente removido");
    } catch {
      toast.error("Erro de conexao");
    }
  }

  function openEdit(client: ClientData) {
    setEditClient(client);
    setForm({ legal_name: client.legal_name, email: client.email, tone_of_voice: client.tone_of_voice });
  }

  function handleAddOpenChange(open: boolean) {
    setAddOpen(open);
    if (!open) setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Gestao de Clientes</h2>
            <p className="text-xs text-zinc-500">{clients.length} clientes cadastrados</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchClients} className="text-zinc-400 hover:text-white h-8 w-8 p-0">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Dialog: Adicionar */}
          <Dialog open={addOpen} onOpenChange={handleAddOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 h-8 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-emerald-400" /> Adicionar Cliente
                </DialogTitle>
              </DialogHeader>
              <ClientForm form={form} setForm={setForm} />
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setAddOpen(false)} className="flex-1 text-zinc-400">
                  Cancelar
                </Button>
                <Button onClick={handleAdd} disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5">
                  {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dialog: Editar */}
      <Dialog open={!!editClient} onOpenChange={(o) => !o && setEditClient(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-amber-400" /> Editar Cliente
            </DialogTitle>
          </DialogHeader>
          <ClientForm form={form} setForm={setForm} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditClient(null)} className="flex-1 text-zinc-400">
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={saving} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white gap-1.5">
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Atualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar exclusao */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Remover cliente?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">Esta acao nao pode ser desfeita. O cliente sera removido permanentemente.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1 text-zinc-400">Cancelar</Button>
            <Button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Client cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum cliente cadastrado ainda.</p>
          <p className="text-xs mt-1">Clique em &quot;Novo Cliente&quot; para comecar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {clients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <Card className={
                  "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors " +
                  (client.billing_paused ? "border-amber-500/30 bg-amber-950/10" : "")
                }>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-sm text-white font-semibold truncate">{client.legal_name}</CardTitle>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{client.email}</p>
                      </div>
                      <Badge className={"text-[10px] border " + TONE_COLORS[client.tone_of_voice]}>
                        {TONE_LABELS[client.tone_of_voice]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Star className="h-3 w-3" /> Confiabilidade
                        </span>
                        <span className={"font-mono font-bold " + scoreColor(client.payment_reliability_score)}>
                          {client.payment_reliability_score}%
                        </span>
                      </div>
                      <ScoreBar score={client.payment_reliability_score} />
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Atraso medio: <span className="text-zinc-300 font-mono">{client.avg_payment_delay_days}d</span>
                    </div>

                    {client.billing_paused && (
                      <Badge className="w-full justify-center text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Cobranca pausada
                      </Badge>
                    )}

                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => openEdit(client)}
                        className="flex-1 h-7 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1"
                      >
                        <Edit3 className="h-3 w-3" /> Editar
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => handleTogglePause(client)}
                        className={"flex-1 h-7 text-xs gap-1 " + (client.billing_paused ? "text-emerald-400 hover:bg-emerald-950/30" : "text-amber-400 hover:bg-amber-950/30")}
                      >
                        {client.billing_paused ? <><Play className="h-3 w-3" /> Reativar</> : <><Pause className="h-3 w-3" /> Pausar</>}
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setDeleteId(client.id)}
                        className="h-7 w-7 p-0 text-zinc-600 hover:text-rose-400 hover:bg-rose-950/20"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
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