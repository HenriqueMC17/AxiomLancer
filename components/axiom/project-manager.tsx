"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Building,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { RatingStars } from "@/components/axiom/rating-stars";
import type { Project, Client } from "@/core/domain/types";

interface FormState {
  client_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_in_development: boolean;
  is_public_client_name: boolean;
}

const EMPTY_FORM: FormState = {
  client_id: "",
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  is_in_development: false,
  is_public_client_name: false,
};

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projRes, cliRes] = await Promise.all([
        fetch("/api/projects", { credentials: "include" }),
        fetch("/api/clients", { credentials: "include" }),
      ]);

      if (projRes.ok) {
        const json = await projRes.json();
        setProjects(json.projects);
      }
      if (cliRes.ok) {
        const json = await cliRes.json();
        setClients(json.clients);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados do portfolio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function openCreate() {
    setEditingProject(null);
    setForm({
      ...EMPTY_FORM,
      client_id: clients[0]?.id || "",
      start_date: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setForm({
      client_id: project.client_id,
      name: project.name,
      description: project.description || "",
      start_date: project.start_date,
      end_date: project.end_date || "",
      is_in_development: !project.end_date,
      is_public_client_name: project.is_public_client_name,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = "Nome do projeto obrigatorio (minimo 2 caracteres)";
    }
    if (!form.client_id) {
      errs.client_id = "Selecione a empresa contratante";
    }
    if (!form.start_date) {
      errs.start_date = "Data de inicio obrigatoria";
    }
    if (!form.is_in_development && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      if (end < start) {
        errs.end_date = "A Data de Inicio nao pode ser maior que a Data de Termino";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setFormLoading(true);
    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const payload = {
        ...form,
        end_date: form.is_in_development ? null : (form.end_date || null),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Falha ao salvar projeto");
      }

      toast.success(editingProject ? "Projeto atualizado!" : "Projeto adicionado ao portfolio!");
      setModalOpen(false);
      void fetchData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover projeto");
      toast.success("Projeto removido com sucesso");
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
            <FolderGit2 className="h-5 w-5 text-emerald-400" />
            Vitrine de Projetos &amp; Prova Social
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Gerencie seus casos de sucesso, avaliacoes validadas de clientes e conformidade LGPD
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Novo Projeto
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
              <div className="h-12 bg-zinc-800 rounded" />
              <div className="h-8 bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20">
          <FolderGit2 className="h-10 w-10 text-zinc-600" />
          <p className="text-zinc-300 font-medium">Nenhum projeto cadastrado no portfÃ³lio</p>
          <p className="text-zinc-500 text-xs max-w-sm">
            Adicione seus projetos entregues ou em andamento para exibir aos clientes com garantia LGPD e reputaÃ§Ã£o comprovada.
          </p>
          <Button onClick={openCreate} variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
            Cadastrar Primeiro Projeto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const isInDev = !proj.end_date;
            return (
              <div
                key={proj.id}
                className="group p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 transition-all space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Badges e Botoes de Acao */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Badge de Status do Projeto */}
                      {isInDev ? (
                        <Badge className="border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-[11px] gap-1 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          Em desenvolvimento
                        </Badge>
                      ) : (
                        <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[11px] gap-1 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Concluido
                        </Badge>
                      )}

                      {/* Badge LGPD */}
                      {proj.is_public_client_name ? (
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300 gap-1 font-mono">
                          <ShieldCheck className="h-3 w-3 text-emerald-400" />
                          Empresa Publica
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300/90 bg-amber-500/5 gap-1 font-mono">
                          <ShieldAlert className="h-3 w-3 text-amber-400" />
                          LGPD: Confidencial
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(proj)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(proj)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Nome e Empresa */}
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">{proj.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                      <Building className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Empresa:</span>
                      <strong className={proj.is_public_client_name ? "text-zinc-200" : "text-amber-300 font-mono italic"}>
                        {proj.client_name}
                      </strong>
                    </div>
                  </div>

                  {/* Descricao */}
                  {proj.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>
                  )}
                </div>

                {/* Bottom: Datas e Feedback do Cliente */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Inicio: {proj.start_date}
                    </span>
                    <span>
                      {isInDev ? (
                        <span className="text-cyan-400 font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Presente (Em curso)
                        </span>
                      ) : (
                        `Termino: ${proj.end_date}`
                      )}
                    </span>
                  </div>

                  {/* Card de Prova Social / Feedback validado */}
                  {proj.feedback ? (
                    <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-emerald-400" />
                          Feedback da Empresa Contratante
                        </span>
                        <RatingStars score={proj.feedback.score} size="sm" showNumeric={true} theme="emerald" />
                      </div>
                      {proj.feedback.comments && (
                        <p className="text-[11px] text-zinc-300 italic font-sans leading-tight">
                          &quot;{proj.feedback.comments}&quot;
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 italic">
                      Aguardando avaliacao da empresa contratante ao termino do ciclo.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro / Edicao */}
      <Dialog open={modalOpen} onOpenChange={(v) => { if (!v) setModalOpen(false); }}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              {editingProject ? "Editar Projeto" : "Adicionar Projeto ao PortfÃ³lio"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome do Projeto */}
            <div className="space-y-1.5">
              <Label htmlFor="proj_name" className="text-xs text-zinc-300">
                Nome do Projeto <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="proj_name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ex: Motor de Conciliacao PIX em Tempo Real"
                className="bg-zinc-800 border-zinc-600 text-white text-sm"
              />
              {errors.name && <p className="text-rose-400 text-xs">{errors.name}</p>}
            </div>

            {/* Empresa Contratante */}
            <div className="space-y-1.5">
              <Label htmlFor="proj_client" className="text-xs text-zinc-300">
                Empresa Contratante <span className="text-rose-400">*</span>
              </Label>
              <select
                id="proj_client"
                value={form.client_id}
                onChange={(e) => setForm((p) => ({ ...p, client_id: e.target.value }))}
                className="w-full h-9 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legal_name} ({c.email})
                  </option>
                ))}
              </select>
              {errors.client_id && <p className="text-rose-400 text-xs">{errors.client_id}</p>}
            </div>

            {/* Descricao */}
            <div className="space-y-1.5">
              <Label htmlFor="proj_desc" className="text-xs text-zinc-300">
                Descricao TÃ©cnica do Desafio &amp; Entregas
              </Label>
              <Textarea
                id="proj_desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detalhes da arquitetura, tecnologias utilizadas, ganhos de performance obtidos..."
                className="bg-zinc-800 border-zinc-600 text-white text-sm min-h-[70px]"
              />
            </div>

            {/* Toggle "Em Desenvolvimento" */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-700/80 bg-zinc-800/40">
              <div className="space-y-0.5">
                <Label htmlFor="toggle_dev" className="text-xs font-semibold text-white cursor-pointer">
                  Projeto em Desenvolvimento?
                </Label>
                <p className="text-[11px] text-zinc-400">
                  Desabilita a Data de TÃ©rmino e marca o projeto como &quot;Em curso&quot;.
                </p>
              </div>
              <Switch
                id="toggle_dev"
                checked={form.is_in_development}
                onCheckedChange={(checked) => {
                  setForm((p) => ({
                    ...p,
                    is_in_development: checked,
                    end_date: checked ? "" : p.end_date,
                  }));
                }}
              />
            </div>

            {/* Grid de Datas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="proj_start" className="text-xs text-zinc-300">
                  Data de InÃ­cio <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="proj_start"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                  className="bg-zinc-800 border-zinc-600 text-white text-xs"
                />
                {errors.start_date && <p className="text-rose-400 text-xs">{errors.start_date}</p>}
              </div>

              {/* Data de Termino com Bloqueio Condicional e Camada Cinza */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="proj_end"
                    className={`text-xs ${form.is_in_development ? "text-zinc-500" : "text-zinc-300"}`}
                  >
                    Data de TÃ©rmino
                  </Label>
                  {form.is_in_development && (
                    <span className="text-[10px] text-cyan-400 font-mono">Bloqueado</span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="proj_end"
                    type="date"
                    disabled={form.is_in_development}
                    value={form.is_in_development ? "" : form.end_date}
                    onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                    className={`text-xs transition-all ${
                      form.is_in_development
                        ? "bg-zinc-800/30 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 select-none"
                        : "bg-zinc-800 border-zinc-600 text-white"
                    }`}
                  />
                  {form.is_in_development && (
                    <div
                      className="absolute inset-0 rounded-md bg-zinc-950/40 pointer-events-none border border-dashed border-zinc-700/50"
                      aria-hidden="true"
                    />
                  )}
                </div>
                {errors.end_date && <p className="text-rose-400 text-xs">{errors.end_date}</p>}
              </div>
            </div>

            {/* Switch de Consentimento LGPD */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-700/80 bg-zinc-800/40">
              <div className="space-y-0.5">
                <Label htmlFor="toggle_lgpd" className="text-xs font-semibold text-white cursor-pointer">
                  AutorizaÃ§Ã£o LGPD da Empresa
                </Label>
                <p className="text-[11px] text-zinc-400">
                  Se desativado, o nome do cliente serÃ¡ exibido como &quot;Confidencial&quot;.
                </p>
              </div>
              <Switch
                id="toggle_lgpd"
                checked={form.is_public_client_name}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, is_public_client_name: checked }))}
              />
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
                {formLoading ? "Salvando..." : editingProject ? "Salvar AlteraÃ§Ãµes" : "Cadastrar Projeto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmacao de Exclusao */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-zinc-900 border border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Remover Projeto do PortfÃ³lio?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Esta acao e irreversivel. O projeto &quot;{deleteTarget?.name}&quot; sera removido do seu perfil publico.
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