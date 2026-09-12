import { ShieldCheck } from "lucide-react";

const ecosystems = [
  { name: "Devs Full Stack PJ", tag: "Autônomos" },
  { name: "UI/UX & Product Designers", tag: "Freelancers" },
  { name: "Microagências Digitais", tag: "Estúdios" },
  { name: "Consultorias Tech", tag: "Boutique" },
  { name: "Engenheiros Mobile", tag: "Independentes" },
  { name: "Criadores de Software", tag: "Bootstrappers" },
];

/**
 * Pure Server Component (RSC) - Trusted Ecosystem Partners
 * Establishes authority with target personas (freelancers and microagencies).
 */
export function TrustedBy() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/8 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <p className="text-xs font-mono font-medium text-neutral-400 tracking-widest uppercase">
            A infraestrutura preferida por quem atua como um exército de um homem só
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ecosystems.map((eco) => (
            <div
              key={eco.name}
              className="p-3 rounded-xl bg-[#1A1A1A]/80 border border-white/8 hover:border-emerald-500/30 transition-[border-color,background-color] duration-150 text-center flex flex-col items-center justify-center group"
            >
              <span className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-300 transition-[color] duration-150 font-sans block">
                {eco.name}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">
                {eco.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}