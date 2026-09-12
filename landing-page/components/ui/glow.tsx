import { cn } from "@/lib/utils";

interface GlowProps {
  color?: "emerald" | "navy" | "hybrid" | "amber";
  position?: "top-center" | "top-left" | "top-right" | "bottom-center" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Pure Server Component (RSC) - Ambient Volumetric Glow
 * Inspired by EcoVolt design engineering.
 * Hardware-accelerated with GPU translate3d and will-change-transform.
 */
export function Glow({
  color = "emerald",
  position = "top-center",
  size = "md",
  className,
}: GlowProps) {
  const colors = {
    emerald: "bg-[#2E7D32]/15",
    navy: "bg-[#1A2B4C]/25",
    hybrid: "bg-gradient-to-tr from-[#1A2B4C]/30 via-[#2E7D32]/15 to-transparent",
    amber: "bg-amber-500/10",
  };

  const sizes = {
    sm: "w-[300px] h-[300px] blur-[80px]",
    md: "w-[500px] h-[350px] blur-[110px]",
    lg: "w-[800px] h-[450px] blur-[150px]",
    xl: "w-[1100px] h-[600px] blur-[180px]",
  };

  const positions = {
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-left": "-top-10 -left-10",
    "top-right": "-top-10 -right-10",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full will-change-transform",
        colors[color],
        sizes[size],
        positions[position],
        className
      )}
      style={{ transform: "translate3d(0, 0, 0)" }}
    />
  );
}