import Link from "next/link";

export function TopBanner() {
  return (
    <aside
      aria-label="Aviso de novidade da plataforma"
      className="relative z-50 flex h-9 w-full items-center justify-center border-b border-white/10 bg-[#1A2B4C] px-4 text-xs text-white"
    >
      <div className="flex items-center gap-2">
        <span className="rounded bg-[#2E7D32] px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
          NOVO
        </span>
        <span className="text-zinc-200">
          Régua de Cobrança 2.0 com filas BullMQ e Botão de Pânico instantâneo.
        </span>
        <Link
          href="#funcionalidades"
          className="ml-1 font-medium underline underline-offset-4 hover:text-emerald-400 transition-[color] duration-150"
        >
          Conhecer esteira →
        </Link>
      </div>
    </aside>
  );
}