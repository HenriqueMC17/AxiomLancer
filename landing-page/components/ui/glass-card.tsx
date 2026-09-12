import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  layer?: "l1" | "l2" | "accent";
  hover?: boolean;
}

/**
 * Pure Server Component (RSC) - Liquid Glass Card
 * Implements Dark Mode Tri-Layer depth (Layer 1 #1A1A1A vs Layer 2 #2D2D2D).
 * Strict adherence to transition-all prohibition per AGENTS.md.
 */
export function GlassCard({
  children,
  className,
  layer = "l1",
  hover = true,
  ...props
}: GlassCardProps) {
  const layerStyles = {
    l1: "bg-[#1A1A1A]/90 border-white/8 text-neutral-200",
    l2: "bg-[#2D2D2D]/95 border-white/15 text-white shadow-2xl shadow-black/80",
    accent: "bg-[#1A1A1A]/95 border-emerald-500/30 text-white shadow-xl shadow-emerald-500/5",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border backdrop-blur-xl p-6 sm:p-8",
        hover &&
          "hover:-translate-y-1 hover:border-emerald-500/40 transition-[transform,border-color,box-shadow] duration-200 will-change-transform",
        layerStyles[layer],
        className
      )}
      style={{ transform: "translate3d(0,0,0)" }}
      {...props}
    >
      {children}
    </div>
  );
}