"use client";

import React, { useId } from "react";
import { Star } from "lucide-react";

export interface RatingStarsProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showNumeric?: boolean;
  reviewsCount?: number;
  theme?: "amber" | "emerald";
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    starClass: "h-3.5 w-3.5",
    containerHeight: "h-4",
    textClass: "text-xs",
    gapClass: "gap-0.5",
  },
  md: {
    starClass: "h-4 w-4",
    containerHeight: "h-5",
    textClass: "text-sm",
    gapClass: "gap-1",
  },
  lg: {
    starClass: "h-5 w-5",
    containerHeight: "h-6",
    textClass: "text-base font-semibold",
    gapClass: "gap-1.5",
  },
};

const THEME_CONFIG = {
  amber: {
    empty: "text-zinc-700/60",
    filled: "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]",
    numeric: "text-amber-300 font-mono font-bold",
  },
  emerald: {
    empty: "text-zinc-700/60",
    filled: "text-emerald-400 fill-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.35)]",
    numeric: "text-emerald-300 font-mono font-bold",
  },
};

/**
 * Componente UI Corporativo de Rating Stars Fracionadas (Zero CLS).
 *
 * Renderiza 5 estrelas continuas ou fracionadas com sobreposicao precisa via CSS.
 * A reserva estrutural de espaco garante Cumulative Layout Shift estritamente nulo (CLS = 0).
 */
export function RatingStars({
  score,
  maxScore = 5,
  size = "md",
  showNumeric = true,
  reviewsCount,
  theme = "emerald",
  className = "",
}: RatingStarsProps) {
  const componentId = useId();
  const cfg = SIZE_CONFIG[size];
  const colors = THEME_CONFIG[theme];

  // Garante que o score fique no intervalo [0, maxScore]
  const clampedScore = Math.max(0, Math.min(score, maxScore));

  return (
    <div
      className={`inline-flex items-center ${cfg.gapClass} ${cfg.containerHeight} select-none ${className}`}
      role="img"
      aria-label={`Avaliação: ${clampedScore.toFixed(2)} de ${maxScore} estrelas`}
      style={{ contain: "layout size style" }} // Reserva estrutural rigorosa para Zero CLS
    >
      {/* Container das 5 estrelas */}
      <div className={`flex items-center ${cfg.gapClass} shrink-0`}>
        {Array.from({ length: maxScore }).map((_, index) => {
          // Calcula a fracao de preenchimento da estrela atual (0% a 100%)
          let fillPercent = 0;
          if (clampedScore >= index + 1) {
            fillPercent = 100;
          } else if (clampedScore > index) {
            fillPercent = Math.round((clampedScore - index) * 100);
          }

          return (
            <div
              key={`${componentId}-star-${index}`}
              className={`relative inline-flex items-center justify-center shrink-0 ${cfg.starClass}`}
            >
              {/* Estrela de Fundo (Vazia) */}
              <Star
                className={`${cfg.starClass} ${colors.empty} transition-colors`}
                aria-hidden="true"
              />

              {/* Estrela Sobreposta com Mascara Fracionada (Preenchimento Exato) */}
              {fillPercent > 0 && (
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-300 pointer-events-none"
                  style={{ width: `${fillPercent}%` }}
                  aria-hidden="true"
                >
                  <Star className={`${cfg.starClass} ${colors.filled} shrink-0`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Indicador Numerico e Contagem */}
      {showNumeric && (
        <span className={`ml-1.5 ${cfg.textClass} ${colors.numeric} shrink-0`}>
          {clampedScore.toFixed(2)}
        </span>
      )}

      {typeof reviewsCount === "number" && (
        <span className="text-[11px] text-zinc-500 font-medium ml-1 shrink-0">
          ({reviewsCount} {reviewsCount === 1 ? "avaliação" : "avaliações"})
        </span>
      )}
    </div>
  );
}