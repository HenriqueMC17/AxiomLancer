"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rodrigo Sanches",
      role: "Lead Full-Stack Architect",
      company: "SanchesDev Consulting",
      avatar: "RS",
      content: "Cobrar clientes no WhatsApp era o pior momento da minha semana. Dava vergonha e desgastava a relação. O AxiomLancer transformou isso em um processo 100% impessoal e elegante. No primeiro mês recuperei R$ 14.000 em faturas que já dava como perdidas.",
      metric: "R$ 14.000 recuperados",
      rating: 5
    },
    {
      name: "Mariana Alencar",
      role: "Fundadora & Lead Designer",
      company: "Studio Chroma UI/UX",
      avatar: "MA",
      content: "O Split Tributário automático salvou minha empresa. Antes eu gastava o dinheiro que entrava e quando chegava a guia DAS do Simples Nacional eu levava um susto. Agora, a alíquota fica provisionada no cofre na mesma hora. Simplesmente brilhante.",
      metric: "Zero sustos fiscais",
      rating: 5
    },
    {
      name: "Guilherme Furtado",
      role: "Engenheiro de Software Sênior & Freelancer",
      company: "Furtado.tech",
      avatar: "GF",
      content: "Como dev sênior, ver que o sistema usa decimal.js, idempotência estrita com hash no banco e resposta de Safe Mode em menos de 10ms me deu total confiança técnica. Não é um brinquedo de marketing, é engenharia séria de verdade.",
      metric: "12h salvas por semana",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#09090b] font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            PROVA REAL DE QUEM PRODUZ
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Validado por desenvolvedores e criadores que valorizam seu tempo.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Profissionais técnicos independentes e estúdios que abandonaram o estresse financeiro para focar no que fazem de melhor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-emerald-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-emerald-400" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-300 bg-emerald-500/5">
                    {t.metric}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    {t.role} • {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
