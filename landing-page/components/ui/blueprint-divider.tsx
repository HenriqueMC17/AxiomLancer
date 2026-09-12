interface BlueprintDividerProps {
  variant?: "stepped" | "diamond" | "tech";
  className?: string;
}

/**
 * Pure Server Component (RSC) - Blueprint Technical Geometric Divider
 * Geometric dividers with Trust Navy and Growth Emerald styling.
 */
export function BlueprintDivider({
  variant = "diamond",
  className = "",
}: BlueprintDividerProps) {
  if (variant === "stepped") {
    return (
      <div className={`flex items-center justify-center my-16 ${className}`} aria-hidden="true">
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-emerald-500/30" />
          <div className="w-1.5 h-1.5 rotate-45 border border-emerald-400/80 bg-emerald-500/20" />
          <div className="w-2.5 h-2.5 rotate-45 border border-emerald-400 bg-emerald-500/40" />
          <div className="w-1.5 h-1.5 rotate-45 border border-emerald-400/80 bg-emerald-500/20" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-emerald-500/20 to-emerald-500/30" />
        </div>
      </div>
    );
  }

  if (variant === "tech") {
    return (
      <div className={`flex items-center justify-center my-16 ${className}`} aria-hidden="true">
        <div className="flex items-center gap-3 w-full max-w-sm">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/20 to-emerald-500/20" />
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest px-2 py-0.5 rounded border border-white/10 bg-[#0F1E36]">
            0xAXIOM
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-blue-500/20 to-emerald-500/20" />
        </div>
      </div>
    );
  }

  // Default: Diamond
  return (
    <div className={`flex items-center justify-center my-16 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-emerald-500/40" />
        <div className="w-2 h-2 rotate-45 bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/50" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-emerald-500/20 to-emerald-500/40" />
      </div>
    </div>
  );
}
