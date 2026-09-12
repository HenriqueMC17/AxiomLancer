"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Palette, Briefcase, Building2, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { copywriting } from "@/lib/content/copywriting";

const iconMap = {
  dev: Code2,
  designer: Palette,
  consultant: Briefcase,
  agency: Building2,
};

/**
 * Client Island - Interactive Persona Switcher
 * Inspired by Safe-Finance UserTypeSelector with Framer Motion spring tabs.
 * Dynamically adapts the value proposition to the visitor's specific operational context.
 */
export function PersonaSelector() {
  const { personas } = copywriting;
  const [activeId, setActiveId] = useState<string>("dev");
  const activePersona = personas.find((p) => p.id === activeId) || personas[0];
  const ActiveIcon = iconMap[activePersona.id as keyof typeof iconMap] || Code2;

  return (
    <section id="perfis" className="py-24 bg-dark-l0 relative scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-growth-emerald">
            EXPERIÊNCIA PERSONALIZADA
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">
            Qual é a sua rotina operacional?
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Selecione o seu perfil para ver exatamente como o AxiomLancer atua no seu modelo de negócio.
          </p>
        </div>

        {/* Abas dos Perfis (Layer 1) - 4 Colunas no Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {personas.map((p) => {
            const Icon = iconMap[p.id as keyof typeof iconMap] || Code2;
            const isSelected = activeId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-[border-color,background-color,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-growth-emerald relative ${
                  isSelected
                    ? "bg-dark-l1 border-growth-emerald shadow-xl shadow-growth-emerald/10"
                    : "bg-dark-l1/50 border-white/8 hover:border-white/20 hover:bg-dark-l1/80"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-persona-glow"
                    className="absolute inset-0 rounded-2xl border border-growth-emerald pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      isSelected
                        ? "bg-growth-emerald/20 border-growth-emerald/40 text-emerald-400"
                        : "bg-white/5 border-white/10 text-neutral-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 text-neutral-300">
                    {p.badge}
                  </span>
                </div>

                <span className="text-sm font-bold text-white block font-sans">{p.title}</span>
                <span className="text-xs text-emerald-400 font-mono font-semibold mt-1 block">
                  {p.weeklyGain}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detalhe do Perfil Selecionado com Animação Fluida */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/10 bg-dark-l1 p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Coluna Esquerda: Diagnóstico da Dor vs Solução */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1E36] border border-blue-500/20 text-blue-400 text-xs font-mono mb-3">
                    <ActiveIcon className="w-3.5 h-3.5" />
                    <span>{activePersona.subtitle}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                    {activePersona.primaryBenefit}
                  </h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-neutral-300">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                      O Gargalo Manual Atual:
                    </span>
                    <p className="leading-relaxed">{activePersona.pain}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-neutral-300">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      A Solução com AxiomLancer:
                    </span>
                    <p className="leading-relaxed">{activePersona.solution}</p>
                  </div>
                </div>

                <div>
                  <a
                    href="#trial"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-growth-emerald hover:bg-[#256629] text-white font-semibold text-xs font-mono transition-[background-color,transform] duration-150 active:scale-98 shadow-lg shadow-growth-emerald/20"
                  >
                    <span>Testar no meu fluxo de trabalho</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Coluna Direita: Depoimento e Impacto de Horas */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-l2 border border-white/10 flex flex-col justify-between space-y-6 text-left shadow-xl">
                <div>
                  <div className="flex items-center gap-1 text-emerald-400 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <blockquote className="text-sm text-neutral-200 italic leading-relaxed">
                    &ldquo;{activePersona.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{activePersona.author}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">Usuário Verificado AxiomLancer</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-l1 border border-white/5 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}