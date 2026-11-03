"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, LogIn, Zap, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("henrique@7keys.dev");
  const [password, setPassword] = useState("7keys2026");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao fazer login");
        return;
      }
      toast.success("Bem-vindo, " + data.user.name + "!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Erro de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md space-y-8"
      >
        {/* Logo area */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.45, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 text-black font-black text-4xl shadow-2xl shadow-emerald-500/40">
              A
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-zinc-950"></span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">AxiomLancer</h1>
              <Badge className="bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold tracking-widest px-2">
                7Keys
              </Badge>
            </div>
            <p className="text-sm text-zinc-400">Motor de Execucao Financeira Autonoma</p>
            <p className="text-xs text-zinc-600 mt-0.5">Faturamento. Cobranca. Controle.</p>
          </motion.div>
        </div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8 shadow-2xl shadow-black/50 space-y-6"
        >
          <div>
            <h2 className="text-base font-bold text-white">Acessar plataforma</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Insira suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-zinc-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 h-11 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-zinc-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-zinc-800/60 border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 h-11 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar na Plataforma
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2"
          >
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Zap className="h-3.5 w-3.5" />
              Credenciais de demonstracao
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">E-mail</p>
                <p className="text-xs text-zinc-300 font-mono">henrique@7keys.dev</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Senha</p>
                <p className="text-xs text-zinc-300 font-mono">7keys2026</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="text-center text-xs text-zinc-700"
        >
          &copy; 2026 AxiomLancer &mdash; Equipe{" "}
          <span className="text-zinc-500 font-semibold">7Keys</span>. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}