"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Menu, 
  X, 
  LayoutDashboard,
  Cpu,
  Calculator,
  Layers,
  HelpCircle,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Visão Geral", href: "#recursos", icon: Layers },
    { label: "Bento Demo", href: "#bento-grid", icon: Cpu },
    { label: "Engenharia", href: "#engenharia", icon: Zap },
    { label: "Calculadora ROI", href: "#roi-calc", icon: Calculator },
    { label: "Comparativo", href: "#comparativo", icon: TrendingUp },
    { label: "Preços", href: "#precos", icon: ShieldCheck },
    { label: "FAQ", href: "#faq", icon: HelpCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/90 border border-emerald-500/35 p-1 shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:border-emerald-500/60 transition-all duration-200 overflow-hidden">
              <Image
                src="/logo-emblem.png"
                alt="AxiomLancer"
                width={36}
                height={36}
                priority
                className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  AxiomLancer
                </span>
                <span className="text-zinc-500 text-xs font-mono">por</span>
                <Badge className="bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono font-bold tracking-wider border border-zinc-700/50">
                  7Keys
                </Badge>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono tracking-tight flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Motor v2.4 Operacional • Latência 8ms
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-zinc-800/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Group */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 font-medium"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/25 gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Acessar Plataforma
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-zinc-800 focus:outline-none"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-zinc-950/95 border-b border-zinc-800/90 px-4 pt-3 pb-6 space-y-4 backdrop-blur-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-zinc-300 hover:text-emerald-400 py-2 border-b border-zinc-900"
                >
                  <link.icon className="h-4 w-4 text-emerald-400" />
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs border-zinc-800 text-zinc-200">
                  Entrar na Conta
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950">
                  Acessar Plataforma
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
