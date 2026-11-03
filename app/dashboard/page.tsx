"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Zap, Receipt, Calculator, FileSpreadsheet,
  Layers, ShieldAlert, Clock, UserCheck, Users, Wallet, LogOut, MessageSquare, FolderGit2, FileText, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PanicButton } from "@/components/axiom/panic-button";
import { PredictiveCashflowChart } from "@/components/axiom/predictive-cashflow-chart";
import { AutonomousRulesPanel } from "@/components/axiom/autonomous-rules-panel";
import { InvoiceManager } from "@/components/axiom/invoice-manager";
import { PricingCalculator } from "@/components/axiom/pricing-calculator";
import { DREView } from "@/components/axiom/dre-view";
import { RevenueLeakageAlert } from "@/components/axiom/revenue-leakage-alert";
import { OpexSummaryCards } from "@/components/axiom/opex-summary-cards";
import { EscrowMilestones } from "@/components/axiom/escrow-milestones";
import { ProfileForm } from "@/components/axiom/profile-form";
import { MonetaryService } from "@/core/services/monetary.service";
import dynamic from "next/dynamic";

const ClientManager = dynamic(
  () => import("@/components/axiom/client-manager").then((m) => m.ClientManager),
  { ssr: false, loading: () => <div className="text-zinc-500 text-sm py-8 text-center">Carregando...</div> }
);
const ExpenseManager = dynamic(
  () => import("@/components/axiom/expense-manager").then((m) => m.ExpenseManager),
  { ssr: false, loading: () => <div className="text-zinc-500 text-sm py-8 text-center">Carregando...</div> }
);
const MessageTemplateManager = dynamic(
  () => import("@/components/axiom/message-template-manager").then((m) => m.MessageTemplateManager),
  { ssr: false, loading: () => <div className="text-zinc-500 text-sm py-8 text-center">Carregando...</div> }
);
const ProjectManager = dynamic(
  () => import("@/components/axiom/project-manager").then((m) => m.ProjectManager),
  { ssr: false, loading: () => <div className="text-zinc-500 text-sm py-8 text-center">Carregando...</div> }
);
const ContractManager = dynamic(
  () => import("@/components/axiom/contract-manager").then((m) => m.ContractManager),
  { ssr: false, loading: () => <div className="text-zinc-500 text-sm py-8 text-center">Carregando...</div> }
);
const CycleEvaluationsPanel = dynamic(
  () => import("@/components/axiom/cycle-evaluations-panel").then((m) => m.CycleEvaluationsPanel),
  { ssr: false, loading: () => <div className="text-zinc-500 text-sm py-8 text-center">Carregando...</div> }
);

const TABS = [
  { value: "profile",   label: "Perfil",        icon: UserCheck },
  { value: "contracts", label: "Contratos",     icon: FileText },
  { value: "cashflow",  label: "Previsao BI",   icon: TrendingUp },
  { value: "engine",    label: "Motor Cobranca", icon: Zap },
  { value: "invoices",  label: "Faturas & PIX", icon: Receipt },
  { value: "clients",   label: "Clientes",      icon: Users },
  { value: "expenses",  label: "Despesas",      icon: Wallet },
  { value: "pricing",   label: "Precificacao",  icon: Calculator },
  { value: "dre",       label: "DRE Contabil",  icon: FileSpreadsheet },
  { value: "escrow",    label: "Smart Escrows", icon: Layers },
  { value: "templates", label: "Templates",     icon: MessageSquare },
  { value: "portfolio", label: "Portfolio",     icon: FolderGit2 },
  { value: "cycles",    label: "Ciclos",       icon: Star },
] as const;

type TabValue = typeof TABS[number]["value"];

