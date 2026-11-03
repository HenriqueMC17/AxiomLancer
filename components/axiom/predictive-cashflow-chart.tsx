"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown, Calendar, ShieldCheck } from "lucide-react";
import { MonetaryService } from "@/core/services/monetary.service";

export function PredictiveCashflowChart() {
  const [horizon, setHorizon] = useState<number>(30);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCashflow = async (h: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/predictive-cashflow?horizon=${h}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCashflow(horizon);
  }, [horizon]);

  const summary = data?.projection?.summary;
  const points = data?.projection?.points || [];

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold tracking-tight">Previsio BI: Fluxo Preditivo</CardTitle>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                Precisão Determinística
              </Badge>
            </div>
            <CardDescription className="text-sm mt-1">
              Cruzamento preditivo de contas a pagar com faturas a receber sujeitas a risco de atraso
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {[30, 60, 90].map((h) => (
              <Button
                key={h}
                size="sm"
                variant={horizon === h ? "default" : "outline"}
                onClick={() => setHorizon(h)}
                className={horizon === h ? "bg-emerald-600 hover:bg-emerald-700 font-semibold" : ""}
              >
                {h} dias
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Mini-cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg border bg-background/50">
              <span className="text-xs text-muted-foreground block font-medium">Saldo Inicial</span>
              <span className="text-lg font-mono font-bold tracking-tight text-foreground">
                {MonetaryService.formatBRL(summary.initialBalance)}
              </span>
            </div>

            <div className="p-3.5 rounded-lg border bg-background/50">
              <span className="text-xs text-muted-foreground block font-medium">Saldo Projetado ({horizon}d)</span>
              <span
                className={`text-lg font-mono font-bold tracking-tight ${
                  summary.finalRealisticBalance >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {MonetaryService.formatBRL(summary.finalRealisticBalance)}
              </span>
            </div>

            <div className="p-3.5 rounded-lg border bg-background/50">
              <span className="text-xs text-muted-foreground block font-medium">Entradas Projetadas</span>
              <span className="text-lg font-mono font-bold tracking-tight text-emerald-400">
                +{MonetaryService.formatBRL(summary.totalProjectedInflow)}
              </span>
            </div>

            <div className="p-3.5 rounded-lg border bg-background/50">
              <span className="text-xs text-muted-foreground block font-medium">Saídas / Despesas</span>
              <span className="text-lg font-mono font-bold tracking-tight text-rose-400">
                -{MonetaryService.formatBRL(summary.totalProjectedOutflow)}
              </span>
            </div>
          </div>
        )}

        {/* Gráfico Recharts */}
        <div className="h-[340px] w-full pt-2">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Calculando curvas de probabilidade financeira...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                  tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono space-y-1.5">
                          <p className="font-sans font-bold text-sm text-foreground">{label} ({d.date})</p>
                          <div className="text-emerald-400 flex justify-between gap-4">
                            <span>Cenário Realista:</span>
                            <span className="font-bold">{MonetaryService.formatBRL(d.realisticBalance)}</span>
                          </div>
                          <div className="text-cyan-400 flex justify-between gap-4">
                            <span>Cenário Otimista:</span>
                            <span>{MonetaryService.formatBRL(d.optimisticBalance)}</span>
                          </div>
                          <div className="text-amber-400 flex justify-between gap-4">
                            <span>Cenário Conservador:</span>
                            <span>{MonetaryService.formatBRL(d.pessimisticBalance)}</span>
                          </div>
                          <div className="border-t border-border pt-1 text-muted-foreground flex justify-between gap-4">
                            <span>Entradas / Saídas:</span>
                            <span>
                              +{MonetaryService.formatBRL(d.projectedInflow)} / -{MonetaryService.formatBRL(d.projectedOutflow)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => <span className="text-xs text-muted-foreground font-medium">{val}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="realisticBalance"
                  fill="url(#colorReal)"
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="realisticBalance"
                  name="Cenário Realista (Score Clientes)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="optimisticBalance"
                  name="Cenário Otimista (100% Pontual)"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pessimisticBalance"
                  name="Cenário Conservador (Atrasos)"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alertas de Risco */}
        {summary?.riskAlerts && summary.riskAlerts.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Alertas Preditivos de Liquidez:</p>
              {summary.riskAlerts.map((alert: string, idx: number) => (
                <p key={idx}>{alert}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
