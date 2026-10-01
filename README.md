# AxiomLancer ⚡

> **Motor de Execução Financeira Autônoma, Faturamento & Cobrança Preditiva para Freelancers e Microagências**
> *Transforme código e design em dinheiro na conta, sem o constrangimento de cobrar clientes.*

---

## 🧭 Visão Geral

O **AxiomLancer** rompe com o modelo tradicional de dashboards passivos. Em vez de exigir que desenvolvedores e designers alimentem planilhas ou cobrem clientes manualmente no WhatsApp, o AxiomLancer atua como uma **esteira de execução ativa**:

- **Smart Escrows & Liberação por Milestones**: Retenção e liberação automática de pagamento mediante aprovação de entregáveis ou deploy.
- **Régua de Cobrança Preditiva Multicanal**: Disparo automatizado de lembretes corteses via WhatsApp, E-mail e PIX dinâmico, adaptando o tom de acordo com o histórico do cliente.
- **Botão de Pânico (Safe Mode)**: Congelamento instantâneo da esteira de cobrança em 12ms com 1 clique, garantindo controle total sobre a relação com o cliente.
- **Previsio BI & Scoring de Recebíveis**: Previsão determinística de fluxo de caixa e DRE em tempo real, calculando a probabilidade de inadimplência antes do vencimento.
- **Split Tributário Automático no Recebimento**: Provisionamento automático dos impostos (Simples Nacional / MEI) em cofre virtual no instante do pagamento.

---

## 📁 Estrutura do Monorepo

```text
AxiomLancer/
├── .gitignore                      # Regras globais de exclusão do monorepo
├── README.md                       # Documentação principal da plataforma
├── backend/                        # Núcleo Financeiro & Motor de Faturamento (Clean Architecture & DDD)
│   ├── prisma/                     # Schema PostgreSQL (TimescaleDB, RLS, 22 Entidades, 9 Enums)
│   ├── sql/                        # Script SQL mestre de inicialização (init-database.sql)
│   ├── src/
│   │   ├── domain/                 # Domínio Puro (Entities, Money VO, TaxCalculator, InvoiceGeneration, LedgerPosting)
│   │   ├── application/            # Casos de Uso (CreateInvoice, CalculateTaxes, ProcessBillingTrigger, SettleInvoice)
│   │   ├── infrastructure/         # Prisma Repositories, Unit of Work ACID, Redis/BullMQ, Cookies BFF
│   │   └── interfaces/             # Fastify Server, Controllers, Zod Schemas & BFF Auth Plugin
│   └── tests/                      # Suíte de Testes Unitários e Mocks In-Memory (Vitest - >98% Coverage)
├── convex/                         # Banco de Dados e Funções Reativas na Nuvem Convex (Live Cloud)
│   ├── schema.ts                   # Schema reativo Convex com 22 tabelas e 32 índices
│   ├── invoices.ts                 # Queries e Mutations de faturamento em tempo real
│   └── dashboard.ts                # Telemetria financeira em tempo real
└── frontend/                       # Aplicação Angular Moderna (Standalone Components & Signals)
    ├── src/
    │   ├── app/
    │   │   ├── core/               # Services (Finance, Auth, Toast) com Signals e Interceptors BFF
    │   │   ├── pages/              # Landing Page, Dashboard Executivo e Login BFF
    │   │   ├── app.routes.ts       # Rotas com lazy loading
    │   │   └── app.config.ts       # Configurações do Angular (HttpClient, withFetch, withInterceptors)
    │   └── styles.css              # Design System Tri-Layer Dark Mode & Glassmorphism
    └── angular.json                # Configuração do compilador Angular
```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [Angular](https://angular.dev/) (Standalone Components, Signals reativos, Lazy Routing)
- **Backend Core**: [Fastify](https://fastify.dev/) + TypeScript (Clean Architecture, DDD, Unit of Work ACID)
- **BFF & Segurança**: Cookies HttpOnly assinados, SameSite=Strict com `withCredentials: true`
- **Banco de Dados Relacional**: [PostgreSQL](https://www.postgresql.org/) com TimescaleDB (Hypertables) e RLS
- **Banco de Dados em Nuvem Reativo**: [Convex](https://convex.dev/) (Convex Cloud)
- **Estilização**: Design System Vanilla CSS com paleta Tri-Layer Dark Mode (`#07090E`, `#0F172A`, `#1E293B`)
- **Precisão Financeira**: [Decimal.js](https://mikemcl.github.io/decimal.js/) e Value Object `Money`

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18.18+ ou superior
- npm

### 1. Iniciar o Núcleo Financeiro (Backend)

```bash
# Iniciar o backend Fastify (porta 3333)
npm run dev:backend
```

### 2. Iniciar a Aplicação Angular (Frontend)

```bash
# Iniciar o servidor de desenvolvimento do Angular (porta 4200)
npm run dev:frontend
```

Acesse [http://localhost:4200](http://localhost:4200) no seu navegador.

### 3. Deploy e Sincronização do Convex

```bash
# Sincronizar funções e schema com o Convex Cloud
npm run convex:deploy
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Qualidade & Testes Automatizados

O projeto conta com um **Quality Gate Determinístico** seguindo as diretrizes do `.agente-core`:

```powershell
# Executar a esteira completa (TypeScript Typecheck + Vitest + Next.js Build)
cd landing-page
.\validate-all.ps1
```

Comandos individuais:

```bash
# Verificação de tipos estáticos
npm run typecheck

# Suíte de testes unitários (16 testes)
npm test

# Compilação de produção
npm run build
```

---

## 🔒 Licença & Autoria

Desenvolvido com excelência técnica por **[HenriqueMC17](https://github.com/HenriqueMC17)** sob a iniciativa **7Keys Engineering**.
