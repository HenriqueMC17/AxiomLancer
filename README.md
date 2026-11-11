# AxiomLancer — Motor de Execução Financeira Autônoma

<div align="center">

---

## 1. Visão Geral & Proposta de Valor

O **AxiomLancer** rompe definitivamente com o modelo de planilhas estáticas e ERPs passivos que exigem alimentação manual contínua. Ele atua como uma **esteira de execução ativa, silenciosa e determinística**:

* **Fim do Constrangimento de Cobrança:** Assume a régua de comunicação multicanal (WhatsApp, E-mail, SMS) com tom adaptativo e links de pagamento imediato.
* **Recuperação de 10 a 15 Horas Semanais:** Elimina tarefas administrativas, conciliações bancárias manuais e conferência de comprovantes.
* **Aritmética Monetária Exata:** Zero erros de ponto flutuante do padrão IEEE 754 através de `decimal.js` com arredondamento regulatório `ROUND_HALF_UP` e schema PostgreSQL `DECIMAL(12,2)`.
* **Provisão Automática do Simples Nacional:** Separação imediata do imposto devido no cofre virtual no momento da liquidação (Fator R, Anexo III vs. Anexo V).
* **Safe Mode (< 12ms):** Botão de Pânico com circuito atômico em memória para congelar qualquer disparo em menos de 12 milissegundos.
* **Idempotência Estrita:** Registro de cada evento no `DeduplicationJournal` com hash SHA-256 para impedir cobranças repetidas.

### Modelo de Negócio & Monetização (7Keys)

1. **Assinatura Core (SaaS):** **R$ 49,90/mês** para acesso total à infraestrutura, faturamento ilimitado, Previsio BI, DRE gerencial e Smart Escrows.
2. **Success Fee de Recuperação:** Taxa fixa de **5.00%** retida estritamente sobre faturas vencidas e inadimplentes que forem recuperadas pelo motor autônomo (faturas pagas em dia possuem taxa de R$ 0,00).

---

## 2. Motores de Engenharia Financeira

### 2.1. Régua de Cobrança Autônoma & Máquina de Estados

A esteira atua baseada em janelas temporais relativas à data de vencimento (D):

* **D-3 (Cortesia Preventiva):** Notificação cordial por e-mail com incentivo de pontualidade.
* **D-0 (Dia do Vencimento):** Disparo executivo via WhatsApp com payload PIX dinâmico e QR Code.
* **D+3 (Lembrete Assertivo):** Aviso pontual de atraso com recálculo automático de juros e multa pro-rata.
* **D+7 (Notificação Formal):** Notificação com registro de entrega antes de medidas de suspensão de serviços.

### 2.2. Motor Tributário do Simples Nacional (Fator R)

Calcula em runtime o enquadramento na Lei Complementar nº 123/2006:

```text
Fator R = Folha de Pagamento Anual (incluindo pró-labore) / Receita Bruta Total dos Últimos 12 Meses (RBT12)
```

* Se **Fator R >= 0.28 (28%)**: Enquadra no **Anexo III** (alíquota efetiva reduzida a partir de 6.00%).
* Se **Fator R < 0.28**: Reclassifica para o **Anexo V** (alíquota a partir de 15.50%).
* O valor provisionado é retido preventivamente no **Cofre Virtual DAS**, garantindo que o lucro pessoal do freelancer nunca se misture com a obrigação tributária.

### 2.3. PIX Dinâmico BACEN (CRC16-CCITT)

Geração nativa de strings Copia e Cola em conformidade com o Manual de Padrões para Iniciação do PIX (Resolução BCB nº 1/2020), calculada pelo Value Object `PixPayload` com validação estrita de integridade via checksum CRC16-CCITT polimórfico.

### 2.4. Módulo de Gestão de Contratos & Aceite Digital Imutável

