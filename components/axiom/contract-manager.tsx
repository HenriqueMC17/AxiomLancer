"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  DollarSign,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MonetaryService } from "@/core/services/monetary.service";
import type { Contract, Client } from "@/core/domain/types";

interface ContractFormState {
  client_id: string;
  title: string;
  description: string;
  contract_value: string;
  start_date: string;
  end_date: string;
  terms_clause: string;
}

const EMPTY_FORM: ContractFormState = {
  client_id: "",
  title: "",
  description: "",
  contract_value: "",
  start_date: "",
  end_date: "",
  terms_clause:
    "1. OBJETO: Prestacao de servicos tecnicos especializados de engenharia de software.\n2. PRAZO E VIGENCIA: As entregas serao realizadas conforme cronograma acordado.\n3. PAGAMENTO E CONDICOES: Os valores serao liquidados via PIX mediante aprovacao de cada entrega.",
};

export function ContractManager() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal de Emissao / Edicao
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [form, setForm] = useState<ContractFormState>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal de Aceite Digital
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedForAccept, setSelectedForAccept] = useState<Contract | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  // Dialog de Exclusao
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cntRes, cliRes] = await Promise.all([
        fetch("/api/contracts", { credentials: "include" }),
        fetch("/api/clients", { credentials: "include" }),
      ]);

      if (cntRes.ok) {
        const json = await cntRes.json();
        setContracts(json.contracts);
      }
      if (cliRes.ok) {
        const json = await cliRes.json();
        setClients(json.clients);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar contratos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function openCreate() {
    setEditingContract(null);
    setForm({
      ...EMPTY_FORM,
      client_id: clients[0]?.id || "",
      start_date: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(contract: Contract) {
    setEditingContract(contract);
    setForm({
      client_id: contract.client_id,
      title: contract.title,
      description: contract.description || "",
      contract_value: contract.contract_value.toString(),
      start_date: contract.start_date,
      end_date: contract.end_date || "",
      terms_clause: contract.terms_clause || EMPTY_FORM.terms_clause,
    });
    setErrors({});
    setModalOpen(true);
  }

  function openAcceptModal(contract: Contract) {
    setSelectedForAccept(contract);
    setSignerName("");
    setSignerEmail("");
    setConfirmTerms(false);
    setAcceptModalOpen(true);
  }

  function validateForm(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim() || form.title.trim().length < 3) {
      errs.title = "Titulo do contrato deve ter ao menos 3 caracteres";
    }
    if (!form.client_id) {
      errs.client_id = "Selecione o cliente contratante";
    }
    const val = parseFloat(form.contract_value);
    if (isNaN(val) || val <= 0) {
      errs.contract_value = "Informe um valor contratual valido maior que zero";
    }
    if (!form.start_date) {
      errs.start_date = "Data de inicio obrigatoria";
    }
    if (form.end_date) {
      const s = new Date(form.start_date);
      const e = new Date(form.end_date);
      if (e < s) {
        errs.end_date = "A Data de Inicio nao pode ser maior que a Data de Termino";
      }
    }
    if (!form.terms_clause.trim() || form.terms_clause.trim().length < 10) {
      errs.terms_clause = "As clausulas e termos contratuais sao obrigatorios";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const url = editingContract
        ? `/api/contracts/${editingContract.id}`
        : "/api/contracts";
      const method = editingContract ? "PUT" : "POST";

      const payload = {
        ...form,
        contract_value: parseFloat(form.contract_value),
        end_date: form.end_date ? form.end_date : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Falha ao salvar contrato");
      }

      toast.success(editingContract ? "Contrato atualizado!" : "Contrato emitido com sucesso!");
      setModalOpen(false);
      void fetchData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleAcceptSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedForAccept) return;
    if (!signerName.trim() || !signerEmail.trim() || !confirmTerms) {
      toast.error("Preencha todos os campos e confirme os termos para validar o aceite digital");
      return;
    }

    setAcceptLoading(true);
    try {
      const res = await fetch(`/api/contracts/${selectedForAccept.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signer_name: signerName.trim(),
          signer_email: signerEmail.trim(),
          confirm_terms: true,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao registrar aceite digital");
      }

      toast.success("Aceite digital registrado com sucesso! O contrato agora esta ativo.");
      setAcceptModalOpen(false);
      void fetchData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setAcceptLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/contracts/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao remover contrato");
      }
      toast.success("Contrato removido com sucesso");
      setDeleteTarget(null);
      void fetchData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            Gestão de Contratos &amp; Aceite Digital
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Formalize escopos, cláusulas e valores com validade jurídica e carimbo imutável
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Emitir Contrato
        </Button>
      </div>

      {/* Skeletons para Zero CLS */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-48 bg-zinc-700/60 rounded" />
                <div className="h-5 w-24 bg-zinc-700/60 rounded" />
              </div>
              <div className="h-16 bg-zinc-800 rounded" />
              <div className="h-10 bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20">
          <FileText className="h-10 w-10 text-zinc-600" />
          <p className="text-zinc-300 font-medium">Nenhum contrato formalizado ainda</p>
          <p className="text-zinc-500 text-xs max-w-sm">
            Emita seu primeiro contrato formal com estipulação de escopo e aceite digital com validade jurídica.
          </p>
          <Button onClick={openCreate} variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
            Emitir Primeiro Contrato
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((cnt) => {
            const isPending = cnt.status === "PENDING_SIGNATURE";
            const isActive = cnt.status === "ACTIVE";

            return (
              <div
                key={cnt.id}
                className="group p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Status e Acoes */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPending && (
                        <Badge className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-[11px] gap-1 font-medium">
                          <Clock className="h-3 w-3" />
                          Aguardando Aceite Digital
                        </Badge>
                      )}
                      {isActive && (
                        <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[11px] gap-1 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Contrato Ativo &amp; Assinado
                        </Badge>
                      )}
                      {!isPending && !isActive && (
                        <Badge variant="outline" className="text-[11px] border-zinc-700 text-zinc-400">
                          {cnt.status}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isPending && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(cnt)}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {cnt.status !== "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(cnt)}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Remover"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Titulo e Cliente */}
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">{cnt.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                      <Building className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Contratante:</span>
                      <strong className="text-zinc-200">{cnt.client_name}</strong>
                    </div>
                  </div>

                  {/* Valor Monetario (Precisao decimal.js) */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <span className="text-xs text-zinc-400">Valor Estipulado:</span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      {MonetaryService.formatBRL(cnt.contract_value)}
                    </span>
                  </div>

                  {/* Clausulas e Descricao */}
                  {cnt.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {cnt.description}
                    </p>
                  )}
                </div>

                {/* Bottom: Datas, Aceite e Botao de Assinatura */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Vigência: {cnt.start_date} {cnt.end_date ? `até ${cnt.end_date}` : "(Tempo indeterminado)"}
                    </span>
                  </div>

                  {/* Se estiver pendente, exibe botao de aceite */}
                  {isPending && (
                    <Button
                      onClick={() => openAcceptModal(cnt)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5 py-1.5 shadow-md shadow-amber-950/50"
                    >
                      <FileCheck className="h-3.5 w-3.5" />
                      Registrar Aceite Digital
                    </Button>
                  )}

                  {/* Se ja foi aceito, exibe carimbo de auditoria imutavel */}
                  {isActive && cnt.accepted_at && (
                    <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-medium">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Aceite Digital Confirmado
                        </span>
                        <span>{new Date(cnt.accepted_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-mono">
                        Assinado por: <strong>{cnt.signer_name}</strong> ({cnt.signer_email})
                      </p>
                      {cnt.signature_hash && (
                        <p className="text-[9px] text-zinc-500 font-mono truncate" title={cnt.signature_hash}>
                          Hash: {cnt.signature_hash}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Emissao / Edicao de Contrato */}
      <Dialog open={modalOpen} onOpenChange={(v) => { if (!v) setModalOpen(false); }}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileText className="h-4 w-4 text-emerald-400" />
              {editingContract ? "Editar Contrato" : "Emitir Novo Contrato"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cnt_title" className="text-xs text-zinc-300">
                Título do Contrato / Escopo <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="cnt_title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ex: Prestacao de Servicos de Engenharia de Software"
                className="bg-zinc-800 border-zinc-600 text-white text-sm"
              />
              {errors.title && <p className="text-rose-400 text-xs">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cnt_client" className="text-xs text-zinc-300">
                  Cliente Contratante <span className="text-rose-400">*</span>
                </Label>
                <select
                  id="cnt_client"
                  value={form.client_id}
                  onChange={(e) => setForm((p) => ({ ...p, client_id: e.target.value }))}
                  className="w-full h-9 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.legal_name}
                    </option>
                  ))}
                </select>
                {errors.client_id && <p className="text-rose-400 text-xs">{errors.client_id}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cnt_val" className="text-xs text-zinc-300">
                  Valor Total (R$) <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="cnt_val"
                  type="number"
                  step="0.01"
                  value={form.contract_value}
                  onChange={(e) => setForm((p) => ({ ...p, contract_value: e.target.value }))}
                  placeholder="24500.00"
                  className="bg-zinc-800 border-zinc-600 text-white text-sm font-mono"
                />
                {errors.contract_value && <p className="text-rose-400 text-xs">{errors.contract_value}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cnt_start" className="text-xs text-zinc-300">
                  Início da Vigência <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="cnt_start"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                  className="bg-zinc-800 border-zinc-600 text-white text-xs"
                />
                {errors.start_date && <p className="text-rose-400 text-xs">{errors.start_date}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cnt_end" className="text-xs text-zinc-300">
                  Término (Opcional)
                </Label>
                <Input
                  id="cnt_end"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                  className="bg-zinc-800 border-zinc-600 text-white text-xs"
                />
                {errors.end_date && <p className="text-rose-400 text-xs">{errors.end_date}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cnt_desc" className="text-xs text-zinc-300">
                Resumo do Escopo / Descrição
              </Label>
              <Input
                id="cnt_desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Breve resumo executivo do servico prestado"
                className="bg-zinc-800 border-zinc-600 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cnt_terms" className="text-xs text-zinc-300">
                Cláusulas &amp; Termos Contratuais <span className="text-rose-400">*</span>
              </Label>
              <Textarea
                id="cnt_terms"
                value={form.terms_clause}
                onChange={(e) => setForm((p) => ({ ...p, terms_clause: e.target.value }))}
                className="bg-zinc-800 border-zinc-600 text-white text-xs min-h-[90px] font-mono leading-relaxed"
              />
              {errors.terms_clause && <p className="text-rose-400 text-xs">{errors.terms_clause}</p>}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {formLoading ? "Salvando..." : editingContract ? "Salvar Alterações" : "Emitir Contrato"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Aceite Digital Formal */}
      <Dialog open={acceptModalOpen} onOpenChange={(v) => { if (!v) setAcceptModalOpen(false); }}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileCheck className="h-5 w-5 text-amber-400" />
              Aceite Digital do Contrato
            </DialogTitle>
          </DialogHeader>

          {selectedForAccept && (
            <form onSubmit={handleAcceptSubmit} className="space-y-4">
              <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-1 text-xs">
                <div className="font-bold text-white text-sm">{selectedForAccept.title}</div>
                <div className="text-zinc-400">
                  Contratante: <strong className="text-zinc-200">{selectedForAccept.client_name}</strong> &bull; Valor:{" "}
                  <strong className="text-emerald-400 font-mono">
                    {MonetaryService.formatBRL(selectedForAccept.contract_value)}
                  </strong>
                </div>
                <div className="pt-2 text-[11px] text-zinc-400 max-h-28 overflow-y-auto font-mono bg-zinc-900 p-2 rounded border border-zinc-800">
                  {selectedForAccept.terms_clause}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sign_name" className="text-xs text-zinc-300">
                  Nome Completo do Representante Legal <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="sign_name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Menezes"
                  className="bg-zinc-800 border-zinc-600 text-white text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sign_email" className="text-xs text-zinc-300">
                  E-mail Corporativo do Signatário <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="sign_email"
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  placeholder="carlos@empresa.com"
                  className="bg-zinc-800 border-zinc-600 text-white text-sm"
                  required
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="chk_terms"
                  checked={confirmTerms}
                  onCheckedChange={(c) => setConfirmTerms(c === true)}
                  className="mt-0.5 border-zinc-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label htmlFor="chk_terms" className="text-xs text-zinc-300 cursor-pointer leading-tight">
                  Declaro que li, concordo integralmente com os termos e valores estipulados e registro meu aceite digital com validade jurídica.
                </Label>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={acceptLoading || !confirmTerms}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  {acceptLoading ? "Registrando Aceite..." : "Confirmar Aceite Digital"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Exclusao */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-zinc-900 border border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover Contrato?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta acao e permanente. Contratos assinados e ativos nao podem ser deletados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 bg-transparent">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {deleteLoading ? "Removendo..." : "Sim, remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}