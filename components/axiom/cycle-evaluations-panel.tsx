"use client";

import { useState, useTransition } from "react";
import { Star, Clock, CheckCircle, PlusCircle, Loader2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import type { CycleEvaluation, CycleTriggerType } from "@/core/domain/types";

// ─── Skeleton (CLS = 0) ─────────────────────────────────────────────────────
function CycleCardSkeleton() {
  return (
    <div className="h-[120px] w-full animate-pulse rounded-2xl border border-zinc-100 bg-zinc-50" />
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 4.5 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : score >= 3.5 ? "bg-blue-100 text-blue-700 border-blue-200"
    : score >= 2.5 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-red-100 text-red-700 border-red-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold ${color}`}>
      <Star size={12} className="fill-current" />
      {score.toFixed(2)}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle size={12} /> Concluido
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        <Clock size={12} /> Aguardando
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-500">
      Expirado
    </span>
  );
}

// ─── Trigger Label ────────────────────────────────────────────────────────────
function TriggerLabel({ type }: { type?: CycleTriggerType }) {
  const map: Record<CycleTriggerType, string> = {
    MILESTONE_10_PROJECTS: "10 Projetos",
    MONTHLY_30_DAYS: "Mensal (30 dias)",
    MANUAL: "Manual",
  };
  return <span className="text-xs text-zinc-400">{type ? map[type] : "—"}</span>;
}

// ─── Dimension Bar ───────────────────────────────────────────────────────────
function DimensionBar({ label, value }: { label: string; value?: number }) {
  const pct = value ? (value / 5) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span className="font-medium">{value?.toFixed(1) ?? "—"}</span>
      </div>
      {/* Reserved height prevents CLS */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
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

// ─── Cycle Card ───────────────────────────────────────────────────────────────
function CycleCard({ cycle }: { cycle: CycleEvaluation }) {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = cycle.status === "COMPLETED";

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-zinc-800">{cycle.cycle_identifier}</p>
            <StatusBadge status={cycle.status} />
            <TriggerLabel type={cycle.trigger_type} />
          </div>
          {cycle.client_name && (
            <p className="mt-0.5 text-xs text-zinc-500">Cliente: {cycle.client_name}</p>
          )}
          <p className="mt-0.5 text-xs text-zinc-400">
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
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
            >
              Ver link
            </a>
          )}
          {isCompleted && (
            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label="Expandir detalhes"
              className="rounded-lg border border-zinc-100 p-1.5 text-zinc-400 hover:border-zinc-200 hover:text-zinc-600"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail — reserved height = auto, no CLS because toggled by user */}
      {expanded && isCompleted && (
        <div className="mt-5 space-y-4 border-t border-zinc-50 pt-5">
          <div className="grid gap-3">
            <DimensionBar label="Comunicacao" value={cycle.score_communication} />
            <DimensionBar label="Proatividade" value={cycle.score_proactivity} />
            <DimensionBar label="Apresentacao de Resultados" value={cycle.score_results} />
            <DimensionBar label="Entendimento da Dor" value={cycle.score_understanding} />
            <DimensionBar label="Atendimento a Demanda" value={cycle.score_demand_delivery} />
          </div>
          {cycle.comments && (
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Comentario</p>
              <p className="text-sm text-zinc-700">{cycle.comments}</p>
            </div>
          )}
          {cycle.completed_at && (
            <p className="text-right text-xs text-zinc-400">
              Concluido em: {new Date(cycle.completed_at).toLocaleString("pt-BR")}
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
    if (!clientId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cycle-evaluations/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId.trim(), trigger_type: trigger }),
      });
      const json = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !json.success) throw new Error(json.error?.message ?? "Erro ao disparar.");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h3 className="mb-6 text-lg font-bold text-zinc-800">Disparar Avaliacao de Ciclo</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">ID do Cliente</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="cli_acme"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">Tipo de Gatilho</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as CycleTriggerType)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 focus:border-blue-400 focus:outline-none"
            >
              <option value="MANUAL">Manual</option>
              <option value="MILESTONE_10_PROJECTS">Marco 10 Projetos</option>
              <option value="MONTHLY_30_DAYS">Ciclo Mensal (30 dias)</option>
            </select>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !clientId.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              Disparar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
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

  // Fetch on mount if no initial data
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-800">Avaliacoes de Ciclo</h2>
          <p className="text-sm text-zinc-500">
            Feedback qualitativo recorrente dos seus clientes
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PlusCircle size={16} />
          Novo Ciclo
        </button>
      </div>

      {/* Summary Stats — reserved height = 80px (CLS = 0) */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total de Ciclos", value: cycles.length.toString(), color: "text-zinc-800" },
          { label: "Concluidos", value: completed.length.toString(), color: "text-emerald-600" },
          {
            label: "Score Medio",
            value: avgScore !== null ? avgScore.toFixed(2) : "—",
            color: "text-blue-600",
          },
        ].map((stat) => (
          <div key={stat.label} className="h-[80px] rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-400">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pending banner */}
      {pending.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <Clock size={16} className="shrink-0 text-amber-500" />
          <span>
            <strong>{pending.length}</strong> avaliacao{pending.length > 1 ? "oes" : ""} aguardando resposta do cliente.
          </span>
        </div>
      )}

      {/* Cycle list */}
      {loading || isPending ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <CycleCardSkeleton key={i} />)}
        </div>
      ) : cycles.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 text-zinc-400">
          <Star size={32} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Nenhuma avaliacao de ciclo ainda.</p>
          <p className="text-xs">Dispare seu primeiro ciclo pelo botao acima.</p>
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