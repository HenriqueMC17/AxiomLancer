"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, CheckCircle, ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";
import { MonetaryService } from "@/core/services/monetary.service";
import { toast } from "sonner";

export function EscrowMilestones() {
  const [milestones, setMilestones] = useState([
    {
      id: "ms_001",
      title: "Entrega do Core Engine (Clean Architecture & decimal.js)",
      client: "Acme Corp Dev Lab",
      amount: 4500.0,
      status: "APPROVED",
      deliverable_url: "https://github.com/7Keys/axiomlancer-core",
    },
    {
      id: "ms_002",
      title: "Deploy Vercel Edge & Testes de Latência do Panic Button (<12ms)",
      client: "Acme Corp Dev Lab",
      amount: 4000.0,
      status: "LOCKED",
      deliverable_url: "https://axiomlancer.7keys.dev/staging",
    },
    {
      id: "ms_003",
      title: "Validação da Idempotência (DeduplicationJournal) & Testes E2E",
      client: "Nexus FinTech Ventures",
      amount: 5400.0,
      status: "LOCKED",
    },
  ]);

  const handleApprove = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "APPROVED" } : m))
    );
    toast.success("Milestone Aprovado e Fundos Liberados!", {
      description: "O valor em custódia (Smart Escrow) foi transferido para a conta principal via PIX.",
    });
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold tracking-tight">Smart Escrows & Milestones</CardTitle>
              <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 text-xs">
                Garantia de Pagamento
              </Badge>
            </div>
            <CardDescription className="text-sm mt-1">
              Custódia programável com liberação automática de fundos mediante aprovação de entregáveis ou deploy
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((ms) => {
            const isApproved = ms.status === "APPROVED";

            return (
              <div
                key={ms.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isApproved
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : "border-border bg-background/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${
                      isApproved
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                        : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                    }`}
                  >
                    {isApproved ? "LIBERADO" : "EM CUSTÓDIA"}
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
                  {!isApproved ? (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(ms.id)}
                      className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5"
                    >
                      <Unlock className="h-3.5 w-3.5" /> Aprovar e Liberar
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold py-1">
                      <CheckCircle className="h-4 w-4" /> Fundos Liquidados
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
