# 📜 DIRETRIZES PARA AGENTES DE IA (`AGENTS.md`) - AxiomLancer Landing Page

Este documento estabelece as leis operacionais e arquiteturais inegociáveis para agentes de Inteligência Artificial que operem na pasta [`c:\Dev\AxiomLancer\landing-page`](file:///c:/Dev/AxiomLancer/landing-page), em estrita consonância com a Constituição Suprema em [`c:\Dev\.agente-core\AGENTS.md`](file:///c:/Dev/.agente-core/AGENTS.md).

---

## 🏛️ 1. Princípios Arquiteturais e RSC First

- **React Server Components (RSC):** O padrão obrigatório para qualquer componente é ser um Server Component (RSC).
- **Proibição de `"use client"` em Containers:** A diretiva `"use client"` é estritamente proibida em arquivos de layout, páginas principais (`page.tsx`) ou componentes de seção container. Ela só pode ser declarada em nós folha mínimos que exijam interatividade do usuário (ex: formulários, botões interativos, ilhas de animação de micro-estado).
- **FSD Alignment:** Separação estrita entre `app/` (Application Layer / Entrypoints), `components/` (UI Slices e seções modulares) e `lib/` (domínio, schemas de validação e server actions).

---

## 🎨 2. Padrão de Design Engineering Premium (2026)

- **Dark Mode Tri-Layer:**
  - **Layer 0 (Base):** `#0D0D0D` (fundo principal de tela).
  - **Layer 1 (Card/Surface):** `#1A1A1A` com borda fina de `1px` em `rgba(255, 255, 255, 0.08)`.
  - **Layer 2 (Elevated/Overlay):** `#2D2D2D` com borda fina de `1px` em `rgba(255, 255, 255, 0.15)`.
- **Proibição de `transition: all`:** É expressamente proibido utilizar `transition-all`. As transições devem especificar cirurgicamente suas propriedades-alvo (ex: `transition-[transform,border-color,box-shadow]` ou `transition-colors`) para preservar as threads do navegador.
- **Isolamento de Threads (Compositor vs Main Thread):** Efeitos de desfoque (*Liquid Glass*) e movimentações devem ser delegadas à GPU através de `transform: translate3d(0, 0, 0)` e `will-change`.
- **Tipografia Técnica:** Utilização obrigatória da família Geist (Geist Sans e Geist Mono). Em elementos numéricos e tabelas financeiras, a diretiva `font-variant-numeric: tabular-nums` é obrigatória.
- **Micro-interações de IA:** Indicadores de processamento em tempo real devem conter o cursor vertical `.ai-cursor` com animação de piscamento de 500ms.

---

## 🛡️ 3. Critérios de Qualidade e Segurança

- **Limite de Linhas por Arquivo:** Nenhum arquivo de código fonte deve ultrapassar **300 linhas**. Se atingir este patamar, deve ser modularizado.
- **Complexidade Ciclomática:** Deve ser mantida estritamente abaixo de **10** por função.
- **Fail Fast & Zod Validation:** Validações de entrada de usuário em formulários ou server actions devem falhar rápido usando schemas Zod com parsing seguro.
- **Proteção contra Prototype Pollution:** Objetos dinâmicos gerados em memória devem utilizar `Object.create(null)` ou coleções seguras.
- **Contratos de Formulários HTML:** Todo formulário deve declarar explicitamente seus atributos de contrato (`method="POST"` e `action`).
- **Acessibilidade (A11y):** Elementos interativos devem suportar navegação por teclado, anéis de foco visíveis (`outline-offset-2`) e rótulos acessíveis com suporte a leitores de tela (`aria-live="polite"`).
- **Cobertura de Testes:** Todo código de validação e server actions deve ser acompanhado por testes automatizados (Vitest).

---

*AxiomLancer Landing Page — Engenharia de Precisão e Governança de Vanguarda 2026.*