* **Formalização Preventiva:** Registro antecipado do escopo, termos contratuais e remuneração antes do faturamento para blindar contra disputas e inadimplência.
* **Validação de Borda (Fail Fast):** Verificação temporal estrita (`start_date <= end_date` ou `end_date = null` para prazos indeterminados) e termos mínimos via Zod.
* **Aritmética Monetária Exata:** Todos os valores contratuais processados com `decimal.js` com arredondamento regulatório `ROUND_HALF_UP` e tipo `DECIMAL(12,2)`.
* **Aceite Digital com Não-Repúdio:** Registro formal com carimbo de data/hora (`accepted_at`), credenciais do signatário, IP de conexão (`signer_ip`) e hash SHA-256 (`signature_hash`).
* **Imutabilidade e Máquina de Estados:** Contratos aceitos (`ACTIVE`) têm seus termos bloqueados contra adulterações e contam com proteção estrita contra exclusão acidental.

### 2.5. Sistema de Avaliação Recorrente de Ciclo (Milestone 10 Projetos ou 30 Dias)

* **Gatilho Automatizado e Assíncrono:** Monitoramento contínuo de entregas que dispara automaticamente solicitações de feedback qualitativo ao atingir 10 contratos/projetos concluídos ou 30 dias de ciclo contínuo com a empresa.
* **5 Dimensões Qualitativas:** Avaliação granular abrangendo Atendimento à Demanda, Comunicação, Apresentação de Resultados, Proatividade em Reuniões e Entendimento da Dor do Cliente.
* **Controle Estrito de Idempotência:** Chave determinística de ciclo (`cycle_identifier`) com índice UNIQUE, prevenindo envio e submissão duplicada de convites.
* **Validação na Borda (Fail Fast com Zod):** Notas calibradas estritamente de 1.0 a 5.0 e comentário qualitativo mínimo de 15 caracteres antes de persistência.
* **Aritmética Rigorosa:** Cálculo do `general_score` executado via `decimal.js` com política `ROUND_HALF_UP` e tipo de alta precisão `DECIMAL(12,2)`.
* **Zero Trust & Form Público Seguro:** Token único de uso único (`tkn_*`) para preenchimento público sem expor credenciais ou APIs internas do freelancer.
* **Performance Visual Instantânea:** Renderização via Server Components com reserva dimensional rígida (CLS = 0) e recálculo em cascata do score geral de reputação.

---

## 3. Arquitetura do Sistema — Clean Architecture

O projeto implementa rigorosamente os princípios da **Clean Architecture**, **Domain-Driven Design (DDD)** e **Ports and Adapters (Hexagonal)**, alinhados à Constituição `@agente-core`:

```text
c:\Dev\AxiomLancer\
├── app/
│   ├── api/                          # Adaptadores de Entrada (Primary Adapters / REST API)
│   │   ├── _lib/withAuth.ts          # Middleware Zero Trust, RBAC e injeção de Tenant
│   │   ├── auth/login/               # Autenticação segura com timingSafeEqual e SHA-256
│   │   ├── clients/                  # Gestão de Clientes multi-tenant por userId
│   │   ├── contracts/                # Gestão de Contratos e Aceite Digital
│   │   ├── cycle-evaluations/        # Avaliação de Ciclo e Formulário Público Seguro
│   │   ├── expenses/                 # Despesas operacionais e categorização de OPEX
│   │   ├── projects/                 # Projetos, prazos e controle de entregáveis
│   │   └── profile/                  # Perfil do freelancer e configurações fiscais
│   └── ...                           # Interface React 19 / Server Components Next.js 15
├── core/
│   └── domain/                       # Camada de Domínio Puro (Single Source of Truth)
│       ├── entities/                 # Entidades e Value Objects de negócio
│       ├── ports/
│       │   └── repositories/         # Portas Abstratas de Repositório (DIP)
│       │       ├── contract.repository.port.ts
│       │       ├── cycle-evaluation.repository.port.ts
│       │       ├── expense.repository.port.ts
│       │       ├── project.repository.port.ts
│       │       └── user-profile.repository.port.ts
│       ├── schemas.ts                # Schemas Canônicos Zod (Contracts, Clients, Expenses)
│       └── services/                 # Casos de Uso e Serviços de Domínio
│           ├── contract.service.ts
│           ├── cycle-evaluation.service.ts
│           └── project.service.ts
├── infrastructure/
│   └── repositories/
│       └── in-memory/                # Adaptadores Secundários (In-Memory Repository Adapters)
│           ├── in-memory-contract.repository.ts
│           ├── in-memory-cycle-evaluation.repository.ts
│           ├── in-memory-expense.repository.ts
│           ├── in-memory-project.repository.ts
│           └── in-memory-user-profile.repository.ts
├── lib/                              # Utilitários de infraestrutura (auth, db, monetary)
├── convex/                           # Schema e mutations reativas em nuvem
├── prisma/                           # Schema relacional PostgreSQL e migrações
└── tests/                            # Suíte completa de testes automatizados com Vitest
```

