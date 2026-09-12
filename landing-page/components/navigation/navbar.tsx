import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";

/**
 * Pure Server Component (RSC) - Top Navigation Bar
 * Designed with Dark Mode Tri-Layer aesthetics and 7Keys branding.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0D0D0D]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] rounded-lg"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-wider font-mono text-sm uppercase text-white">
              Axiom<span className="text-emerald-400">Lancer</span>
            </span>
            <span className="rounded border border-white/10 bg-[#1A1A1A] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
              by 7Keys
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Navegação Principal" className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-300">
          <Link href="#funcionalidades" className="hover:text-emerald-400 transition-[color] duration-150">
            Funcionalidades
          </Link>
          <Link href="#esteira-ativa" className="hover:text-emerald-400 transition-[color] duration-150">
            Esteira Ativa
          </Link>
          <Link href="#calculadora-roi" className="hover:text-emerald-400 transition-[color] duration-150">
            Simulador de ROI
          </Link>
          <Link href="#precos" className="hover:text-emerald-400 transition-[color] duration-150">
            Planos
          </Link>
          <Link href="#faq" className="hover:text-emerald-400 transition-[color] duration-150">
            FAQ
          </Link>
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="#login"
            className="hidden sm:inline-block text-xs font-medium text-neutral-300 hover:text-white transition-[color] duration-150 px-2 py-1"
          >
            Entrar
          </Link>
          <Link
            href="#trial"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-semibold text-xs transition-[background-color,transform] duration-150 active:scale-98 shadow-md shadow-[#2E7D32]/20 outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Testar 14 Dias Grátis</span>
          </Link>
        </div>

      </div>
    </header>
  );
}