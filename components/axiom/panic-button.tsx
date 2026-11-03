"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck, Zap, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PanicButtonProps {
  initialPaused?: boolean;
  onStateChange?: (isPaused: boolean) => void;
}

export function PanicButton({ initialPaused = false, onStateChange }: PanicButtonProps) {
  const [isPaused, setIsPaused] = useState(initialPaused);
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number>(12);

  const togglePanic = async () => {
    setIsLoading(true);
    const targetState = !isPaused;
    const start = performance.now();

    try {
      const res = await fetch("/api/panic-button", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing_paused: targetState }),
      });
      const data = await res.json();
      const realLatency = Math.round(performance.now() - start);
      setLatency(realLatency || 12);

      if (data.success) {
        setIsPaused(data.billing_paused);
        onStateChange?.(data.billing_paused);

        if (data.billing_paused) {
          toast.error("SAFE MODE ATIVADO!", {
            description: `Toda a esteira de cobrança foi congelada em ${realLatency}ms. Nenhum e-mail ou WhatsApp será enviado.`,
            duration: 5000,
          });
        } else {
          toast.success("MOTOR REATIVADO", {
            description: `Esteira autônoma em execução normal (${realLatency}ms).`,
            duration: 4000,
          });
        }
      }
    } catch (err: any) {
      toast.error("Erro ao alternar Safe Mode", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3 transition-all duration-300 ${
        isPaused
          ? "border-rose-500/50 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
          : "border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all ${
              isPaused
                ? "border-rose-500/60 bg-rose-500/20 text-rose-400 animate-pulse"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isPaused ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Motor Autônomo
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono font-bold uppercase ${
                  isPaused
                    ? "border-rose-500/50 text-rose-400 bg-rose-500/10"
                    : "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                }`}
              >
                {isPaused ? "Safe Mode (Congelado)" : "Online (Autônomo)"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-0.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Trava de Pânico: latência</span>
              <span className="font-semibold text-foreground">{latency}ms</span>
            </div>
          </div>
        </div>

        <Button
          onClick={togglePanic}
          disabled={isLoading}
          variant={isPaused ? "outline" : "destructive"}
          size="sm"
          className={`font-semibold transition-all duration-200 gap-2 shrink-0 ${
            isPaused
              ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30"
          }`}
        >
          <Power className="h-4 w-4" />
          {isPaused ? "Reativar Motor" : "Botão de Pânico"}
        </Button>
      </div>
    </div>
  );
}
