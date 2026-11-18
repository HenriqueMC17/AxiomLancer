"use client";

import { useState, useTransition } from "react";
import { Star, Clock, CheckCircle, PlusCircle, Loader2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import type { CycleEvaluation, CycleTriggerType } from "@/core/domain/types";

// ─── Skeleton (CLS = 0) ───────────────────────────────────────────────────────
function CycleCardSkeleton() {
  return (
    <div className="h-[120px] w-full animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/40" />
  );
}

// ─── Score Badge ─────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 4.5 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : score >= 3.5 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    : score >= 2.5 ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
    : "bg-rose-500/10 text-rose-400 border-rose-500/30";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-mono font-bold ${color}`}>
      <Star size={12} className="fill-current" />
      {score.toFixed(2)}
    </span>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
        <CheckCircle size={12} /> Concluído
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
        <Clock size={12} /> Aguardando
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/50 px-2 py-0.5 text-xs font-medium text-zinc-400">
      Expirado
    </span>
  );
}

// ─── Trigger Label ───────────────────────────────────────────────────────────
function TriggerLabel({ type }: { type?: CycleTriggerType }) {
  const map: Record<CycleTriggerType, string> = {
    MILESTONE_10_PROJECTS: "10 Projetos",
    MONTHLY_30_DAYS: "Mensal (30 dias)",
    MANUAL: "Manual",
  };
  return <span className="text-xs text-zinc-400 font-mono">{type ? map[type] : "—"}</span>;
}

// ─── Dimension Bar ───────────────────────────────────────────────────────────
function DimensionBar({ label, value }: { label: string; value?: number }) {
  const pct = value ? (value / 5) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="font-medium font-mono text-zinc-200">{value?.toFixed(1) ?? "—"}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={5}
        />
      </div>
    </div>
  );
}

// ─── Cycle Card ──────────────────────────────────────────────────────────────
function CycleCard({ cycle }: { cycle: CycleEvaluation }) {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = cycle.status === "COMPLETED";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">{cycle.cycle_identifier}</p>
            <StatusBadge status={cycle.status} />
            <TriggerLabel type={cycle.trigger_type} />
          </div>
          {cycle.client_name && (
            <p className="mt-0.5 text-xs text-zinc-400">Cliente: {cycle.client_name}</p>
          )}
          <p className="mt-0.5 text-xs text-zinc-500 font-mono">
            {cycle.created_at ? new Date(cycle.created_at).toLocaleDateString("pt-BR") : "—"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {isCompleted && cycle.general_score > 0 && (
            <ScoreBadge score={cycle.general_score} />
          )}
          {!isCompleted && cycle.status === "PENDING" && cycle.invitation_token && (
            <a
              href={`/evaluate/cycle/${cycle.invitation_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              Ver link
            </a>
          )}
          {isCompleted && (
            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label="Expandir detalhes"
              className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 bg-zinc-800/40"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {expanded && isCompleted && (
        <div className="mt-5 space-y-4 border-t border-zinc-800 pt-5">
          <div className="grid gap-3">
            <DimensionBar label="Comunicação" value={cycle.score_communication} />
            <DimensionBar label="Proatividade" value={cycle.score_proactivity} />
            <DimensionBar label="Apresentação de Resultados" value={cycle.score_results} />
            <DimensionBar label="Entendimento da Dor" value={cycle.score_understanding} />
            <DimensionBar label="Atendimento à Demanda" value={cycle.score_demand_delivery} />
          </div>
          {cycle.comments && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Comentário</p>
              <p className="text-sm text-zinc-300">{cycle.comments}</p>
            </div>
          )}
          {cycle.completed_at && (
            <p className="text-right text-xs text-zinc-500 font-mono">
              Concluído em: {new Date(cycle.completed_at).toLocaleString("pt-BR")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Trigger Modal ───────────────────────────────────────────────────────────
function TriggerModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [clientId, setClientId] = useState("");
  const [trigger, setTrigger] = useState<CycleTriggerType>("MANUAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId.trim()) {
      setError("Identificador do cliente é obrigatório");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cycle-evaluations/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, trigger_type: trigger }),
      });
      const json = await res.json() as { success: boolean; message?: string };
      if (!res.ok) {
        setError(json.message ?? "Erro ao disparar ciclo");
        return;
      }
      onSuccess();
    } catch {
      setError("Falha de rede ao disparar convite");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl text-white">
        <h3 className="text-lg font-bold text-white">Disparar Avaliação de Ciclo</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Gera um ciclo de avaliação e convite por e-mail para o cliente.
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-2.5 text-xs text-rose-300">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              ID do Cliente *
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Ex: cli_acme ou cli_nexus"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Tipo de Gatilho
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as CycleTriggerType)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="MANUAL" className="bg-zinc-900">Manual (Solicitação Imediata)</option>
              <option value="MILESTONE_10_PROJECTS" className="bg-zinc-900">Marco de 10 Projetos Concluídos</option>
              <option value="MONTHLY_30_DAYS" className="bg-zinc-900">Mensal (30 dias de recorrência)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-600/20"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              Disparar Convite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────
interface CycleEvaluationsPanelProps {
  initialData?: CycleEvaluation[];
}

export function CycleEvaluationsPanel({ initialData }: CycleEvaluationsPanelProps) {
  const [cycles, setCycles] = useState<CycleEvaluation[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function fetchCycles() {
    setLoading(true);
    try {
      const res = await fetch("/api/cycle-evaluations");
      const json = await res.json() as { success: boolean; data: CycleEvaluation[] };
      if (json.success) setCycles(json.data);
    } finally {
      setLoading(false);
    }
  }

  useState(() => {
    if (!initialData) void fetchCycles();
  });

  const completed = cycles.filter((c) => c.status === "COMPLETED");
  const pending = cycles.filter((c) => c.status === "PENDING");
  const avgScore =
    completed.length > 0
      ? completed.reduce((sum, c) => sum + (c.general_score ?? 0), 0) / completed.length
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Avaliações de Ciclo</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Feedback qualitativo recorrente dos seus clientes com prova de autoridade
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <PlusCircle size={16} />
          Novo Ciclo
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total de Ciclos", value: cycles.length.toString(), color: "text-white" },
          { label: "Concluídos", value: completed.length.toString(), color: "text-emerald-400" },
          {
            label: "Score Médio",
            value: avgScore !== null ? avgScore.toFixed(2) : "—",
            color: "text-cyan-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm shadow-sm space-y-1">
            <p className="text-xs text-zinc-400 font-medium">{stat.label}</p>
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pending banner */}
      {pending.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-950/20 px-5 py-3 text-sm text-amber-300">
          <Clock size={16} className="shrink-0 text-amber-400 animate-pulse" />
          <span>
            <strong>{pending.length}</strong> avaliação{pending.length > 1 ? "ões" : ""} aguardando resposta do cliente.
          </span>
        </div>
      )}

      {/* Cycle list */}
      {loading || isPending ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <CycleCardSkeleton key={i} />)}
        </div>
      ) : cycles.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500">
          <Star size={32} className="mb-3 opacity-30" />
          <p className="text-sm font-medium text-zinc-400">Nenhuma avaliação de ciclo ainda.</p>
          <p className="text-xs">Dispare seu primeiro ciclo pelo botão acima.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cycles.map((c) => <CycleCard key={c.id} cycle={c} />)}
        </div>
      )}

      {/* Trigger Modal */}
      {showModal && (
        <TriggerModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            startTransition(() => void fetchCycles());
          }}
        />
      )}
    </div>
  );
}
