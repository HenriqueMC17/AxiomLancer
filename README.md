<div align="center">

# ⚡ AxiomLancer
### Motor de Execução Financeira Autônoma

[![Stack](https://img.shields.io/badge/Stack-Next.js_15_%7C_TypeScript_%7C_Convex-0D0D0D?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Architecture](https://img.shields.io/badge/Arquitetura-Hexagonal_%7C_Clean_Architecture-00FF87?style=flat-square)](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
[![Tests](https://img.shields.io/badge/Testes-98_passed_%7C_10_suites-00FF87?style=flat-square&logo=vitest)](./tests)
[![Governance](https://img.shields.io/badge/Governança-Zero_Trust_%7C_Zero_Secrets-FF6B35?style=flat-square)](./docs)
[![License](https://img.shields.io/badge/Licença-Proprietário_7Keys-3D3D3D?style=flat-square)](./LICENSE)

> *Transforme código em dinheiro sem o constrangimento de cobrar clientes manualmente.*

**Esteira de execução ativa, silenciosa e determinística para freelancers e agências.**  
Pix dinâmico · Régua multicanal · Motor tributário · Previsio BI integrado

</div>

---

## 1. Proposta de Valor

O AxiomLancer elimina os três gargalos que consomem a margem operacional de freelancers:

| Dor | Solução AxiomLancer | Resultado |
|-----|---------------------|-----------|
| Cobrar clientes causa constrangimento | Régua autônoma multicanal (WhatsApp + E-mail) com tom adaptativo | **Fim do constrangimento** |
| Planilhas e conciliações manuais | Esteira determinística com PIX dinâmico e DeduplicationJournal | **10–15h/semana recuperadas** |
| Imposto misturado com lucro | Cofre Virtual DAS com split automático no momento da liquidação | **Provisão do Simples Nacional garantida** |
| Cobrança repetida / duplicada | Hash SHA-256 no `DeduplicationJournal` com idempotência estrita | **Zero cobranças duplicadas** |
| Emergências de cobrança incontroláveis | Safe Mode atômico (< 12ms) via flag no Convex | **Interrupção instantânea** |

### Modelo de Negócio (7Keys)

```
Assinatura Core:    R$ 49,90/mês  —  acesso total à infraestrutura e Previsio BI
Success Fee:        5,00%          —  apenas sobre faturas vencidas efetivamente recuperadas
Faturas pagas em dia:  R$ 0,00    —  zero taxa sobre recebimentos pontuais
```

---

## 2. Arquitetura — Hexagonal (Ports & Adapters)

Domínio financeiro blindado de qualquer detalhe de protocolo externo.  
A lógica de negócio nunca importa frameworks, ORMs ou adaptadores.

```
C:\Dev\AxiomLancer\
├── core/                          # [Domínio Puro — Zero dependências externas]
│   ├── domain/
│   │   ├── entities/              # Client, Invoice, Contract, CycleEvaluation
│   │   ├── value-objects/         # PixPayload (CRC16), MonetaryAmount (decimal.js)
│   │   └── ports/
│   │       └── repositories/      # Interfaces: IInvoiceRepository, IClientRepository…
│   ├── services/                  # ContractService, ProjectService, CycleEvaluationService
│   └── errors/                    # AppError, NotFoundError, ForbiddenError
│
├── infrastructure/                # [Adaptadores — implementam as Ports do core]
│   ├── repositories/
│   │   └── in-memory/             # InMemoryInvoiceRepository, InMemoryClientRepository…
│   ├── jobs/                      # CycleEvaluationTrigger.worker.ts
│   └── database/                  # Database (estado em memória — SSoT para dev)
│
├── app/                           # [Presentation — Next.js App Router]
│   └── api/
│       ├── auth/login/            # JWT HS256 + timingSafeEqual (Zero Secrets)
│       ├── invoices/              # CRUD + recover — BOLA-safe (userId scoped)
│       ├── contracts/             # Máquina de estados + aceite digital imutável
│       ├── projects/              # Gestão de projetos (DIP — injeção explícita)
│       ├── cycle-evaluations/     # 5 dimensões qualitativas + gatilho assíncrono
│       ├── clients/               # CRUD user-scoped via InMemoryClientRepository
│       ├── expenses/              # OPEX categorizado via InMemoryExpenseRepository
│       ├── dashboard/summary/     # DRE gerencial + saldo de caixa
│       ├── predictive-cashflow/   # Horizonte 7–90 dias (Zod-validated)
│       ├── billing-rules/         # Régua D-3 → D+7 (user-scoped)
│       ├── feedbacks/             # GET + POST com ownership check
│       └── dre/                   # DRE filtrado por userId (BOLA-safe)
│
├── components/                    # React Server Components (sem "use client" por padrão)
│   └── axiom/                     # ContractManager, ProjectManager, OpexSummaryCards
│
├── tests/unit/                    # Vitest 3.x — 98 testes / 10 suites
├── docs/api/                      # swagger.json + postman_collection.json
└── .env.example                   # Template de variáveis (Zero Secrets by Design)
```

> **Princípio de Inversão de Dependência (DIP):**  
> `ContractService`, `ProjectService` e `CycleEvaluationService` recebem os repositórios via injeção explícita no construtor — nenhum serviço instancia seu próprio repositório.

---

## 3. Motores de Engenharia Financeira

### 3.1 Régua de Cobrança Autônoma — Máquina de Estados D-3 → D+7

```
D-3  │ Cortesia Preventiva   │ E-mail com incentivo de pontualidade
D-0  │ Dia do Vencimento     │ WhatsApp + PIX dinâmico + QR Code
D+3  │ Lembrete Assertivo    │ Aviso com recálculo de juros e multa pro-rata
D+7  │ Notificação Formal    │ Registro de entrega antes de suspensão de serviços
```

Cada disparo é guardado no `DeduplicationJournal` com hash **SHA-256**.  
Idempotência garantida: a mesma cobrança nunca é enviada duas vezes.

### 3.2 Motor Tributário — Simples Nacional (Fator R)

```
Fator R = Folha Anual (+ pró-labore) / Receita Bruta Total dos últimos 12 meses

Fator R ≥ 28%  →  Anexo III  (alíquota efetiva a partir de 6,00%)
Fator R < 28%  →  Anexo V    (alíquota a partir de 15,50%)
```

O valor do DAS é retido imediatamente no **Cofre Virtual** no momento da liquidação.  
Lucro pessoal e obrigação tributária nunca se misturam.

### 3.3 PIX Dinâmico — BACEN (Resolução BCB nº 1/2020)

Geração nativa de strings _Copia e Cola_ via Value Object `PixPayload` com validação de integridade por **CRC16-CCITT** polimórfico. Conformidade total com o Manual de Padrões para Iniciação do PIX.

### 3.4 Aritmética Monetária Exata

```typescript
// Zero erros IEEE 754 — decimal.js com ROUND_HALF_UP
import Decimal from 'decimal.js'
Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

const total = new Decimal('1499.99').plus('0.01') // => 1500.00 (exato)
```

Campos persistidos como `DECIMAL(12,2)` no schema PostgreSQL canônico `AxiomLancer.sql`.

### 3.5 Gestão de Contratos — Aceite Digital com Não-Repúdio

| Campo | Descrição |
|-------|-----------|
| `accepted_at` | Carimbo de data/hora UTC imutável |
| `signer_ip` | IP de conexão do signatário |
| `signature_hash` | SHA-256 do contrato no momento do aceite |
| `status` | Máquina de estados: `DRAFT → ACTIVE → COMPLETED` |

Contratos com status `ACTIVE` têm termos bloqueados contra adulteração.  
Validação de borda Fail Fast via **Zod** (`start_date <= end_date`).

### 3.6 Sistema de Avaliação de Ciclo (Milestone)

Gatilho automático ao atingir **10 contratos concluídos** ou **30 dias** de ciclo contínuo.

5 dimensões qualitativas avaliadas:
1. Atendimento à Demanda
2. Comunicação
3. Apresentação de Resultados
4. Proatividade em Reuniões
5. Entendimento da Dor do Cliente

Chave determinística `cycle_identifier` com índice `UNIQUE` previne envios duplicados.

### 3.7 Previsio BI — Fluxo Preditivo (Integrado)

Dashboard analítico de liquidez integrado ao ecossistema AxiomLancer:

```
Horizonte selecionável: 30 / 60 / 90 dias

4 Cenários:
  ┌─ realisticBalance          (saldo ponderado por probabilidade)
  ├─ Cenário Realista          (ponderado por Score do Cliente)
  ├─ Cenário Otimista          (100% pontual — valor bruto)
  └─ Cenário Conservador       (65% de recebimento — máximo risco)

Fonte de dados → GET /api/invoices  (BOLA-safe, user-scoped)
                 GET /api/expenses  (BOLA-safe, user-scoped)
```

---

## 4. Segurança & Governança (Zero Trust · Zero Secrets · BOLA-Free)

Baseado nas diretrizes **Secure by Design** do ecossistema `agente-core`:

```
┌─────────────────────────────────────────────────────────┐
│                   CAMADAS DE SEGURANÇA                  │
├─────────────────────────────────────────────────────────┤
│  BORDA      │ Zod schema validation em todas as rotas   │
│  AUTH       │ JWT HS256 + jose algorithm whitelist       │
│  ISOLAMENTO │ userId filter em 100% dos endpoints       │
│  TIMING     │ crypto.timingSafeEqual (anti timing-attack)│
│  SEGREDOS   │ Zero Secrets — .env.example como SSoT     │
│  EMERGÊNCIA │ Safe Mode < 12ms — flag atômica no Convex │
└─────────────────────────────────────────────────────────┘
```

| Vetor de Ataque | Mitigação Implementada |
|-----------------|------------------------|
| **BOLA / IDOR** | `session.userId` obrigatório em todos os repositórios |
| **Timing Attack** | `crypto.timingSafeEqual` com hashes SHA-256 no login |
| **JWT Algorithm Confusion** | `jose` com `{ algorithms: ['HS256'] }` explícito |
| **Payload Malformado** | Zod `safeParse()` na borda — rejeição antes do banco |
| **Hardcoded Secrets** | `.env.example` + `.gitignore` — zero secrets no repo |
| **Cobrança Duplicada** | `DeduplicationJournal` SHA-256 + idempotência estrita |

---

## 5. Qualidade & Testes Automatizados

**Vitest 3.x** · 10 suites · **98 testes** · cobertura de todas as invariantes de domínio

```
✓ tests/unit/monetary.spec.ts           (5)   Precisão decimal.js, BRL, taxas
✓ tests/unit/tax-engine.spec.ts         (3)   Fator R, Anexos III/V, split DAS
✓ tests/unit/rules-engine.spec.ts       (3)   Offsets D-3 → D+7, idempotência
✓ tests/unit/use-cases.spec.ts          (3)   Use cases e DIP (injeção explícita)
✓ tests/unit/message-template.spec.ts  (13)   Templates multicanal + Zod
✓ tests/unit/reputation-score.spec.ts  (11)   Média ponderada e divisão por zero
✓ tests/unit/dashboard-summary.spec.ts  (3)   Caixa vs. OPEX e margem real
✓ tests/unit/project.spec.ts            (7)   Datas, status e proteção LGPD
✓ tests/unit/contract.spec.ts          (14)   Máquina de estados e Zero Trust
✓ tests/unit/cycle-evaluation.spec.ts  (36)   Gatilhos, 5 dimensões e tokens

  Test Suites   10 passed (10)
  Tests         98 passed (98)
  Duration      1.29s
```

```bash
pnpm test                  # Roda toda a suíte
pnpm exec tsc --noEmit     # Validação de tipos TypeScript
```

---

## 6. Guia de Execução

### Pré-requisitos

| Dependência | Versão Mínima |
|-------------|---------------|
| Node.js | 20 LTS+ |
| PNPM | 10+ |
| Conta Convex | Opcional (persistência cloud) |

### Setup

```bash
# 1. Clonar e entrar no projeto
cd C:\Dev\AxiomLancer

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente (Zero Secrets)
cp .env.example .env.local
# Editar .env.local com suas credenciais reais

# 4. Validar tipos TypeScript
pnpm exec tsc --noEmit

# 5. Rodar suíte de testes
pnpm test

# 6. Iniciar em desenvolvimento
pnpm dev
```

### Variáveis de Ambiente (`.env.local`)

```env
# ── Segurança ──────────────────────────────────────────
JWT_SECRET=<mínimo-32-chars-gerado-com-openssl-rand>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Administrador (Fail Fast na boot — obrigatório) ───
ADMIN_EMAIL=admin@axiomlancer.com
ADMIN_PASSWORD=<senha-forte>
ADMIN_NAME=Administrador
ADMIN_USER_ID=<uuid-único>

# ── Convex Cloud ───────────────────────────────────────
CONVEX_DEPLOYMENT=dev:<seu-deployment>
NEXT_PUBLIC_CONVEX_URL=https://<seu-deployment>.convex.cloud
CONVEX_DEPLOY_KEY=dev:<seu-deployment>|<token>
```

> ⚠️ **Zero Secrets:** Nenhuma dessas variáveis pode aparecer hardcoded no código.  
> O servidor rejeita o boot com `BootError` se qualquer variável crítica estiver ausente.

### Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/login` | Autenticação JWT (timingSafeEqual) |
| `GET/POST` | `/api/invoices` | Faturas user-scoped (BOLA-safe) |
| `POST` | `/api/invoices/[id]/recover` | Recuperação de fatura (ownership check) |
| `GET/POST` | `/api/contracts` | Contratos + máquina de estados |
| `POST` | `/api/contracts/[id]/accept` | Aceite digital com não-repúdio |
| `GET/POST` | `/api/projects` | Projetos user-scoped |
| `GET/POST` | `/api/clients` | Clientes via InMemoryClientRepository |
| `GET/POST` | `/api/expenses` | OPEX via InMemoryExpenseRepository |
| `GET` | `/api/dashboard/summary` | DRE gerencial + saldo de caixa |
| `GET` | `/api/predictive-cashflow` | Previsão 7–90 dias (Zod-validated) |
| `GET/POST` | `/api/cycle-evaluations` | Avaliações de ciclo |
| `POST` | `/api/cycle-evaluations/trigger` | Disparo manual do gatilho |
| `GET` | `/api/billing-rules` | Régua D-3 → D+7 user-scoped |
| `GET/POST` | `/api/feedbacks` | Feedbacks com ownership check |
| `GET` | `/api/dre` | DRE filtrado por userId |

Documentação completa: [`docs/api/swagger.json`](./docs/api/swagger.json) · [`docs/api/postman_collection.json`](./docs/api/postman_collection.json)

> **API Versioning:** Rewrites transparentes de `/api/v1/:path*` → `/api/:path*` em `next.config.mjs` para compatibilidade com clientes externos.

---

## 7. Roadmap

```
✅ CONCLUÍDO
   ├── Modelo de dados (Convex + PostgreSQL schema)
   ├── Integração PIX dinâmico (CRC16-CCITT)
   ├── Clean Architecture DIP (100% injeção explícita)
   ├── Segurança BOLA-free em todos os endpoints
   ├── Zero Secrets (.env.example + boot validation)
   └── 98 testes automatizados passando

🔄 EM PROGRESSO
   ├── Régua multicanal WhatsApp Business API
   └── Previsio BI — painel integrado ao frontend

📋 PLANEJADO
   ├── Closed Beta para agências parceiras
   ├── Integração Previsio BI via HTTP Connector
   └── Export de relatórios PDF/Excel
```

---

## 8. Stack Tecnológica

| Camada | Tecnologia | Padrão |
|--------|------------|--------|
| **Frontend** | Next.js 15 App Router · React 19 · TypeScript | RSC sem `"use client"` por padrão |
| **UI** | Tailwind CSS v4 · Geist Font · Grade 8px | APCA · Bento Grid · Dark Mode Tri-Layer |
| **Backend** | Next.js Route Handlers · Zod · jose | Hexagonal Architecture · Fail Fast |
| **Persistência** | Convex (serverless) · PostgreSQL schema | PACELC Theorem · Idempotência SHA-256 |
| **Financeiro** | decimal.js · PIX BACEN | ROUND_HALF_UP · CRC16-CCITT |
| **Testes** | Vitest 3.x | 98 testes · DIP-compliant |
| **DevOps** | PNPM · GitHub Actions · Vercel | CI/CD GitOps · Zero Secrets |

---

## 9. Governança & Autoria

```
Arquitetura & Engenharia     7Keys Studio
Governança Técnica           Henrique Monteiro Cardoso (@agente-core)
Constituição do Projeto      AGENTS.md · agente-core v2026
Design Standards             Grade 8px · APCA · Liquid Glass · Bento Grid
Vinculação BI                C:\Dev\PrevisioBI (Previsio BI: Fluxo Preditivo)
Licença                      Proprietário — 7Keys Studio. Todos os direitos reservados.
```

---

<div align="center">

*AxiomLancer · Motor de Execução Financeira Autônoma*  
*Governado por Clean Architecture · Zero Trust · agente-core v2026*

</div>