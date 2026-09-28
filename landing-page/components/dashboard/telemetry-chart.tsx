"use client";

import { useState } from "react";
import { CashflowPoint } from "@/lib/services/dashboard-data";
import { Sparkles } from "lucide-react";

interface TelemetryChartProps {
  data: CashflowPoint[];
}

export function TelemetryChart({ data }: TelemetryChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(data.length - 1);
  const [activeLayer, setActiveLayer] = useState<"ALL" | "CASH" | "TAX">("ALL");

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Coordenadas SVG
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const maxVal = Math.max(...data.map((d) => d.receivables), 60000);

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * graphWidth;
  const getY = (val: number) => height - paddingY - (val / maxVal) * graphHeight;

  // Gerador de Bézier suave
  const createPath = (key: keyof Pick<CashflowPoint, "receivables" | "expenses" | "taxReserve">) => {
    return data.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getY(point[key]);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1][key]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpX2 = prevX + (x - prevX) / 2;
      return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
    }, "");
  };

  const createAreaPath = (key: keyof Pick<CashflowPoint, "receivables" | "expenses" | "taxReserve">) => {
    const linePath = createPath(key);
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = height - paddingY;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  return (
    <div className="rounded-xl border border-white/10 bg-[#101C33]/90 backdrop-blur-md p-5 shadow-xl relative overflow-hidden">
      
      {/* Cabeçalho do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Painel Preditivo de Fluxo & Telemetria
            </h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              60 FPS GPU
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Cruzamento determinístico: Recebíveis vs Custos de Operação (OPEX) vs Split Tributário
          </p>
        </div>

        {/* Seletor de Camadas */}
        <div className="flex items-center bg-[#0A0F1D] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveLayer("ALL")}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-[background-color,color] duration-150 ${
              activeLayer === "ALL" ? "bg-trust-navy text-white font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Visão Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("CASH")}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-[background-color,color] duration-150 ${
              activeLayer === "CASH" ? "bg-trust-navy text-white font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Receita x Custos
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("TAX")}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-[background-color,color] duration-150 ${
              activeLayer === "TAX" ? "bg-trust-navy text-white font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Cofre de Impostos
          </button>
        </div>
      </div>

      {/* SVG Container Interativo */}
      <div className="relative w-full h-60 sm:h-72">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente Recebíveis (Growth Emerald) */}
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradiente Despesas (OPEX) */}
            <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradiente Split Tributário */}
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas de Grade de Fundo */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + ratio * graphHeight;
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Áreas Preenchidas */}
          {(activeLayer === "ALL" || activeLayer === "CASH") && (
            <>
              <path d={createAreaPath("receivables")} fill="url(#emeraldGrad)" />
              <path d={createAreaPath("expenses")} fill="url(#roseGrad)" />
            </>
          )}

          {activeLayer === "TAX" && (
            <path d={createAreaPath("taxReserve")} fill="url(#skyGrad)" />
          )}

          {/* Linhas Bézier */}
          {(activeLayer === "ALL" || activeLayer === "CASH") && (
            <>
              <path
                d={createPath("receivables")}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={createPath("expenses")}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
            </>
          )}

          {(activeLayer === "ALL" || activeLayer === "TAX") && (
            <path
              d={createPath("taxReserve")}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Linha Vertical de Telemetria (Crosshair) */}
          {hoverIndex !== null && (
            <line
              x1={getX(hoverIndex)}
              y1={paddingY}
              x2={getX(hoverIndex)}
              y2={height - paddingY}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}

          {/* Pontos Interativos e Áreas de Gatilho de Hover */}
          {data.map((point, i) => {
            const x = getX(i);
            const isHovered = hoverIndex === i;

            return (
              <g key={point.period}>
                {/* Ponto Recebíveis */}
                <circle
                  cx={x}
                  cy={getY(point.receivables)}
                  r={isHovered ? 5 : 3.5}
                  fill="#10B981"
                  stroke="#0A0F1D"
                  strokeWidth="2"
                />

                {/* Zona de Interação de Mouse */}
                <rect
                  x={x - 25}
                  y={0}
                  width={50}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />
              </g>
            );
          })}
        </svg>

        {/* Labels do Eixo X */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-[11px] font-mono text-neutral-400">
          {data.map((d, i) => (
            <span
              key={d.period}
              className={`transition-[color] duration-150 ${
                hoverIndex === i ? "text-emerald-400 font-bold" : ""
              }`}
            >
              {d.period}
            </span>
          ))}
        </div>
      </div>

      {/* Tooltip HUD de Telemetria Flutuante */}
      {activePoint && (
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{activePoint.period}:</span>
            <span className="text-neutral-400">Detalhamento Financeiro do Período</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-400">Recebíveis:</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {formatBRL(activePoint.receivables)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-neutral-400">OPEX:</span>
              <span className="text-rose-400 font-bold tabular-nums">
                {formatBRL(activePoint.expenses)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-neutral-400">Cofre Fiscal (6%):</span>
              <span className="text-sky-400 font-bold tabular-nums">
                {formatBRL(activePoint.taxReserve)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-neutral-400">Líquido Caixa:</span>
              <span className="text-white font-bold tabular-nums">
                {formatBRL(activePoint.netCashflow)}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
