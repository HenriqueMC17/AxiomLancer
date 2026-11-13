"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, CheckCircle, GitBranch, ShieldCheck, Landmark, PiggyBank, ArrowRight } from "lucide-react";
import { MonetaryService } from "@/core/services/monetary.service";
import { toast } from "sonner";

interface MilestoneItem {
  id: string;
  contract_id: string;
  title: string;
  client: string;
  amount: number;
  status: "LOCKED" | "APPROVED" | "RELEASED";
  deliverable_url?: string;
  release_date?: string;
  tax_provisioned?: number;
  net_disbursed?: number;
}

export function EscrowMilestones() {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: "ms_001",
      contract_id: "cnt_01",
      title: "Entrega do Core Engine (Clean Architecture & decimal.js)",
      client: "Acme Corp Dev Lab",
      amount: 4500.0,
      status: "RELEASED",
      deliverable_url: "https://github.com/7Keys/axiomlancer-core",
      release_date: "2026-10-18T14:00:00Z",
      tax_provisioned: 270.0, // 6% Anexo III
      net_disbursed: 4230.0,
    },
    {
      id: "ms_002",
      contract_id: "cnt_01",
      title: "Deploy Vercel Edge & Testes de Latência do Panic Button (<12ms)",
      client: "Acme Corp Dev Lab",
      amount: 4000.0,
      status: "LOCKED",
      deliverable_url: "https://axiomlancer.7keys.dev/staging",
    },
    {
      id: "ms_003",
      contract_id: "cnt_01",
      title: "Validação da Idempotência (DeduplicationJournal) & Testes E2E",
      client: "Nexus FinTech Ventures",
      amount: 5400.0,
      status: "LOCKED",
    },
  ]);

  const [isReleasing, setIsReleasing] = useState<string | null>(null);

  const handleRelease = async (milestone: MilestoneItem) => {
    setIsReleasing(milestone.id);
    try {
      const res = await fetch(`/api/contracts/${milestone.contract_id}/milestones/${milestone.id}/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualRevenueRbt12: 180000.0,
          simplesNacionalType: "ANEXO_III",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Falha ao liberar milestone");
      }

      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestone.id
            ? {
                ...m,
                status: "RELEASED",
                release_date: json.milestone.release_date,
                tax_provisioned: json.taxSplit.virtualSafeRetention,
                net_disbursed: json.taxSplit.netDisbursed,
              }
            : m
        )
      );

      toast.success("Marco Contratual Liberado com Sucesso!", {
        description: `Líquido de ${MonetaryService.formatBRL(json.taxSplit.netDisbursed)} transferido via PIX. ${MonetaryService.formatBRL(json.taxSplit.virtualSafeRetention)} (6%) retido no Cofre Virtual do DAS.`,
      });
    } catch (err: any) {
      // Fallback em caso de offline/mock
      const simulatedTax = milestone.amount * 0.06;
      const simulatedNet = milestone.amount * 0.94;
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestone.id
            ? {
                ...m,
                status: "RELEASED",
                release_date: new Date().toISOString(),
                tax_provisioned: simulatedTax,
                net_disbursed: simulatedNet,
              }
            : m
        )
      );
      toast.success("Marco Contratual Liberado (Modo Simulação)!", {
        description: `Líquido de ${MonetaryService.formatBRL(simulatedNet)} disponibilizado. ${MonetaryService.formatBRL(simulatedTax)} retido no Cofre Virtual.`,
      });
    } finally {
      setIsReleasing(null);
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold tracking-tight">Smart Escrows & Split Tributário</CardTitle>
              <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-xs">
                Garantia Simples Nacional
              </Badge>
            </div>
            <CardDescription className="text-sm mt-1">
              Custódia com segregação imediata de impostos no Cofre Virtual (Fator R) e liquidação via PIX
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Banner de Conformidade Fiscal */}
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <PiggyBank className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-300 block">Retenção Preventiva do DAS no Momento da Liquidação</span>
              <span className="text-muted-foreground">
                Elimina surpresas tributárias no dia 20 segregando a alíquota efetiva (Simples Nacional LC 123/2006).
              </span>
            </div>
          </div>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 shrink-0">
            Fator R ≥ 28% (Anexo III 6%)
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((ms) => {
            const isReleased = ms.status === "RELEASED";
            const estTax = ms.tax_provisioned ?? ms.amount * 0.06;
            const estNet = ms.net_disbursed ?? ms.amount * 0.94;

            return (
              <div
                key={ms.id}
                className={`p-4 rounded-xl border transition-all space-y-3.5 ${
                  isReleased
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-border bg-background/50 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${
                      isReleased
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                        : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                    }`}
                  >
                    {isReleased ? "LIQUIDADO" : "EM CUSTÓDIA"}
                  </Badge>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {MonetaryService.formatBRL(ms.amount)}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-foreground line-clamp-2 leading-tight">
                    {ms.title}
                  </h4>
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    {ms.client}
                  </span>
                </div>

                {/* Split Tributario Breakdown */}
                <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Líquido Freelancer:</span>
                    <span className="text-emerald-400 font-semibold">{MonetaryService.formatBRL(estNet)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cofre Virtual (DAS 6%):</span>
                    <span className="text-amber-400 font-semibold">{MonetaryService.formatBRL(estTax)}</span>
                  </div>
                </div>

                {ms.deliverable_url && (
                  <a
                    href={ms.deliverable_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                  >
                    <GitBranch className="h-3 w-3" /> Ver Entregável / Deploy
                  </a>
                )}

                <div className="pt-1">
                  {!isReleased ? (
                    <Button
                      size="sm"
                      disabled={isReleasing === ms.id}
                      onClick={() => handleRelease(ms)}
                      className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5 shadow-md shadow-amber-950/40"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      {isReleasing === ms.id ? "Processando Split..." : "Aprovar e Liberar Fundos"}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold py-1">
                      <CheckCircle className="h-4 w-4" /> Fundos Liquidados via PIX
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}