export default function DashboardPage() {
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Sessao encerrada");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Erro ao sair");
    }
  }

  const kpis = [
    { label: "Saldo Projetado (30d)", value: MonetaryService.formatBRL(28840.0), sub: "+12.4% vs. mes anterior", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Faturas em Aberto",     value: MonetaryService.formatBRL(22300.0), sub: "3 faturas pendentes",        icon: Receipt,    color: "text-amber-400" },
    { label: "Recuperado pelo Motor", value: MonetaryService.formatBRL(3800.0),  sub: "Comissao retida: R$190 (5%)", icon: Zap,       color: "text-cyan-400" },
    { label: "Horas Salvas/Semana",   value: "15h",                              sub: "Automacao de cobranca ativa",  icon: Clock,    color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-black font-black text-xl shadow-lg shadow-emerald-500/20">
              A
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">AxiomLancer</span>
                <span className="text-zinc-500 text-xs">por</span>
                <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-[10px] font-mono font-bold tracking-wider">7Keys</Badge>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Motor de Execucao Financeira Autonoma &amp; Cobranca Preditiva</p>
            </motion.div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs">
              <span className="text-zinc-400">Assinatura Core:</span>
              <span className="font-mono font-bold text-emerald-400">R$ 49,90/mes</span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">Ativo</Badge>
            </div>
            <PanicButton onStateChange={setIsPanicActive} />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1.5 text-xs">
              <LogOut className="h-3.5 w-3.5" />Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AnimatePresence>
          {isPanicActive && (
            <motion.div key="panic" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-rose-500/50 bg-rose-950/30 p-4 text-sm text-rose-300 flex items-center gap-4">
              <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">SAFE MODE ATIVADO: Todas as cobrancas estao congeladas</p>
                <p className="text-xs text-rose-200">Nenhuma mensagem sera disparada ate a desativacao da trava de panico.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, sub, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>{label}</span><Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-2xl font-mono font-bold text-white tracking-tight">{value}</div>
              <div className={`text-[11px] ${color} font-medium`}>{sub}</div>
            </motion.div>
          ))}
        </motion.div>

        <OpexSummaryCards />

        <RevenueLeakageAlert />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
          <TabsList className="bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl flex flex-wrap gap-1 h-auto">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-medium text-xs py-2 gap-1.5 flex-shrink-0">
                <Icon className="h-3.5 w-3.5" />{label}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              {activeTab === "profile"   && <TabsContent value="profile"   className="mt-0 focus:outline-none"><ProfileForm /></TabsContent>}
              {activeTab === "contracts" && <TabsContent value="contracts" className="mt-0 focus:outline-none"><ContractManager /></TabsContent>}
              {activeTab === "cashflow"  && <TabsContent value="cashflow"  className="mt-0 focus:outline-none"><PredictiveCashflowChart /></TabsContent>}
              {activeTab === "engine"    && <TabsContent value="engine"    className="mt-0 focus:outline-none"><AutonomousRulesPanel /></TabsContent>}
              {activeTab === "invoices"  && <TabsContent value="invoices"  className="mt-0 focus:outline-none"><InvoiceManager /></TabsContent>}
              {activeTab === "clients"   && <TabsContent value="clients"   className="mt-0 focus:outline-none"><ClientManager /></TabsContent>}
              {activeTab === "expenses"  && <TabsContent value="expenses"  className="mt-0 focus:outline-none"><ExpenseManager /></TabsContent>}
              {activeTab === "pricing"   && <TabsContent value="pricing"   className="mt-0 focus:outline-none"><PricingCalculator /></TabsContent>}
              {activeTab === "dre"       && <TabsContent value="dre"       className="mt-0 focus:outline-none"><DREView /></TabsContent>}
              {activeTab === "escrow"    && <TabsContent value="escrow"    className="mt-0 focus:outline-none"><EscrowMilestones /></TabsContent>}
              {activeTab === "templates" && <TabsContent value="templates" className="mt-0 focus:outline-none"><MessageTemplateManager /></TabsContent>}
              {activeTab === "portfolio" && <TabsContent value="portfolio" className="mt-0 focus:outline-none"><ProjectManager /></TabsContent>}
              {activeTab === "cycles"    && <TabsContent value="cycles"    className="mt-0 focus:outline-none"><CycleEvaluationsPanel /></TabsContent>}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-4 text-center text-xs text-zinc-500 font-mono">
        AxiomLancer SaaS &bull; Desenvolvido pela equipe <strong className="text-zinc-300">7Keys</strong> &bull; Clean Architecture &amp; DDD com precisao decimal.js
      </footer>
    </div>
  );
}