"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Camera,
  MapPin,
  Share2,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Instagram,
  Star,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "@/components/axiom/rating-stars";

export function ProfileForm() {
  const [formData, setFormData] = useState({
    first_name: "Henrique",
    last_name: "Monteiro Cardoso",
    social_name: "Henrique Monteiro",
    bio: "Lead Software Architect & Tech Freelancer na 7Keys. Especialista em TypeScript, arquitetura limpa, automações bancárias via PIX e FinTechs de alto desempenho.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    email: "henrique@7keys.dev",
    phone: "(11) 98765-4321",
    address_type: "PJ" as "PF" | "PJ",
    tax_id: "45.123.789/0001-90",
    cep: "01310-100",
    street: "Avenida Paulista",
    number: "1000",
    complement: "Conjunto 701 - 7Keys Tech Studio",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    github_url: "github.com/HenriqueMC17",
    linkedin_url: "linkedin.com/in/henriquemonteirocardoso",
    portfolio_url: "https://7keys.dev",
    instagram_url: "@7keys.dev",
    overall_score: 4.95,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setFormData((prev) => ({ ...prev, ...data.profile }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Busca automática do CEP via ViaCEP API
  const handleCepBlur = async () => {
    const rawCep = formData.cep.replace(/\D/g, "");
    if (rawCep.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
          toast.success("Endereço preenchido automaticamente pelo CEP!");
        } else {
          toast.error("CEP não encontrado.");
        }
      } catch {
        // Fallback silencioso
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Perfil profissional salvo com sucesso!", {
          description: "Os dados foram atualizados no cabeçalho das suas faturas e contratos.",
        });
      } else {
        toast.error("Erro ao salvar", { description: JSON.stringify(data.error) });
      }
    } catch (err: any) {
      toast.error("Falha ao comunicar com o servidor", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = formData.social_name || `${formData.first_name} ${formData.last_name}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Formulário Principal de Edição */}
      <div className="lg:col-span-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Informações Pessoais & Foto */}
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Informações Pessoais</CardTitle>
                  <CardDescription className="text-xs">
                    Identidade profissional exibida aos clientes e nos orçamentos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Foto de Perfil */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl border border-zinc-800 bg-zinc-950/40">
                <div className="relative group">
                  <img
                    src={formData.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                    alt="Foto de Perfil"
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/60 shadow-md shadow-emerald-500/10"
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                  <Label htmlFor="avatar_url" className="text-xs text-muted-foreground">
                    URL da Foto de Perfil (Avatar)
                  </Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => handleChange("avatar_url", e.target.value)}
                    placeholder="https://exemplo.com/minha-foto.jpg"
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="text-xs font-medium">Nome *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    required
                    placeholder="Ex: Henrique"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="text-xs font-medium">Sobrenome *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    required
                    placeholder="Ex: Monteiro Cardoso"
                  />
                </div>
              </div>

              {/* Nome Social */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="social_name" className="text-xs font-medium">Nome Social / Nome Artístico</Label>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground border-zinc-800">
                    Opcional
                  </Badge>
                </div>
                <Input
                  id="social_name"
                  value={formData.social_name}
                  onChange={(e) => handleChange("social_name", e.target.value)}
                  placeholder="Nome pelo qual você prefere ser chamado ou sua marca solo"
                />
              </div>

              {/* Bio do Perfil */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className="text-xs font-medium">Bio Profissional</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formData.bio.length}/400
                  </span>
                </div>
                <Textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  maxLength={400}
                  placeholder="Descreva suas principais competências, stack tecnológica ou serviços oferecidos..."
                  className="text-xs leading-relaxed resize-none"
                />
              </div>

              {/* Contatos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> E-mail de Contato Comercial *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    placeholder="voce@dominio.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Telefone / WhatsApp *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2: Endereço (Pessoa Física ou Empresa - Opcional) */}
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Endereço & Dados Fiscais</CardTitle>
                    <CardDescription className="text-xs">
                      Utilizado para emissão de notas fiscais, faturas e contratos jurídicos
                    </CardDescription>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] border-zinc-800 text-muted-foreground">
                  Opcional
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Seletor PF / PJ */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-950/40 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleChange("address_type", "PF")}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                    formData.address_type === "PF"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Pessoa Física (CPF)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("address_type", "PJ")}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                    formData.address_type === "PJ"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Pessoa Jurídica (CNPJ / Microempresa)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tax_id" className="text-xs font-medium">
                    {formData.address_type === "PJ" ? "CNPJ da Empresa" : "CPF do Titular"}
                  </Label>
                  <Input
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={(e) => handleChange("tax_id", e.target.value)}
                    placeholder={formData.address_type === "PJ" ? "00.000.000/0001-00" : "000.000.000-00"}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cep" className="text-xs font-medium flex items-center justify-between">
                    <span>CEP (Busca Automática)</span>
                    {isSearchingCep && <span className="text-[10px] text-emerald-400 animate-pulse">Buscando endereço...</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleChange("cep", e.target.value)}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                    />
                    <Search className="h-4 w-4 text-muted-foreground absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-3">
                  <Label htmlFor="street" className="text-xs font-medium">Logradouro / Rua / Avenida</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    placeholder="Ex: Av. Paulista"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="number" className="text-xs font-medium">Número</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleChange("number", e.target.value)}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="complement" className="text-xs font-medium">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleChange("complement", e.target.value)}
                    placeholder="Sala 701, Bloco A"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="neighborhood" className="text-xs font-medium">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                    placeholder="Bela Vista"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-medium">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-xs font-medium">UF</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3: Mídias Sociais & Presença Digital (Opcionais) */}
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Mídias Sociais & Links</CardTitle>
                    <CardDescription className="text-xs">
                      Conecte sua presença profissional para enriquecer orçamentos e faturas
                    </CardDescription>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] border-zinc-800 text-muted-foreground">
                  Opcional
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="github" className="text-xs font-medium flex items-center gap-1.5">
                    <Github className="h-3.5 w-3.5 text-zinc-400" /> GitHub
                  </Label>
                  <Input
                    id="github"
                    value={formData.github_url}
                    onChange={(e) => handleChange("github_url", e.target.value)}
                    placeholder="github.com/seuperfil"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="linkedin" className="text-xs font-medium flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 text-blue-400" /> LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange("linkedin_url", e.target.value)}
                    placeholder="linkedin.com/in/seuperfil"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="portfolio" className="text-xs font-medium flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-emerald-400" /> Portfólio / Website
                  </Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio_url}
                    onChange={(e) => handleChange("portfolio_url", e.target.value)}
                    placeholder="https://seuportfolio.dev"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="instagram" className="text-xs font-medium flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-pink-400" /> Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.instagram_url}
                    onChange={(e) => handleChange("instagram_url", e.target.value)}
                    placeholder="@seuperfil"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Submissão */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 shadow-lg shadow-emerald-900/30"
            >
              {isLoading ? "Salvando Alterações..." : "Salvar Perfil Profissional"}
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Card - Como o Cliente Enxerga */}
      <div className="lg:col-span-4 space-y-4">
        <div className="sticky top-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Visualização em Tempo Real (Live Preview)
          </div>

          <Card className="border-border bg-gradient-to-b from-zinc-900/80 to-zinc-950 border-zinc-800 shadow-2xl overflow-hidden">
            {/* Header com Banner */}
            <div className="h-20 bg-gradient-to-r from-emerald-600 via-teal-700 to-zinc-800 relative">
              <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-mono gap-1">
                <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                Score: {formData.overall_score.toFixed(2)}
              </Badge>
            </div>

            <CardContent className="pt-0 pb-6 px-5 relative space-y-4">
              {/* Avatar sobreposto ao banner */}
              <div className="-mt-10 flex items-end justify-between">
                <img
                  src={formData.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                  alt={displayName}
                  className="w-20 h-20 rounded-xl object-cover border-4 border-zinc-900 shadow-xl bg-zinc-900"
                />
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-[10px] font-mono">
                  {formData.address_type === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}
                </Badge>
              </div>

              {/* Nome e Título */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  {displayName}
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </h3>
                {formData.social_name && formData.social_name !== `${formData.first_name} ${formData.last_name}` && (
                  <p className="text-xs text-zinc-400 font-mono">
                    {formData.first_name} {formData.last_name}
                  </p>
                )}
                <p className="text-xs text-zinc-300 font-medium line-clamp-3 leading-relaxed pt-1">
                  {formData.bio || "Nenhuma biografia informada ainda."}
                </p>
              </div>

              {/* Informações de Contato Rápidas */}
              <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-300 truncate">
                  <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <span>{formData.phone}</span>
                </div>
                {formData.city && formData.state && (
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span>{formData.city}, {formData.state} {formData.street && `• ${formData.street}, ${formData.number || "S/N"}`}</span>
                  </div>
                )}
              </div>

              {/* Mídias Sociais no Cartão */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                {formData.github_url && (
                  <a
                    href={`https://${formData.github_url.replace(/^https?:\/\//, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                    title="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {formData.linkedin_url && (
                  <a
                    href={`https://${formData.linkedin_url.replace(/^https?:\/\//, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-blue-400 hover:text-blue-300 transition-colors border border-zinc-800"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {formData.portfolio_url && (
                  <a
                    href={formData.portfolio_url.startsWith("http") ? formData.portfolio_url : `https://${formData.portfolio_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 transition-colors border border-zinc-800"
                    title="Portfólio Pessoal"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {formData.instagram_url && (
                  <a
                    href={`https://instagram.com/${formData.instagram_url.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-pink-400 hover:text-pink-300 transition-colors border border-zinc-800"
                    title="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="pt-2 text-[11px] text-zinc-500 font-mono text-center">
                Visualização pública de faturas • AxiomLancer by 7Keys
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
