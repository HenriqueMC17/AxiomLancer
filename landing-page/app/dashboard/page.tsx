"use client";

import { useState, useEffect } from "react";
import {
  initialDashboardData,
  fetchDashboardData,
  DashboardData,
  InvoiceItem,
  LedgerEntry,
} from "@/lib/services/dashboard-data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KpiSummaryCards } from "@/components/dashboard/kpi-summary-cards";
import { TelemetryChart } from "@/components/dashboard/telemetry-chart";
import { PanicButtonCard } from "@/components/dashboard/panic-button-card";
import { TaxVaultCard } from "@/components/dashboard/tax-vault-card";
import { InvoicesTable } from "@/components/dashboard/invoices-table";
import { AccountingLedgerTable } from "@/components/dashboard/accounting-ledger-table";
import { CreateInvoiceModal } from "@/components/dashboard/modals/create-invoice-modal";
import { CreateExpenseModal } from "@/components/dashboard/modals/create-expense-modal";
import { ExportReportModal } from "@/components/dashboard/modals/export-report-modal";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(initialDashboardData);
  const [isSafeModeActive, setIsSafeModeActive] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("MES");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "alert" } | null>(null);

  // Modals
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData().then((remoteData) => {
      setData(remoteData);
    });
  }, []);

  const triggerToast = (text: string, type: "success" | "alert" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Alternância do Botão de Pânico (Safe Mode)
  const handleToggleSafeMode = () => {
    setIsSafeModeActive((prev) => {
      const next = !prev;
      if (next) {
        triggerToast("Safe Mode ATIVADO: réguas de cobrança congeladas em 12ms.", "alert");
      } else {
        triggerToast("Safe Mode DESATIVADO: esteira de cobrança autônoma restabelecida.", "success");
      }
      return next;
    });
  };

  // 2. Liquidação de Fatura com Split Tributário Automático
  const handleSettleInvoice = (invoiceId: string) => {
    const inv = data.invoices.find((i) => i.id === invoiceId);
    if (!inv || inv.status === "PAID") return;

    const updatedInvoices = data.invoices.map((i) =>
      i.id === invoiceId
        ? { ...i, status: "PAID" as const, paidAt: new Date().toISOString().split("T")[0] }
        : i
    );

    const newLedgerEntries: LedgerEntry[] = [
      {
        id: `TX-LEDGER-${Math.floor(950 + Math.random() * 50)}`,
        entryType: "CREDIT",
        accountCategory: "TAX_RESERVE",
        amount: inv.taxAmount,
        balanceAfter: data.metrics.taxReserve + inv.taxAmount,
        description: `Split Tributário 6.00% provisionado (${inv.id})`,
        correlationId: `CORR-${inv.id}-SETTLE`,
        transactionDate: new Date().toISOString(),
      },
      {
        id: `TX-LEDGER-${Math.floor(950 + Math.random() * 50)}`,
        entryType: "CREDIT",
        accountCategory: "ASSET",
        amount: inv.netAmount,
        balanceAfter: data.metrics.liquidatedRevenue + inv.netAmount,
        description: `Liquidação Líquida recebida (${inv.id})`,
        correlationId: `CORR-${inv.id}-SETTLE`,
        transactionDate: new Date().toISOString(),
      },
      ...data.ledgerEntries,
    ];

    const newMetrics = {
      ...data.metrics,
      liquidatedRevenue: data.metrics.liquidatedRevenue + inv.grossAmount,
      receivables: Math.max(0, data.metrics.receivables - inv.grossAmount),
      taxReserve: data.metrics.taxReserve + inv.taxAmount,
      financialHealthScore: Math.min(100, data.metrics.financialHealthScore + 0.5),
    };

    setData({
      ...data,
      metrics: newMetrics,
      invoices: updatedInvoices,
      ledgerEntries: newLedgerEntries,
      taxBreakdown: {
        ...data.taxBreakdown,
        projectedDasAmount: newMetrics.taxReserve,
      },
    });

    triggerToast(
      `Fatura ${inv.id} liquidada! Split de R$ ${inv.taxAmount.toFixed(2)} retido no Cofre Fiscal.`
    );
  };

  // 3. Emissão de Nova Fatura
  const handleCreateInvoice = (newInvoice: InvoiceItem) => {
    setData((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        receivables: prev.metrics.receivables + newInvoice.grossAmount,
      },
      invoices: [newInvoice, ...prev.invoices],
    }));

    triggerToast(`Fatura ${newInvoice.id} emitida com sucesso! Régua preditiva ativada.`);
  };

  // 4. Registro de Despesa Operacional (OPEX)
  const handleCreateExpense = (amount: number, description: string, category: string) => {
    const newTx: LedgerEntry = {
      id: `TX-LEDGER-${Math.floor(960 + Math.random() * 40)}`,
      entryType: "DEBIT",
      accountCategory: "EXPENSE",
      amount,
      balanceAfter: data.metrics.operationalExpenses + amount,
      description: `${description} (${category})`,
      correlationId: `CORR-EXP-${Date.now().toString().slice(-6)}`,
      transactionDate: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        operationalExpenses: prev.metrics.operationalExpenses + amount,
      },
      ledgerEntries: [newTx, ...prev.ledgerEntries],
    }));

    triggerToast(`Despesa de R$ ${amount.toFixed(2)} debitada no Livro-Razão Contábil.`);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* 1. Header Fixo com Telemetria e Ações */}
      <DashboardHeader
        isSafeModeActive={isSafeModeActive}
        onToggleSafeMode={handleToggleSafeMode}
        onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
        onOpenCreateExpense={() => setIsCreateExpenseOpen(true)}
        onOpenExportReport={() => setIsExportReportOpen(true)}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
      />

      {/* Toast Flutuante de Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-bottom-3 duration-200 font-mono text-xs bg-[#101C33] border-white/20 text-white">
          {toastMessage.type === "alert" ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 2. Placares de BI (Top Level Tri-Layer Cards) */}
        <section aria-label="Placares de BI e Telemetria">
          <KpiSummaryCards metrics={data.metrics} />
        </section>

        {/* 3. Painel Preditivo de Fluxo de Caixa (Middle Level) */}
        <section aria-label="Painel Preditivo">
          <TelemetryChart data={data.cashflowProjection} />
        </section>

        {/* 4. Duplo Centro de Comando: Botão de Pânico & Cofre Virtual */}
        <section aria-label="Comando de Cobrança e Split Fiscal" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PanicButtonCard
            isSafeModeActive={isSafeModeActive}
            onToggleSafeMode={handleToggleSafeMode}
            panicData={data.panicButton}
          />
          <TaxVaultCard taxBreakdown={data.taxBreakdown} />
        </section>

        {/* 5. Gestão de Faturas & Recebíveis (Invoices Table) */}
        <section aria-label="Faturas e Recebíveis">
          <InvoicesTable
            invoices={data.invoices}
            onSettleInvoice={handleSettleInvoice}
            onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
          />
        </section>

        {/* 6. Livro-Razão Contábil (Core Fact Ledger) */}
        <section aria-label="Livro-Razão Contábil">
          <AccountingLedgerTable entries={data.ledgerEntries} />
        </section>

      </main>

      {/* Modais de Ação Rápida */}
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoice}
      />

      <CreateExpenseModal
        isOpen={isCreateExpenseOpen}
        onClose={() => setIsCreateExpenseOpen(false)}
        onCreateExpense={handleCreateExpense}
      />

      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        data={data}
      />

    </div>
  );
}
