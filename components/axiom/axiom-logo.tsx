import Image from "next/image";
import { cn } from "@/lib/utils";

interface AxiomLogoProps {
  className?: string;
  size?: number;
  variant?: "emblem" | "full" | "badge";
  priority?: boolean;
}

export function AxiomLogo({
  className,
  size = 40,
  variant = "emblem",
  priority = false,
}: AxiomLogoProps) {
  if (variant === "full") {
    return (
      <div className={cn("relative inline-flex items-center", className)}>
        <Image
          src="/logo-dark.png"
          alt="AxiomLancer SaaS Startup"
          width={size * 3.5}
          height={size}
          priority={priority}
          className="h-auto w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl bg-zinc-900/90 border border-emerald-500/30 p-2 shadow-xl shadow-emerald-950/40 backdrop-blur-md overflow-hidden group",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none" />
        <Image
          src="/logo-emblem.png"
          alt="AxiomLancer Emblem"
          width={size}
          height={size}
          priority={priority}
          className="relative z-10 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  // Default: emblem
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-zinc-900/80 border border-emerald-500/30 p-1 shadow-lg shadow-emerald-500/20 overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-emblem.png"
        alt="AxiomLancer Logo"
        width={size - 8}
        height={size - 8}
        priority={priority}
        className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
}
