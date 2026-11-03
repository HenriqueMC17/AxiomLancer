"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Clock, CheckCircle2, AlertTriangle, ShieldX, Terminal, Layers } from "lucide-react";
import { toast } from "sonner";

export function AutonomousRulesPanel() {
  const [data, setData] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResults, setLastResults] = useState<any[]>([]);

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/billing-rules");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const runEngine = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/billing-rules", { method: "POST" });
      const json = await res.json();
      setLastResults(json.results || []);

      if (json.abortedCount > 0) {
        toast.error("Motor Interrompido pelo Safe Mode!", {
          description: `${json.abortedCount} disparos foram prevenidos pelo Botão de Pânico.`,
        });
      } else {
        toast.success("Ciclo Autônomo Concluído", {
          description: `${json.executedCount} disparados, ${json.skippedCount} deduplicados pelo Journal.`,
        });
      }

      fetchRules();
    } catch (err: any) {
      toast.error("Erro ao rodar motor de cobrança", { description: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  const rules = data?.rules || [];
  const journal = data?.journal || [];
  const candidates = data?.candidates || [];

  return (
    <div className="space-y-6">
      {/* Visual da Esteira de Cobrança D-3 a D+7 */}
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold tracking-tight">Motor de Cobrança Autônomo</CardTitle>
                <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 text-xs">
                  BullMQ & Redis Engine
                </Badge>
              </div>
              <CardDescription className="text-sm mt-1">
                Máquina de estados determinística: D-3, D-0, D+3 e D+7 com adaptação dinâmica de tom e proteção anti-duplicação
              </CardDescription>
            </div>

            <Button
              onClick={runEngine}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shrink-0 shadow-lg shadow-emerald-900/30"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Processando Fila..." : "Disparar Ciclo Autônomo"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timeline de Etapas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400 uppercase">Fase 1: D-3</span>
                <Badge variant="outline" className="border-blue-500/40 text-blue-300 text-[10px]">E-mail</Badge>
              </div>
              <h4 className="font-semibold text-sm text-foreground">Aviso Preventivo</h4>
              <p className="text-xs text-muted-foreground">
                Lembrete amigável com chave PIX e QR Code dinâmico para facilitar o agendamento bancário.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase">Fase 2: D-0</span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">WhatsApp</Badge>
              </div>
              <h4 className="font-semibold text-sm text-foreground">Dia do Vencimento</h4>
              <p className="text-xs text-muted-foreground">
                Mensagem assertiva e respeitosa com link direto para liquidação instantânea via PIX Copia e Cola.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase">Fase 3: D+3</span>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">WhatsApp</Badge>
              </div>
              <h4 className="font-semibold text-sm text-foreground">Atraso Inicial</h4>
              <p className="text-xs text-muted-foreground">
                Cobrança de alinhamento para sanar esquecimentos comerciais sem desgastar a relação do freelancer.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-400 uppercase">Fase 4: D+7</span>
                <Badge variant="outline" className="border-rose-500/40 text-rose-300 text-[10px]">Notificação</Badge>
              </div>
              <h4 className="font-semibold text-sm text-foreground">Suspensão & Juros</h4>
              <p className="text-xs text-muted-foreground">
                Aviso formal de interrupção de entregas e cálculo do Take Rate de recuperação caso quitado.
              </p>
            </div>
          </div>

          {/* Log de Execução Recente do Engine */}
          {lastResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                <Terminal className="h-4 w-4 text-emerald-400" />
                Console de Disparos em Tempo Real (Execution Engine)
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-2 text-zinc-300 max-h-56 overflow-y-auto">
                {lastResults.map((res: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-zinc-900 pb-2">
                    {res.status === "SUCCESS" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
                    {res.status === "SKIPPED_DEDUPLICATED" && <RotateCcw className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />}
                    {res.status === "ABORTED_PANIC_BUTTON" && <ShieldX className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">[{res.status}] {res.ruleName}</span>
                        <span className="text-[10px] text-zinc-500">{res.latencyMs}ms</span>
                      </div>
                      <p className="text-zinc-400 mt-0.5">{res.recipientEmail} | {res.subject || res.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diário de Idempotência (DeduplicationJournal) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                <Layers className="h-4 w-4 text-cyan-400" />
                DeduplicationJournal (Tabela de Idempotência Estrita)
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
                {journal.length} registros gravados
              </Badge>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="p-3">Event ID (Hash Único)</th>
                    <th className="p-3">Fatura ID</th>
                    <th className="p-3">Data Disparo</th>
                    <th className="p-3">Regra</th>
                    <th className="p-3">Horário Processado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {journal.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="p-3 font-semibold text-cyan-400 truncate max-w-[200px]" title={item.event_id}>
                        {item.event_id}
                      </td>
                      <td className="p-3 text-muted-foreground">{item.invoice_id}</td>
                      <td className="p-3">{item.trigger_day}</td>
                      <td className="p-3 text-foreground">{item.rule_id}</td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(item.processed_at).toLocaleTimeString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
