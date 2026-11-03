"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

import type { MessageTemplate, ChannelType, ToneOfVoice } from "@/core/domain/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHANNEL_CONFIG: Record<ChannelType, { label: string; icon: React.ElementType; color: string }> = {
  EMAIL:    { label: "E-mail",   icon: Mail,           color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  WHATSAPP: { label: "WhatsApp", icon: MessageSquare,  color: "text-green-400 bg-green-500/10 border-green-500/30" },
  SMS:      { label: "SMS",      icon: Phone,          color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
};

const TONE_CONFIG: Record<ToneOfVoice, { label: string; description: string; color: string }> = {
  AMIGAVEL:  { label: "Amigavel",  description: "Lembretes preventivos e relacionamento",   color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
  FIRME:     { label: "Firme",     description: "Vencimento e atrasos iniciais",              color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  EXECUTIVO: { label: "Executivo", description: "Notificacoes formais e atrasos severos",     color: "border-rose-500/40 text-rose-400 bg-rose-500/10" },
};

const TEMPLATE_VARS = [
  { label: "{{client_name}}",    hint: "Nome do cliente" },
  { label: "{{invoice_number}}", hint: "Numero da fatura" },
  { label: "{{gross_value}}",    hint: "Valor bruto" },
  { label: "{{due_date}}",       hint: "Data de vencimento" },
  { label: "{{pix_key}}",        hint: "Chave PIX" },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  channel: ChannelType;
  tone_of_voice: ToneOfVoice;
  subject: string;
  body: string;
}

const EMPTY_FORM: FormState = {
  channel: "EMAIL",
  tone_of_voice: "AMIGAVEL",
  subject: "",
  body: "",
};

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function ChannelBadge({ channel }: { channel: ChannelType }) {
  const cfg = CHANNEL_CONFIG[channel];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function ToneBadge({ tone }: { tone: ToneOfVoice }) {
  const cfg = TONE_CONFIG[tone];
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TemplateFormModal
// ---------------------------------------------------------------------------

interface TemplateFormModalProps {
  open: boolean;
  editing: MessageTemplate | null;
  onClose: () => void;
  onSave: () => void;
}

function TemplateFormModal({ open, editing, onClose, onSave }: TemplateFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (editing) {
      setForm({
        channel: editing.channel,
        tone_of_voice: editing.tone_of_voice,
        subject: editing.subject,
        body: editing.body,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editing, open]);

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (form.subject.trim().length < 3) errs.subject = "Assunto deve ter ao menos 3 caracteres";
    if (form.body.trim().length < 10) errs.body = "Corpo deve ter ao menos 10 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function insertVar(varLabel: string) {
    setForm((prev) => ({ ...prev, body: prev.body + varLabel }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = editing
        ? `/api/message-templates/${editing.id}`
        : "/api/message-templates";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Erro ao salvar template");
      }

      toast.success(editing ? "Template atualizado!" : "Template criado com sucesso!");
      onSave();
      onClose();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            {editing ? "Editar Template" : "Novo Template de Mensagem"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Canal */}
          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm font-medium">Canal de Envio</Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CHANNEL_CONFIG) as ChannelType[]).map((ch) => {
                const cfg = CHANNEL_CONFIG[ch];
                const Icon = cfg.icon;
                const isActive = form.channel === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, channel: ch }))}
                    className={`flex items-center gap-2 justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                      isActive
                        ? `border-emerald-500 bg-emerald-500/15 text-white`
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tom de Voz */}
          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm font-medium">Tom de Voz</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(TONE_CONFIG) as ToneOfVoice[]).map((tone) => {
                const cfg = TONE_CONFIG[tone];
                const isActive = form.tone_of_voice === tone;
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, tone_of_voice: tone }))}
                    className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                      isActive
                        ? "border-emerald-500 bg-emerald-500/15"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-zinc-300"}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[11px] text-zinc-500 mt-0.5">{cfg.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assunto */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-zinc-300 text-sm font-medium">
              Assunto <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="Ex: Lembrete amigavel: Fatura {{invoice_number}} vence em breve"
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            {errors.subject && (
              <p className="text-rose-400 text-xs">{errors.subject}</p>
            )}
          </div>

          {/* Corpo */}
          <div className="space-y-2">
            <Label htmlFor="body" className="text-zinc-300 text-sm font-medium">
              Corpo da Mensagem <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              id="body"
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Escreva o corpo da mensagem. Use variaveis como {{client_name}} para personalizar."
              className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20 min-h-[120px] resize-y"
            />
            {errors.body && (
              <p className="text-rose-400 text-xs">{errors.body}</p>
            )}

            {/* Variable chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-500 self-center">Variaveis:</span>
              {TEMPLATE_VARS.map(({ label, hint }) => (
                <button
                  key={label}
                  type="button"
                  title={hint}
                  onClick={() => insertVar(label)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-emerald-300 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {loading ? "Salvando..." : editing ? "Salvar Alteracoes" : "Criar Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// DeleteConfirmDialog
// ---------------------------------------------------------------------------

interface DeleteConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function DeleteConfirmDialog({ open, onCancel, onConfirm, loading }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Remover Template?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Esta acao e permanente. O template sera removido e nao podera ser recuperado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 bg-transparent">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
          >
            {loading ? "Removendo..." : "Sim, remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// TemplateCard
// ---------------------------------------------------------------------------

interface TemplateCardProps {
  template: MessageTemplate;
  onEdit: () => void;
  onDelete: () => void;
}

function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  function copyBody() {
    navigator.clipboard.writeText(template.body).catch(() => null);
    toast.success("Corpo copiado para a area de transferencia!");
  }

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-4 space-y-3 hover:border-zinc-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <ChannelBadge channel={template.channel} />
          <ToneBadge tone={template.tone_of_voice} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyBody}
            title="Copiar corpo"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            title="Editar"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title="Remover"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Subject */}
      <p className="text-sm font-semibold text-white leading-snug line-clamp-1">{template.subject}</p>

      {/* Body preview */}
      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{template.body}</p>

      {/* Variable tags found in body */}
      {TEMPLATE_VARS.filter(({ label }) => template.body.includes(label)).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {TEMPLATE_VARS
            .filter(({ label }) => template.body.includes(label))
            .map(({ label }) => (
              <span
                key={label}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700"
              >
                {label}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function MessageTemplateManager() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MessageTemplate | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterChannel, setFilterChannel] = useState<ChannelType | "ALL">("ALL");

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/message-templates", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar templates");
      const data = (await res.json()) as { templates: MessageTemplate[] };
      setTemplates(data.templates);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  function openCreate() {
    setEditingTemplate(null);
    setModalOpen(true);
  }

  function openEdit(template: MessageTemplate) {
    setEditingTemplate(template);
    setModalOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/message-templates/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover template");
      toast.success("Template removido com sucesso!");
      setDeleteTarget(null);
      void fetchTemplates();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const filtered =
    filterChannel === "ALL"
      ? templates
      : templates.filter((t) => t.channel === filterChannel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Templates de Mensagem</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Personalize o tom de voz das suas cobrancas por canal e situacao
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {/* Channel filter */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "EMAIL", "WHATSAPP", "SMS"] as const).map((ch) => {
          const isActive = filterChannel === ch;
          return (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isActive
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              {ch === "ALL" ? "Todos" : ch}
              {ch !== "ALL" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({templates.filter((t) => t.channel === ch).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Skeleton / Empty / Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 animate-pulse">
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded-full bg-zinc-700" />
                <div className="h-5 w-16 rounded-full bg-zinc-700" />
              </div>
              <div className="h-4 w-3/4 rounded bg-zinc-700" />
              <div className="h-12 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 rounded-xl border border-dashed border-zinc-700">
          <MessageSquare className="h-10 w-10 text-zinc-600" />
          <p className="text-zinc-400 font-medium">Nenhum template encontrado</p>
          <p className="text-zinc-600 text-sm max-w-xs">
            {filterChannel === "ALL"
              ? "Crie seu primeiro template para personalizar suas mensagens de cobranca."
              : `Nenhum template para o canal ${filterChannel}.`}
          </p>
          {filterChannel === "ALL" && (
            <Button
              onClick={openCreate}
              variant="outline"
              className="mt-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Criar Primeiro Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => openEdit(template)}
              onDelete={() => setDeleteTarget(template)}
            />
          ))}
        </div>
      )}

      {/* Summary footer */}
      {!isLoading && templates.length > 0 && (
        <p className="text-xs text-zinc-500 text-right">
          {templates.length} template{templates.length !== 1 ? "s" : ""} configurado{templates.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Modals */}
      <TemplateFormModal
        open={modalOpen}
        editing={editingTemplate}
        onClose={() => setModalOpen(false)}
        onSave={fetchTemplates}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}