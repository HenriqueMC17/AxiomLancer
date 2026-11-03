"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, ShieldCheck } from "lucide-react";
import { MonetaryService } from "@/core/services/monetary.service";

export function DREView() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDRE = async () => {
    try {
      const res = await fetch("/api/dre");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDRE();
  }, []);

  const dre = data?.dre;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold tracking-tight">DRE Gerencial Contábil</CardTitle>
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 text-xs">
                Demonstrativo de Resultados
              </Badge>
            </div>
            <CardDescription className="text-sm mt-1">
              Visão contábil com discriminação do Simples Nacional, custos diretos e retorno sobre o SaaS
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">Carregando balanço contábil...</div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden font-mono text-xs">
            <div className="p-3.5 bg-muted/40 font-sans font-bold flex justify-between items-center border-b border-border text-foreground">
              <span>Conta / Estrutura Contábil</span>
              <span>Valor Real (BRL)</span>
            </div>

            <div className="divide-y divide-border">
              {/* 1. Receita Bruta */}
              <div className="p-3 flex justify-between items-center bg-background/50 font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">(+)</span> 1. Receita Operacional Bruta (Faturas Liquidadas)
                </span>
                <span className="text-emerald-400 text-sm font-mono">
                  {MonetaryService.formatBRL(dre.grossRevenue)}
                </span>
              </div>

              {/* 2. Impostos */}
              <div className="p-3 flex justify-between items-center text-muted-foreground pl-6">
                <span>(-) Provisão Simples Nacional (Cofre Virtual)</span>
                <span className="text-amber-400">-{MonetaryService.formatBRL(dre.taxDeductions)}</span>
              </div>

              {/* 3. Receita Líquida */}
              <div className="p-3 flex justify-between items-center bg-muted/20 font-semibold text-foreground">
                <span>(=) 2. Receita Operacional Líquida</span>
                <span className="text-foreground">{MonetaryService.formatBRL(dre.netRevenue)}</span>
              </div>

              {/* 4. Custos Diretos */}
              <div className="p-3 flex justify-between items-center text-muted-foreground pl-6">
                <span>(-) Custos de Infraestrutura & Servidores (AWS/Vercel)</span>
                <span className="text-rose-400">-{MonetaryService.formatBRL(dre.directCosts)}</span>
              </div>

              {/* 5. Lucro Bruto */}
              <div className="p-3 flex justify-between items-center bg-muted/20 font-semibold text-foreground">
                <span>(=) 3. Lucro Bruto</span>
                <span className="text-foreground">{MonetaryService.formatBRL(dre.grossProfit)}</span>
              </div>

              {/* 6. Despesas Operacionais */}
              <div className="p-3 flex justify-between items-center text-muted-foreground pl-6">
                <span>(-) Despesas Fixas (Contabilidade, Coworking, Ferramentas)</span>
                <span className="text-rose-400">-{MonetaryService.formatBRL(dre.operatingExpenses)}</span>
              </div>

              {/* 7. Retorno do SaaS AxiomLancer */}
              <div className="p-3 flex justify-between items-center text-muted-foreground pl-6 bg-cyan-950/10">
                <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <span>(-) Assinatura AxiomLancer Core (SaaS 7Keys)</span>
                </span>
                <span className="text-cyan-400 font-bold">-{MonetaryService.formatBRL(dre.axiomLancerCoreSubscription)}</span>
              </div>

              {dre.axiomLancerTakeRateCommission > 0 && (
                <div className="p-3 flex justify-between items-center text-muted-foreground pl-6 bg-cyan-950/10">
                  <span className="text-cyan-300">(-) Take Rate Transacional (5% sobre faturas recuperadas)</span>
                  <span className="text-cyan-400 font-bold">-{MonetaryService.formatBRL(dre.axiomLancerTakeRateCommission)}</span>
                </div>
              )}

              {/* 8. Lucro Líquido Real */}
              <div className="p-4 flex justify-between items-center bg-emerald-950/30 border-t-2 border-emerald-500/50 font-bold text-sm">
                <div className="space-y-0.5">
                  <span className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> (=) 4. Resultado Líquido Real no Bolso
                  </span>
                  <span className="text-[11px] font-normal text-muted-foreground font-sans">
                    Margem Líquida Real: <strong className="text-foreground">{dre.netMarginPercent}%</strong>
                  </span>
                </div>
                <span className="text-emerald-400 text-lg font-mono">
                  {MonetaryService.formatBRL(dre.netIncome)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
