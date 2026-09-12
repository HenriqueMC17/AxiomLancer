# ⚡ AxiomLancer Landing Page

Plataforma de inteligência autônoma para freelancers de alta performance, execução de smart escrows criptográficos e eliminação de atritos de faturamento.

Este projeto foi construído e padronizado em estrita conformidade com o framework de governança do [`c:\Dev\.agente-core`](file:///c:/Dev/.agente-core).

---

## 🏛️ Destaques de Engenharia e Arquitetura

1. **RSC First (React Server Components):**
   - A árvore estrutural da landing page (layout, cabeçalhos, grades bento, matriz de objeções e rodapé) é renderizada 100% no servidor.
   - Nós de `"use client"` são estritamente isolados em folhas interativas (ex: `lead-capture-form.tsx`, `hero-status-badge.tsx`, `hero-app-preview.tsx`), reduzindo drasticamente o *JavaScript Interactivity Gap*.

2. **Dark Mode Tri-Layer (Padrão 2026):**
   - **Layer 0 (`#0D0D0D`):** Fundo base profundo com grade matemática sutil.
   - **Layer 1 (`#1A1A1A`):** Superfície para cartões, bento grid e inputs, com borda nítida de `1px` em `rgba(255, 255, 255, 0.08)`.
   - **Layer 2 (`#2D2D2D`):** Elevação para badges, modais, tooltips e destaques, com borda nítida em `rgba(255, 255, 255, 0.15)`.

3. **Performance Gráfica e Física Realista:**
   - Efeitos *Liquid Glass* acelerados por hardware via GPU (`transform: translate3d(0,0,0)`, `will-change: transform, backdrop-filter`).
   - Proibição de `transition-all`: interpolações de layout especificam suas propriedades-alvo exatas.
   - Animações com curva física elástica CSS `linear()`.
   - Micro-interações de IA com streaming cursor (`.ai-cursor`).

4. **Fail Fast & Segurança de Dados:**
   - Validações de lead capture blindadas com **Zod**.
   - Dicionários em memória protegidos contra *Prototype Pollution* via `Object.create(null)`.
   - Contratos explícitos de envio de formulários HTML (`method="POST"`).

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar suíte de testes unitários (Vitest)
npm test

# Verificação estrita de tipagem TypeScript
npm run typecheck

# Gerar build de produção
npm run build
```

---

## 📐 Estrutura de Diretórios

```text
landing-page/
├── app/
│   ├── globals.css           # Tokens @theme Tailwind v4, Tri-Layer e utilitários GPU
│   ├── layout.tsx            # Root Layout com fontes Geist Sans/Mono e metadados SEO
│   └── page.tsx              # Página principal (RSC)
├── components/
│   ├── navigation/           # Navbar global com Liquid Glass
│   ├── hero-section/         # Hero principal (RSC) e ilhas interativas de cliente
│   ├── social-proof-grid/    # Métricas com tabular-nums (RSC)
│   ├── features-bento/       # Bento Grid de funcionalidades (RSC)
│   ├── objections-matrix/    # FAQ e redução de atrito (RSC)
│   ├── pricing-bento/        # Preços com Decoy Highlight L2 (RSC)
│   └── footer-section/       # Rodapé seguro contra hydration mismatch (RSC)
├── lib/
│   ├── actions/              # Server Actions (submit-lead.ts)
│   └── schemas/              # Schemas Zod e defesas contra prototype pollution
├── AGENTS.md                 # Constituição de IA e regras operacionais
└── vitest.config.ts          # Configuração de testes automatizados
```
