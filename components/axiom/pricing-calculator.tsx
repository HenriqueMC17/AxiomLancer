"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MonetaryService } from "@/core/services/monetary.service";
import { PricingOutput } from "@/core/services/pricing-calculator.service";

export function PricingCalculator() {
  const [personalExp, setPersonalExp] = useState<number>(6000);
  const [businessExp, setBusinessExp] = useState<number>(2000);
  const [desiredNet, setDesiredNet] = useState<number>(8000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(25);
  const [rbt12, setRbt12] = useState<number>(180000);
  const [anexo, setAnexo] = useState<"ANEXO_III" | "ANEXO_V">("ANEXO_III");
  const [gateway, setGateway] = useState<"PIX" | "CREDIT_CARD" | "BOLETO">("PIX");
  const [fatorR, setFatorR] = useState<number>(28);

  const [result, setResult] = useState<PricingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // FIX 2: useCallback para estabilizar a referencia da funcao no useEffect
  const calculate = useCallback(async () => {
    // Nao dispara com valores zerados/invalidos
    if (!desiredNet || !hoursPerWeek) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthly_personal_expenses: personalExp,
          monthly_business_expenses: businessExp,
          desired_net_income: desiredNet,
          billable_hours_per_week: hoursPerWeek,
          weeks_worked_per_year: 48,
          simples_nacional_type: anexo,
          annual_revenue_rbt12: rbt12,
          payroll_ratio_fator_r: fatorR,
          gateway_type: gateway,
        }),
      });
      const data = await res.json();
      // FIX 1: checa data.success (a API agora retorna { success: true, result })
      if (data.success && data.result) {
        setResult(data.result as PricingOutput);
      }
    } catch (err) {
      console.error("Erro ao calcular precificacao:", err);
    } finally {
      setIsLoading(false);
    }
  }, [personalExp, businessExp, desiredNet, hoursPerWeek, rbt12, anexo, gateway, fatorR]);

  // Dispara calculo automatico sempre que qualquer parametro mudar
  useEffect(() => {
    // Debounce de 400ms para evitar chamadas em cascata enquanto o usuario digita
    const timer = setTimeout(() => {
      calculate();
    }, 400);
    return () => clearTimeout(timer);
  }, [calculate]);

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold tracking-tight">
                Calculadora de Precificacao &amp; Margem Real
              </CardTitle>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                Simples Nacional &amp; Fator R
              </Badge>
            </div>
            <CardDescription className="text-sm mt-1">
              Elimine o risco de subprecificacao calculando sua hora tecnica com provisionamento exato de tributos, gateway e despesas
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulario de Parametros */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pers" className="text-xs">Custos de Vida Pessoais (R$/mes)</Label>
                <Input
                  id="pers"
                  type="number"
                  value={personalExp}
                  onChange={(e) => setPersonalExp(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="biz" className="text-xs">Custos do Negocio/Ferramentas (R$/mes)</Label>
                <Input
                  id="biz"
                  type="number"
                  value={businessExp}
                  onChange={(e) => setBusinessExp(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="net" className="text-xs">Reserva / Lucro Liquido Almejado (R$/mes)</Label>
                <Input
                  id="net"
                  type="number"
                  value={desiredNet}
                  onChange={(e) => setDesiredNet(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hrs" className="text-xs">Horas Faturáveis / Semana</Label>
                  <span className="text-[10px] text-emerald-400 font-mono">15h autom. 7Keys</span>
                </div>
                <Input
                  id="hrs"
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Simples Nacional</Label>
                <select
                  value={anexo}
                  onChange={(e) => setAnexo(e.target.value as "ANEXO_III" | "ANEXO_V")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ANEXO_III">Anexo III (6.0% a 11.2%)</option>
                  <option value="ANEXO_V">Anexo V (15.5% a 18.0%)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Gateway Padrao</Label>
                <select
                  value={gateway}
                  onChange={(e) => setGateway(e.target.value as "PIX" | "CREDIT_CARD" | "BOLETO")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="PIX">PIX Dinamico (0.99%)</option>
                  <option value="CREDIT_CARD">Cartao a Vista (3.49%)</option>
                  <option value="BOLETO">Boleto (R$ 2,49 fixo)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rbt" className="text-xs">RBT12 Acumulado (R$)</Label>
                <Input
                  id="rbt"
                  type="number"
                  value={rbt12}
                  onChange={(e) => setRbt12(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Cartao de Resultados */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  Sua Hora Tecnica Calculada
                </span>
                <Badge variant="outline" className="border-emerald-500 text-emerald-300 text-[10px]">
                  decimal.js
                </Badge>
              </div>

              <div className="mt-3">
                {isLoading ? (
                  <div className="text-3xl font-mono font-bold tracking-tight text-muted-foreground animate-pulse">
                    Calculando...
                    <span className="text-xs font-normal text-muted-foreground ml-1">/ hora</span>
                  </div>
                ) : (
                  <div className="text-3xl font-mono font-bold tracking-tight text-foreground">
                    {result ? MonetaryService.formatBRL(result.recommendedHourlyRate) : "---"}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/ hora</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Minimo viavel:{" "}
                  <span className="font-mono text-zinc-300">
                    {result ? MonetaryService.formatBRL(result.minimumHourlyRate) : "---"}
                  </span>{" "}
                  (inclui 15% margem de seguranca)
                </p>
              </div>
            </div>

            {/* Breakdown de Custos */}
            {result && (
              <div className="space-y-2 border-t border-emerald-500/20 pt-3 text-xs font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Faturamento Mensal Necessario:</span>
                  <span className="font-bold text-foreground">
                    {MonetaryService.formatBRL(result.targetMonthlyGrossRevenue)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Provisao Simples Nacional ({result.effectiveTaxRatePercent.toFixed(2)}%):</span>
                  <span className="text-amber-400 font-bold">
                    -{MonetaryService.formatBRL(result.monthlyTaxProvision)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Custos de Gateway ({result.gatewayFeePercent.toFixed(2)}%):</span>
                  <span className="text-zinc-400">
                    -{MonetaryService.formatBRL(result.monthlyGatewayCost)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Despesas Operacionais Fixas:</span>
                  <span className="text-zinc-400">
                    -{MonetaryService.formatBRL(result.monthlyBusinessExpenses)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-emerald-500/30 pt-1.5 font-bold">
                  <span className="text-emerald-400">Liquido no Bolso (Freelancer):</span>
                  <span className="text-emerald-400">
                    {MonetaryService.formatBRL(result.monthlyNetIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground pt-1">
                  <span>Horas Faturaveis / Mes:</span>
                  <span className="text-zinc-300">{result.totalMonthlyBillableHours}h</span>
                </div>
              </div>
            )}

            {/* Status Fator R */}
            {result?.fatorRStatus && (
              <div className="rounded-lg bg-background/50 border border-border p-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Fator R: {result.fatorRStatus.ratioPercent.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-400">
                    {result.fatorRStatus.recommendedAnexo}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {result.fatorRStatus.qualifiesForAnexoIII
                    ? `Economia tributaria de ${MonetaryService.formatBRL(result.fatorRStatus.potentialTaxSavingsMonthly)}/mes ao tributar pelo Anexo III!`
                    : "Elevar o pro-labore para atingir 28% reduzira sua aliquota de 15.5% para 6.0%."}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}