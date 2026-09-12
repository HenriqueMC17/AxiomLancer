import Link from "next/link";

/**
 * Pure Server Component (RSC) - Global Footer
 * Designed for 7Keys engineering governance, LGPD compliance, and institutional security.
 */
export function FooterSection() {
  return (
    <footer className="py-12 border-t border-white/8 bg-[#0D0D0D] text-xs text-neutral-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-bold text-white tracking-wider font-mono text-sm uppercase">
            Axiom<span className="text-emerald-400">Lancer</span>
          </span>
          <span className="hidden sm:inline text-neutral-700" aria-hidden="true">|</span>
          <span>Uma tecnologia desenvolvida pela equipe <strong className="text-neutral-300">7Keys</strong>.</span>
        </div>

        <nav aria-label="Links Institucionais e Legais" className="flex flex-wrap items-center justify-center gap-6 font-mono text-neutral-400">
          <Link href="#funcionalidades" className="hover:text-emerald-400 transition-[color] duration-150">
            Funcionalidades
          </Link>
          <Link href="#calculadora-roi" className="hover:text-emerald-400 transition-[color] duration-150">
            Simulador ROI
          </Link>
          <Link href="#precos" className="hover:text-emerald-400 transition-[color] duration-150">
            Preços
          </Link>
          <Link href="#faq" className="hover:text-emerald-400 transition-[color] duration-150">
            FAQ
          </Link>
          <span className="text-emerald-500/80">LGPD Conforme</span>
          <span className="text-neutral-600">© 2026 7Keys.</span>
        </nav>

      </div>
    </footer>
  );
}