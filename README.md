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

```
AxiomLancer/
├── .gitignore                      # Regras globais de exclusão do monorepo
├── README.md                       # Documentação principal da plataforma
└── landing-page/                   # Aplicação Next.js 15+ de Alta Conversão
    ├── app/                        # App Router (Pure RSC no root, robots, sitemap, SEO)
    ├── components/                 # Componentes atômicos e bento grid
    │   ├── hero-section/           # Hero com Telemetria HUD (Nominal vs. Stress)
    │   ├── panic-sandbox/          # Live Sandbox interativo do Botão de Pânico
    │   ├── features-bento/         # Bento Grid dos 6 pilares de valor
    │   ├── interactive/            # Seletor interativo de personas e micro-CTAs
    │   ├── roi-calculator/         # Calculadora de ROI e horas recuperadas
    │   ├── pricing-bento/          # Tabela de planos com comparativo decoy
    │   └── ui/                     # Lenis Smooth Scroll e componentes visuais
    ├── lib/                        # Núcleo de regras, resiliência e schemas
    │   ├── actions/                # Server Actions blindadas com Circuit Breaker
    │   ├── content/                # SSOT de copywriting e CRO
    │   ├── observability/          # Logger JSON estruturado
    │   ├── resilience/             # Circuit Breaker com Exponential Backoff & Jitter
    │   └── schemas/                # Schemas de validação estrita (Zod)
    ├── validate-all.ps1            # Quality Gate determinístico (.agente-core)
    └── vitest.config.ts            # Configuração da suíte de testes unitários
```

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Pure Server Components)
- **Biblioteca de UI**: [React 19](https://react.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com paleta Tri-Layer Dark Mode (`#0D0D0D`, `#1A1A1A`, `#2D2D2D`)
- **Animações & Gestos**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Validação de Dados**: [Zod](https://zod.dev/)
- **Testes Unitários & Integração**: [Vitest](https://vitest.dev/)
- **Governança & Design System**: [shadcn/ui](https://ui.shadcn.com/) (`components.json`)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18.18+ ou superior
- npm ou yarn

### Instalação & Execução da Landing Page

```bash
# Navegar até a pasta da landing page
cd landing-page

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
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
