"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, Star } from "lucide-react";

interface CycleFormData {
  score_communication: number;
  score_proactivity: number;
  score_results: number;
  score_understanding: number;
  score_demand_delivery: number;
  comments: string;
}

interface CycleEvaluationFormProps {
  token: string;
  cycleIdentifier: string;
  triggerType?: string;
  alreadyCompleted?: boolean;
}

const DIMENSIONS = [
  { key: "score_communication" as const, label: "Comunicacao", description: "Clareza e frequencia das atualizacoes" },
  { key: "score_proactivity" as const, label: "Proatividade", description: "Iniciativa em antecipar problemas e solucoes" },
  { key: "score_results" as const, label: "Apresentacao de Resultados", description: "Qualidade e clareza na entrega dos resultados" },
  { key: "score_understanding" as const, label: "Entendimento da Dor", description: "Compreensao das necessidades e objetivos" },
  { key: "score_demand_delivery" as const, label: "Atendimento a Demanda", description: "Cumprimento de prazos e requisitos" },
];

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Avaliação de 1 a 5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Star
            size={28}
            className={
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-zinc-300"
            }
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 self-center text-sm font-medium text-zinc-500">
          {value}.0 / 5.0
        </span>
      )}
    </div>
  );
}

export function CycleEvaluationForm({
  token,
  cycleIdentifier,
  triggerType,
  alreadyCompleted = false,
}: CycleEvaluationFormProps) {
  const [scores, setScores] = useState<CycleFormData>({
    score_communication: 0,
    score_proactivity: 0,
    score_results: 0,
    score_understanding: 0,
    score_demand_delivery: 0,
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(alreadyCompleted);
  const [error, setError] = useState<string | null>(null);

  const allScored = DIMENSIONS.every((d) => scores[d.key] > 0);
  const commentsOk = scores.comments.trim().length >= 15;
  const canSubmit = allScored && commentsOk && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/cycle-evaluations/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scores),
      });
      const json = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? "Erro ao enviar avaliação.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle className="h-16 w-16 text-emerald-500" />
        <h2 className="text-2xl font-bold text-emerald-800">Obrigado pelo seu feedback!</h2>
        <p className="max-w-md text-emerald-700">
          Sua avaliação foi registrada com sucesso. Ela ajudará o freelancer a melhorar continuamente.
        </p>
        <p className="text-xs text-emerald-500">Ciclo: {cycleIdentifier}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {triggerType && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          Gatilho:{" "}
          <span className="font-semibold">
            {triggerType === "MILESTONE_10_PROJECTS"
              ? "10 projetos concluidos"
              : triggerType === "MONTHLY_30_DAYS"
              ? "Ciclo mensal (30 dias)"
              : "Manual"}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {DIMENSIONS.map((dim) => (
          <div key={dim.key} className="space-y-2">
            <div>
              <label className="text-base font-semibold text-zinc-800">{dim.label}</label>
              <p className="text-sm text-zinc-500">{dim.description}</p>
            </div>
            {/* Reserved height = 40px to prevent CLS */}
            <div className="h-10 flex items-center">
              <StarRating
                value={scores[dim.key]}
                onChange={(v) => setScores((prev) => ({ ...prev, [dim.key]: v }))}
                disabled={submitting}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="comments" className="text-base font-semibold text-zinc-800">
          Comentario Qualitativo
        </label>
        <p className="text-sm text-zinc-500">
          Minimo de 15 caracteres. Descreva pontos fortes e de melhoria.
        </p>
        {/* Reserved height = 120px to prevent CLS */}
        <div className="h-[120px]">
          <textarea
            id="comments"
            rows={4}
            disabled={submitting}
            value={scores.comments}
            onChange={(e) => setScores((prev) => ({ ...prev, comments: e.target.value }))}
            placeholder="Ex: A comunicacao foi excelente, sempre pontual nas atualizacoes..."
            className="h-full w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
        </div>
        <p className="text-right text-xs text-zinc-400">
          {scores.comments.trim().length} / 2000 chars
          {scores.comments.trim().length > 0 && scores.comments.trim().length < 15 && (
            <span className="ml-2 text-red-500">(minimo 15)</span>
          )}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando avaliação...
          </>
        ) : (
          "Enviar Avaliacao"
        )}
      </button>
    </form>
  );
}