"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, QrCode, Copy, Check, Sparkles, AlertCircle, ArrowUpRight, DollarSign } from "lucide-react";
import { MonetaryService } from "@/core/services/monetary.service";
import { toast } from "sonner";
import type jsPDFType from "jspdf";
import { Invoice, Client } from "@/core/domain/types";

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Modal de CriaÃ§Ã£o de Fatura
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`FAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [grossValue, setGrossValue] = useState<number>(5000);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Modal de PIX
  const [activePixInvoice, setActivePixInvoice] = useState<Invoice | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data.invoices || []);
      setClients(data.clients || []);
      if (data.clients?.length > 0 && !selectedClientId) {
        setSelectedClientId(data.clients[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: selectedClientId,
          invoice_number: invoiceNumber,
          gross_value: Number(grossValue),
          due_date: dueDate,
          tax_rate: 6.0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Fatura emitida com Split TributÃ¡rio!", {
          description: `Valor Bruto: ${MonetaryService.formatBRL(data.tax_provision.gross_value)} | RetenÃ§Ã£o Cofre: ${MonetaryService.formatBRL(data.tax_provision.virtual_safe_deposit)} (Simples Nacional 6%)`,
        });
        setOpenCreateDialog(false);
        fetchInvoices();
        setInvoiceNumber(`FAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      } else {
        toast.error("Falha ao emitir fatura", { description: JSON.stringify(data.error) });
      }
    } catch (err: unknown) {
      toast.error("Erro na requisiÃ§Ã£o", { description: (err as Error).message });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRecoverInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate_percent: 5.0 }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Fatura Inadimplente Recuperada!", {
          description: data.breakdown.roi_message,
          duration: 6000,
        });
        fetchInvoices();
      }
    } catch (err: unknown) {
      toast.error("Erro ao registrar recuperaÃ§Ã£o", { description: (err as Error).message });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Chave PIX Copia e Cola copiada para a Ã¡rea de transferÃªncia!");
    setTimeout(() => setCopied(false), 2000);
  };

  // P-PDF: Exportar fatura como PDF via jsPDF
  const exportInvoicePDF = async (inv: { id: string; invoice_number: string; client_id: string; gross_value: number; tax_rate: number; tax_provisioned: number; net_value: number; pix_key?: string; due_date: string; created_at: string; status: string; }) => {
    const jsPDF = (await import("jspdf")).default;
    const { default: autoTable } = await import("jspdf-autotable");
    const doc: jsPDFType = new jsPDF();
    const clientName = clients.find((c) => c.id === inv.client_id)?.legal_name ?? "Cliente";

    // Header escuro
    (doc as unknown as { setFillColor: (...a: number[]) => void }).setFillColor(9, 9, 11);
    (doc as unknown as { rect: (...a: unknown[]) => void }).rect(0, 0, 210, 40, "F");
    (doc as unknown as { setTextColor: (...a: number[]) => void }).setTextColor(16, 185, 129);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("AxiomLancer", 14, 20);
    doc.setFontSize(10);
    (doc as unknown as { setTextColor: (...a: number[]) => void }).setTextColor(161, 161, 170);
    doc.text("Plataforma de Gestao para Freelancers -- 7Keys", 14, 30);

    (doc as unknown as { setTextColor: (...a: number[]) => void }).setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Fatura " + inv.invoice_number, 14, 55);

    autoTable(doc, {
      startY: 65,
      head: [["Campo", "Valor"]],
      body: [
        ["Cliente", clientName],
        ["Numero da Fatura", inv.invoice_number],
        ["Status", inv.status],
        ["Data de Vencimento", new Date(inv.due_date).toLocaleDateString("pt-BR")],
        ["Valor Bruto", "R$ " + inv.gross_value.toFixed(2)],
        ["Aliquota Efetiva", inv.tax_rate.toFixed(2) + "%"],
        ["Imposto Provisionado", "R$ " + inv.tax_provisioned.toFixed(2)],
        ["Valor Liquido", "R$ " + inv.net_value.toFixed(2)],
        ["Chave PIX", inv.pix_key ?? "â€”"],
        ["Criado em", new Date(inv.created_at).toLocaleDateString("pt-BR")],
      ],
      headStyles: { fillColor: [9, 9, 11] as [number, number, number], textColor: [16, 185, 129] as [number, number, number] },
      alternateRowStyles: { fillColor: [244, 244, 245] as [number, number, number] },
      styles: { fontSize: 10 },
    });

    const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number; pageSize: { height: number } } }).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      (doc as unknown as { setTextColor: (...a: number[]) => void }).setTextColor(161, 161, 170);
      doc.text(
        "AxiomLancer -- 7Keys | Gerado em " + new Date().toLocaleString("pt-BR") + " | Pagina " + i + "/" + pageCount,
        105,
        (doc as unknown as { internal: { pageSize: { height: number } } }).internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save("fatura-" + inv.invoice_number + ".pdf");
    toast.success("PDF exportado com sucesso!", { description: "fatura-" + inv.invoice_number + ".pdf" });
  };

  // Preview do Split de Imposto em tempo real no formulÃ¡rio
  const previewSplit = MonetaryService.calculateTaxSplit(grossValue || 0, 6.0);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold tracking-tight">GestÃ£o de Faturas & Split de Impostos</CardTitle>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                  Cofre Virtual Ativo
                </Badge>
              </div>
              <CardDescription className="text-sm mt-1">
                Faturamento autÃ´nomo com provisÃ£o tributÃ¡ria instantÃ¢nea (Simples Nacional) e liquidaÃ§Ã£o via PIX
              </CardDescription>
            </div>

            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shrink-0">
                  <Plus className="h-4 w-4" />
                  Emitir Fatura
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Nova Fatura com Split TributÃ¡rio</DialogTitle>
                  <DialogDescription>
                    O sistema isolarÃ¡ automaticamente o valor do Simples Nacional em cofre virtual.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateInvoice} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="client">Cliente</Label>
                    <select
                      id="client"
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.legal_name} (Tom: {c.tone_of_voice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="num">NÂº da Fatura</Label>
                      <Input
                        id="num"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="due">Data de Vencimento</Label>
                      <Input
                        id="due"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gross">Valor Bruto do ServiÃ§o (R$)</Label>
                    <Input
                      id="gross"
                      type="number"
                      step="0.01"
                      value={grossValue}
                      onChange={(e) => setGrossValue(Number(e.target.value))}
                      required
                    />
                  </div>

                  {/* VisualizaÃ§Ã£o do Split TributÃ¡rio em Tempo Real */}
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1.5 text-xs font-mono">
                    <span className="font-bold text-emerald-400 block font-sans">
                      Split TributÃ¡rio AutomÃ¡tico (Simples Nacional 6.00%):
                    </span>
                    <div className="flex justify-between text-muted-foreground">
                      <span>ProvisÃ£o Cofre de Impostos:</span>
                      <span className="text-amber-400 font-bold">
                        {MonetaryService.formatBRL(previewSplit.taxProvisioned)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Valor LÃ­quido Real (Freelancer):</span>
                      <span className="text-emerald-400 font-bold">
                        {MonetaryService.formatBRL(previewSplit.netValue)}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" disabled={isCreating} className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold">
                    {isCreating ? "Processando..." : "Emitir e Gerar PIX DinÃ¢mico"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-3.5">Fatura</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Vencimento</th>
                  <th className="p-3.5">Valor Bruto</th>
                  <th className="p-3.5">Cofre Imposto (6%)</th>
                  <th className="p-3.5">LÃ­quido Real</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">AÃ§Ãµes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => {
                  const isOverdue = inv.status === "OVERDUE";
                  const isPaid = inv.status === "PAID";
                  const isDraft = inv.status === "DRAFT";

                  return (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-bold text-foreground">{inv.invoice_number}</td>
                      <td className="p-3.5 font-sans font-medium text-foreground">{clients.find((c) => c.id === inv.client_id)?.legal_name ?? "Cliente"}</td>
                      <td className="p-3.5 text-muted-foreground">
                        {new Date(inv.due_date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3.5 font-bold text-foreground">
                        {MonetaryService.formatBRL(inv.gross_value)}
                      </td>
                      <td className="p-3.5 text-amber-400">
                        {MonetaryService.formatBRL(inv.tax_provisioned)}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400">
                        {MonetaryService.formatBRL(inv.net_value)}
                      </td>
                      <td className="p-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono uppercase ${
                            isPaid
                              ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                              : isOverdue
                              ? "border-rose-500/50 text-rose-400 bg-rose-500/10 animate-pulse"
                              : isDraft
                              ? "border-zinc-500 text-zinc-400 bg-zinc-500/10"
                              : "border-amber-500/50 text-amber-400 bg-amber-500/10"
                          }`}
                        >
                          {inv.status}
                          {inv.recovered_by_engine && " (RECUPERADA)"}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {inv.pix_key && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-zinc-700 hover:border-emerald-500"
                            onClick={() => setActivePixInvoice(inv)}
                          >
                            <QrCode className="h-3.5 w-3.5 mr-1" />
                            PIX
                          </Button>
                        )}

                        {isOverdue && (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                            onClick={() => handleRecoverInvoice(inv.id)}
                            title="Simula quitaÃ§Ã£o via motor e cobra Take Rate de 5%"
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            Recuperar (5% Take Rate)
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500"
                          onClick={() => exportInvoicePDF(inv)}
                          title="Exportar fatura como PDF"
                        >
                          PDF
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal PIX Copia e Cola / QR Code */}
      {activePixInvoice && (
        <Dialog open={!!activePixInvoice} onOpenChange={() => setActivePixInvoice(null)}>
          <DialogContent className="sm:max-w-[420px] text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5 text-emerald-400" />
                PIX DinÃ¢mico: {activePixInvoice.invoice_number}
              </DialogTitle>
              <DialogDescription>
                Fatura de {MonetaryService.formatBRL(activePixInvoice.gross_value)} emitida para {clients.find(c => c.id === activePixInvoice.client_id)?.legal_name ?? "Cliente"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl my-2 border border-zinc-200">
              {/* QR Code Canvas Visual Representation */}
              <div className="w-48 h-48 bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-white p-3 space-y-2">
                <QrCode className="w-32 h-32 text-emerald-400" />
                <span className="text-[10px] font-mono text-zinc-400">PIX BACEN DINÃ‚MICO</span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label className="text-xs text-muted-foreground">Chave PIX Copia e Cola:</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={activePixInvoice.pix_qr_code || activePixInvoice.pix_key || ""}
                  className="font-mono text-xs truncate bg-muted/50"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(activePixInvoice.pix_qr_code || activePixInvoice.pix_key || "")}
                  className="shrink-0 gap-1.5"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}



