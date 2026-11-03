"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { MonetaryService } from "@/core/services/monetary.service";

interface RevenueLeakageProps {
  unbilledHoursWeekly?: number; // 12h
  hourlyRate?: number; // 150
  draftInvoicesCount?: number;
  draftInvoicesAmount?: number;
}

export function RevenueLeakageAlert({
  unbilledHoursWeekly = 12,
  hourlyRate = 180,
  draftInvoicesCount = 1,
  draftInvoicesAmount = 6200,
}: RevenueLeakageProps) {
  const monthlyHoursWasted = unbilledHoursWeekly * 4.33;
  const monthlyMoneyWasted = monthlyHoursWasted * hourlyRate;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Alerta de Tempo Burocrático Economizado */}
      <Card className="border-amber-500/30 bg-amber-950/10 backdrop-blur-sm">
        <CardContent className="p-4 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                Burocracia Zero: {unbilledHoursWeekly}h / semana poupadas
              </span>
              <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">
                ROI Operacional
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Sem a automação da esteira 7Keys, você desperdiçaria cerca de <strong>{Math.round(monthlyHoursWasted)} horas/mês</strong> cobrando clientes e calculando impostos (equivalente a <strong>{MonetaryService.formatBRL(monthlyMoneyWasted)}</strong> em tempo não faturado).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Alerta de Faturas Esquecidas (Revenue Leakage) */}
      <Card className="border-rose-500/30 bg-rose-950/10 backdrop-blur-sm">
        <CardContent className="p-4 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                Vazamento de Receita: {draftInvoicesCount} fatura em rascunho
              </span>
              <Badge variant="outline" className="border-rose-500/40 text-rose-300 text-[10px]">
                Ação Imediata
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Detectamos <strong>{MonetaryService.formatBRL(draftInvoicesAmount)}</strong> em serviços executados que ainda não foram emitidos para o cliente. Converta o rascunho para disparar o motor autônomo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
