import { notFound } from "next/navigation";
import { CycleEvaluationForm } from "@/components/axiom/cycle-evaluation-form";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function getCycleData(token: string) {
  try {
    // Server-side fetch — uses the local API route
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/cycle-evaluations/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json() as {
      success: boolean;
      data?: { id: string; cycle_identifier: string; trigger_type?: string; status?: string };
    };
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function CycleEvaluationPage({ params }: PageProps) {
  const { token } = await params;
  const cycle = await getCycleData(token);

  if (!cycle) {
    notFound();
  }

  const isCompleted = cycle.status === "COMPLETED";
  const isExpired = cycle.status === "EXPIRED";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed-height header reservation — CLS = 0 */}
      <header className="h-16 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-2xl items-center px-6">
          <span className="text-lg font-bold tracking-tight text-zinc-800">AxiomLancer</span>
          <span className="ml-2 text-sm text-zinc-400">· Avaliacao de Ciclo</span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Fixed-height intro card — CLS = 0 */}
        <div className="mb-8 min-h-[96px] rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-800">Avaliacao de Desempenho</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Seu feedback qualitativo e fundamental para o crescimento do profissional.
          </p>
          <p className="mt-2 text-xs text-zinc-400 font-mono">{cycle.cycle_identifier}</p>
        </div>

        {isExpired ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-lg font-semibold text-red-700">Link expirado</p>
            <p className="mt-2 text-sm text-red-500">
              Este convite de avaliacao nao e mais valido. Entre em contato com o freelancer para uma nova solicitacao.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
            <CycleEvaluationForm
              token={token}
              cycleIdentifier={cycle.cycle_identifier}
              triggerType={cycle.trigger_type}
              alreadyCompleted={isCompleted}
            />
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-400">
          Suas respostas sao confidenciais e utilizadas apenas para fins de melhoria profissional.
          <br />
          Em conformidade com a LGPD.
        </p>
      </div>
    </main>
  );
}