### Princípio da Inversão de Dependência (DIP)

Nenhum serviço de domínio depende diretamente de bibliotecas de terceiros ou adaptadores de banco de dados. As dependências são injetadas explicitamente através de suas portas:

```typescript
// Exemplo: core/domain/services/contract.service.ts
export class ContractService {
  constructor(private readonly contractRepo: IContractRepository) {}

  async createContract(data: CreateContractInput): Promise<Contract> {
    // Regras de negócio puras, validação temporal e cálculo monetário
    return this.contractRepo.create(contract);
  }
}
```

---

## 4. Banco de Dados & Dupla Persistência

O AxiomLancer adota uma estratégia moderna de **dupla persistência complementar**:

### 4.1. Convex Cloud (Reativo em Tempo Real)

* Persistência reativa para sincronização instantânea de estado na interface do usuário sem polling.
* Tabelas estritamente tipadas em `convex/schema.ts`:
  * `clients`: Gestão de contratantes e histórico de pagamentos.
  * `invoices`: Faturas emitidas, status de liquidação e metadados.
  * `billing_rules`: Configuração de réguas de cobrança autônomas.
  * `billing_executions`: Histórico de execuções com log de entrega multicanal.
  * `contracts`: Contratos formalizados, termos jurídicos e aceite digital imutável.
  * `projects`: Projetos, horas alocadas e prazos de entrega.
  * `cycle_evaluations`: Ciclos de avaliação qualitativa (10 entregas ou 30 dias).
  * `project_feedbacks`: Feedbacks granulares recebidos por dimensão.

### 4.2. Prisma ORM & PostgreSQL (Relacional & Governança Fiduciária)

* Mapeamento relacional completo definido em `prisma/schema.prisma` alinhado ao esquema corporativo `AxiomLancer.sql`.
* Campos monetários com precisão exata `Decimal(12,2)`.
* Tabela `DeduplicationJournal` com hash SHA-256 para garantia de idempotência absoluta.
* Chaves estrangeiras com integridade referencial estrita e deleção em cascata controlada.

---

## 5. Segurança & Governança Técnica

Seguindo as diretrizes corporativas **Secure by Design**, **Zero Trust** e **Zero Secrets**:

* **Zero Secrets & Timing Attacks:** Eliminação de senhas ou segredos hardcoded no repositório. O endpoint `/api/auth/login` utiliza `crypto.timingSafeEqual` com hashes SHA-256, eliminando qualquer risco de timing attacks.
* **Prevenção contra BOLA / IDOR:** Todos os endpoints e repositórios aplicam isolamento obrigatório por `userId` autenticado. Um usuário nunca consegue visualizar ou alterar recursos de outro locatário.
* **JWT com Algorithm Whitelist:** Verificação estrita via `jose` configurada explicitamente com `{ algorithms: ["HS256"] }`, mitigando integralmente vulnerabilidades de downgrade ou ataques de `alg: none`.
* **Fail Fast na Borda:** Validação profunda de esquemas com Zod na entrada de cada rota da API, rejeitando payloads malformados antes de qualquer processamento ou consulta ao banco.
* **Safe Mode (< 12ms):** Circuito atômico para interrupção de emergência em caso de anomalia de cobrança ou comando do operador.

---

## 6. Qualidade & Testes Automatizados

O sistema conta com cobertura abrangente de testes unitários desenvolvidos com **Vitest 3.x**, cobrindo todas as invariantes de domínio, cálculos tributários e contratos de API:

