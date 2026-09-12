import { Glow } from "@/components/ui/glow";
import { PanicSandboxIsland } from "./panic-sandbox-island";
import { copywriting } from "@/lib/content/copywriting";

/**
 * Pure Server Component (RSC) - Panic Sandbox Section
 * Live interactive demonstration of predictive sequence and the Panic Button.
 * Employs volumetric glow and hardware-accelerated Liquid Glass depth.
 */
export function PanicSandbox() {
  const { panicSandbox } = copywriting;

  return (
    <section id="sandbox" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-l0 relative scroll-mt-20 overflow-hidden">
      {/* Volumetric Ambient Lighting */}
      <Glow color="hybrid" size="lg" position="center" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Eyebrow badge */}
        <div className="inline-block rounded-full border border-white/10 bg-dark-l1 px-3.5 py-1 text-xs font-mono text-emerald-400 mb-4 shadow-xl">
          {panicSandbox.badge}
        </div>

        {/* Section Headline */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 font-sans text-balance">
          {panicSandbox.title}
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-14 text-pretty leading-relaxed">
          {panicSandbox.subtitle}
        </p>

        {/* Client Island Sandbox */}
        <PanicSandboxIsland />

      </div>
    </section>
  );
}
