"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Client Island - Hero Status Pill Badge
 * Isolated motion island respecting RSC boundary conventions.
 */
export function HeroStatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D]/90 border border-white/15 backdrop-blur-md text-amber-400 text-xs font-medium tracking-wide mb-8 shadow-lg shadow-black/50"
    >
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      <span className="text-neutral-200">Axiom Engine 2.0 Released</span>
      <span className="text-neutral-500">|</span>
      <span className="flex items-center gap-1 text-amber-400 font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        Autonomous Intelligence
      </span>
    </motion.div>
  );
}