```text
 ✓ tests/unit/monetary.spec.ts (5 tests)          # Precisão decimal.js, formatação BRL e taxas
 ✓ tests/unit/tax-engine.spec.ts (3 tests)        # Fator R, Anexos III/V e split do DAS
 ✓ tests/unit/rules-engine.spec.ts (3 tests)      # Offsets temporais D-3 a D+7 e idempotência
 ✓ tests/unit/use-cases.spec.ts (3 tests)         # Use cases e inversão de dependência (DIP)
 ✓ tests/unit/message-template.spec.ts (13 tests) # Templates multicanal e validação Zod
 ✓ tests/unit/reputation-score.spec.ts (11 tests) # Média ponderada (decimal.js) e divisão por zero
 ✓ tests/unit/dashboard-summary.spec.ts (3 tests) # Sumarização de caixa vs. OPEX e margem real
 ✓ tests/unit/project.spec.ts (7 tests)          # Validação de datas, status e proteção LGPD
 ✓ tests/unit/contract.spec.ts (14 tests)         # Máquina de estados, aceite digital e Zero Trust
 ✓ tests/unit/cycle-evaluation.spec.ts (36 tests) # Gatilhos 10 projetos/30 dias, 5 dimensões e tokens

   Test Files  10 passed (10)
        Tests  98 passed (98)
   Duration  1.29s
```

Para rodar a suíte completa de testes:

```bash
pnpm test
```

---

## 7. Guia de Execução & Deploy

### Pré-requisitos

* **Node.js:** Versão 20+ LTS (recomendado Node 20 ou 22)
* **PNPM:** Versão 10+ ou 11+ (`npm install -g pnpm`)
* **Conta Convex:** (Opcional para persistência remota na nuvem Convex)

### Passo a Passo

```bash
# 1. Entrar no diretório do projeto
cd c:\Dev\AxiomLancer

# 2. Instalar as dependências do projeto
pnpm install

# 3. Configurar as variáveis de ambiente
cp .env.example .env.local

# 4. Executar a suíte de testes unitários
pnpm test

# 5. Executar a validação de tipos TypeScript
pnpm exec tsc --noEmit

# 6. Iniciar o servidor de desenvolvimento
pnpm dev

# 7. Gerar build otimizado de produção
pnpm build

# 8. Iniciar o servidor em produção
pnpm start
```

### Variáveis de Ambiente Necessárias (`.env.local`)

```env
# Segurança e Sessão
JWT_SECRET=seu-jwt-secret-com-pelo-menos-32-caracteres-seguros
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Credenciais Administrativas Seguras (Zero Secrets)
ADMIN_EMAIL=admin@axiomlancer.com
ADMIN_PASSWORD=SuaSenhaForteAqui123!

# Conexão Convex Cloud
CONVEX_DEPLOYMENT=dev:trustworthy-otter-486
NEXT_PUBLIC_CONVEX_URL=https://trustworthy-otter-486.convex.cloud
CONVEX_DEPLOY_KEY=dev:trustworthy-otter-486|seu-token-de-deploy-convex
```

### Documentação de APIs & Governança de Contratos

* **Swagger OpenAPI 3.0:** Arquivo canônico em `docs/api/swagger.json` documentando todos os 15 endpoints REST da aplicação.
* **Postman Collection v2.1:** Coleção completa para testes e automação em `docs/api/postman_collection.json`.
* **API Versioning:** Suporte a rewrites transparentes de `/api/v1/:path*` para `/api/:path*` configurado nativamente no `next.config.mjs`.

---

## 8. Governança e Autoria

* **Arquitetura & Engenharia:** Desenvolvido pelo time **7Keys**.
* **Governança Técnica:** Projetado sob as diretrizes constitucionais de **Henrique Monteiro Cardoso** (`@agente-core`).
* **Design Standards:** Interface desenvolvida respeitando a **Grade de 8px**, contraste perceptual **APCA**, layouts em **Bento Grid** e estética **Liquid Glass**.
* **Licença:** Proprietário — 7Keys Studio. Todos os direitos reservados.
