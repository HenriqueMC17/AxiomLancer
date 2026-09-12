import { Building2, Clock, DollarSign, HeartHandshake } from "lucide-react";
import { CountUp } from "./count-up";

const stats = [
  { value: "80%", label: "Menos tempo gasto cobrando", icon: Clock },
  { value: "-40%", label: "Redução de inadimplência", icon: DollarSign },
  { value: "R$ 4.8M+", label: "Processados via Gateways", icon: Building2 },
  { value: "100%", label: "Sem constrangimento manual", icon: HeartHandshake },
];

/**
 * Pure Server Component (RSC) - Social Proof Metrics Grid
 * Renders layout on the server and mounts CountUp islands for smooth numeric transitions.
 */
export function SocialProofGrid() {
  return (
    <section className="py-14 border-y border-white/8 bg-[#1A1A1A]/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center px-4 ${index > 0 ? "md:border-l md:border-white/8" : ""}`}
            >
              <stat.icon
                className="w-5 h-5 text-emerald-400 mx-auto mb-2.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-white mb-1 tabular-nums">
                <CountUp value={stat.value} />
              </div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}