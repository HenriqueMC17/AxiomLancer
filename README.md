# AxiomLancer ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Motor de ExecuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Financeira AutÃƒÆ’Ã‚Â´noma

<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js-15.5.18-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Convex Cloud](https://img.shields.io/badge/Convex-Reactive_DB-F35C3E?style=for-the-badge&logo=convex)
![Vitest](https://img.shields.io/badge/Vitest-Unit_Tests-6E9F18?style=for-the-badge&logo=vitest)
![Architecture](https://img.shields.io/badge/Clean_Architecture-Hexagonal-00C7B7?style=for-the-badge)
![Governance](https://img.shields.io/badge/GovernanÃƒÆ’Ã‚Â§a-7Keys_Core-emerald?style=for-the-badge)

<p align="center">
  <strong>Plataforma SaaS FinTech de Faturamento AutÃƒÆ’Ã‚Â´nomo, Split TributÃƒÆ’Ã‚Â¡rio (Fator R) e CobranÃƒÆ’Ã‚Â§a Preditiva</strong><br />
  Projetada e mantida pelo time <strong>7Keys</strong> para desenvolvedores seniores, freelancers tÃƒÆ’Ã‚Â©cnicos e microagÃƒÆ’Ã‚Âªncias boutique.
</p>

[VisÃƒÆ’Ã‚Â£o Geral](#1-visÃƒÆ’Ã‚Â£o-geral--proposta-de-valor) ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢
[Engenharia Financeira](#2-motores-de-engenharia-financeira) ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢
[Clean Architecture](#3-arquitetura-do-sistema--clean-architecture) ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢
[Banco de Dados & Convex](#4-banco-de-dados--dupla-persistÃƒÆ’Ã‚Âªncia) ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢
[SeguranÃƒÆ’Ã‚Â§a & GovernanÃƒÆ’Ã‚Â§a](#5-seguranÃƒÆ’Ã‚Â§a-resiliÃƒÆ’Ã‚Âªncia--fail-fast) ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢
[Testes Automatizados](#6-qualidade--testes-automatizados) ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢
[Como Executar](#7-guia-de-execuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o--deploy)

</div>

---

## 1. VisÃƒÆ’Ã‚Â£o Geral & Proposta de Valor

O **AxiomLancer** rompe definitivamente com o modelo de planilhas estÃƒÆ’Ã‚Â¡ticas e ERPs passivos que exigem alimentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o manual contÃƒÆ’Ã‚Â­nua. Ele atua como uma **esteira de execuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o ativa, silenciosa e determinÃƒÆ’Ã‚Â­stica**:

* **Fim do Constrangimento de CobranÃƒÆ’Ã‚Â§a:** Assume a rÃƒÆ’Ã‚Â©gua de comunicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o multicanal (WhatsApp, E-mail, SMS) com tom adaptativo e links de pagamento imediato.
* **RecuperaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de 10 a 15 Horas Semanais:** Elimina tarefas administrativas, conciliaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes bancÃƒÆ’Ã‚Â¡rias manuais e conferÃƒÆ’Ã‚Âªncia de comprovantes.
* **AritmÃƒÆ’Ã‚Â©tica MonetÃƒÆ’Ã‚Â¡ria Exata:** Zero erros de ponto flutuante do padrÃƒÆ’Ã‚Â£o IEEE 754 atravÃƒÆ’Ã‚Â©s de `decimal.js` com arredondamento regulatÃƒÆ’Ã‚Â³rio `ROUND_HALF_UP` e schema PostgreSQL `DECIMAL(12,2)`.
* **ProvisÃƒÆ’Ã‚Â£o AutomÃƒÆ’Ã‚Â¡tica do Simples Nacional:** SeparaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o imediata do imposto devido no cofre virtual no momento da liquidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o (Fator R, Anexo III vs. Anexo V).
* **Safe Mode (< 12ms):** BotÃƒÆ’Ã‚Â£o de PÃƒÆ’Ã‚Â¢nico com circuito atÃƒÆ’Ã‚Â´mico em memÃƒÆ’Ã‚Â³ria para congelar qualquer disparo em menos de 12 milissegundos.
* **IdempotÃƒÆ’Ã‚Âªncia Estrita:** Registro de cada evento no `DeduplicationJournal` com hash SHA-256 para impedir cobranÃƒÆ’Ã‚Â§as repetidas.

### Modelo de NegÃƒÆ’Ã‚Â³cio & MonetizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o (7Keys)

1. **Assinatura Core (SaaS):** **R$ 49,90/mÃƒÆ’Ã‚Âªs** para acesso total ÃƒÆ’Ã‚Â  infraestrutura, faturamento ilimitado, Previsio BI, DRE gerencial e Smart Escrows.
2. **Success Fee de RecuperaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o:** Taxa fixa de **5.00%** retida estritamente sobre faturas vencidas e inadimplentes que forem recuperadas pelo motor autÃƒÆ’Ã‚Â´nomo (faturas pagas em dia possuem taxa de R$ 0,00).

---

## 2. Motores de Engenharia Financeira

### 2.1. RÃƒÆ’Ã‚Â©gua de CobranÃƒÆ’Ã‚Â§a AutÃƒÆ’Ã‚Â´noma & MÃƒÆ’Ã‚Â¡quina de Estados
A esteira atua baseada em janelas temporais relativas ÃƒÆ’Ã‚Â  data de vencimento ($D$):
* **$D-3$ (Cortesia Preventiva):** NotificaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o cordial por e-mail com incentivo de pontualidade.
* **$D-0$ (Dia do Vencimento):** Disparo executivo via WhatsApp com payload PIX dinÃƒÆ’Ã‚Â¢mico e QR Code.
* **$D+3$ (Lembrete Assertivo):** Aviso pontual de atraso com recÃƒÆ’Ã‚Â¡lculo automÃƒÆ’Ã‚Â¡tico de juros e multa pro-rata.
* **$D+7$ (NotificaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Formal):** NotificaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o com registro de entrega antes de medidas de suspensÃƒÆ’Ã‚Â£o de serviÃƒÆ’Ã‚Â§os.

### 2.2. Motor TributÃƒÆ’Ã‚Â¡rio do Simples Nacional (Fator R)
Calcula em runtime o enquadramento na Lei Complementar nÃƒâ€šÃ‚Âº 123/2006:
$$\text{Fator R} = \frac{\text{Folha de Pagamento Anual (incluindo prÃƒÆ’Ã‚Â³-labore)}}{\text{Receita Bruta Total dos ÃƒÆ’Ã…Â¡ltimos 12 Meses (RBT12)}}$$

* Se $\text{Fator R} \ge 0.28$ (28%): Enquadra no **Anexo III** (alÃƒÆ’Ã‚Â­quota a partir de 6.00%).
* Se $\text{Fator R} < 0.28$: Reclassifica para o **Anexo V** (alÃƒÆ’Ã‚Â­quota a partir de 15.50%).
* O valor provisionado ÃƒÆ’Ã‚Â© retido preventivamente no **Cofre Virtual DAS**, garantindo que o lucro pessoal do freelancer nunca se misture com a obrigaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o tributÃƒÆ’Ã‚Â¡ria.

### 2.3. PIX DinÃƒÆ’Ã‚Â¢mico BACEN (CRC16-CCITT)
GeraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o nativa de strings Copia e Cola em conformidade com o Manual de PadrÃƒÆ’Ã‚Âµes para IniciaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o do PIX (ResoluÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o BCB nÃƒâ€šÃ‚Âº 1/2020), calculada pelo Value Object `PixPayload`.

---


### 2.4. MÃƒÆ’Ã‚Â³dulo de GestÃƒÆ’Ã‚Â£o de Contratos & Aceite Digital ImutÃƒÆ’Ã‚Â¡vel
* **FormalizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o Preventiva:** Registro antecipado do escopo, termos contratuais e remuneraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o antes do faturamento para blindar contra disputas e inadimplÃƒÆ’Ã‚Âªncia.
* **ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de Borda (Fail Fast):** VerificaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o temporal estrita (`start_date <= end_date` ou `end_date = null` para prazos indeterminados) e termos mÃƒÆ’Ã‚Â­nimos via Zod.
* **AritmÃƒÆ’Ã‚Â©tica MonetÃƒÆ’Ã‚Â¡ria Exata:** Todos os valores contratuais processados com `decimal.js` com arredondamento regulatÃƒÆ’Ã‚Â³rio `ROUND_HALF_UP` e tipo `DECIMAL(12,2)`.
* **Aceite Digital com NÃƒÆ’Ã‚Â£o-RepÃƒÆ’Ã‚Âºdio:** Registro formal com carimbo de data/hora (`accepted_at`), credenciais do signatÃƒÆ’Ã‚Â¡rio, IP de conexÃƒÆ’Ã‚Â£o (`signer_ip`) e hash SHA-256 (`signature_hash`).
* **Imutabilidade e MÃƒÆ’Ã‚Â¡quina de Estados:** Contratos aceitos (`ACTIVE`) tÃƒÆ’Ã‚Âªm seus termos bloqueados contra adulteraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes e contam com proteÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estrita contra exclusÃƒÆ’Ã‚Â£o acidental.

### 2.5. Sistema de AvaliaÃ§Ã£o Recorrente de Ciclo (Milestone 10 Projetos ou 30 Dias)
* **Gatilho Automatizado e AssÃ­ncrono:** Worker em background que monitora diariamente entregas e dispara automaticamente solicitaÃ§Ãµes de feedback qualitativo ao atingir 10 contratos/projetos concluÃ­dos ou 30 dias de ciclo contÃ­nuo com a empresa.
* **5 DimensÃµes Qualitativas:** AvaliaÃ§Ã£o granular abrangendo Atendimento Ã  Demanda, ComunicaÃ§Ã£o, ApresentaÃ§Ã£o de Resultados, Proatividade em ReuniÃµes e Entendimento da Dor do Cliente.
* **Controle Estrito de IdempotÃªncia:** Chave determinÃ­stica de ciclo (cycle_identifier) com Ã­ndice UNIQUE, prevenindo envio e submissÃ£o duplicada de convites.
* **ValidaÃ§Ã£o na Borda (Fail Fast com Zod):** Notas calibradas estritamente de 1.0 a 5.0 e comentÃ¡rio qualitativo mÃ­nimo de 15 caracteres antes de persistÃªncia.
* **AritmÃ©tica Rigorosa:** CÃ¡lculo do general_score executado via decimal.js com polÃ­tica ROUND_HALF_UP e tipo de alta precisÃ£o DECIMAL(12,2).
* **Zero Trust & Form PÃºblico Seguro:** Token Ãºnico de uso Ãºnico (	kn_*) para preenchimento pÃºblico sem expor credenciais ou APIs internas do freelancer.
* **Performance Visual InstantÃ¢nea:** RenderizaÃ§Ã£o via Server Components com reserva dimensional rÃ­gida (CLS = 0) e recÃ¡lculo em cascata do score geral de reputaÃ§Ã£o.

---

## 3. Arquitetura do Sistema ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Clean Architecture

O projeto implementa rigorosamente os princÃƒÆ’Ã‚Â­pios da **Clean Architecture** e **Ports and Adapters (Hexagonal)**, alinhados ÃƒÆ’Ã‚Â  ConstituiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o `@agente-core`:

```
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/monetary.spec.ts (5 tests)          # Precisao decimal.js, BRL e taxas
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/tax-engine.spec.ts (3 tests)        # Fator R, Anexos III/V e split DAS
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/rules-engine.spec.ts (3 tests)      # Offsets D-3 a D+7 e idempotencia
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/use-cases.spec.ts (3 tests)         # Use cases e inversao de dependencia
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/message-template.spec.ts (13 tests) # Templates multicanal e Zod
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/reputation-score.spec.ts (11 tests) # Media ponderada (decimal.js), divisao por zero e worker
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/dashboard-summary.spec.ts (3 tests) # Sumarizacao de caixa vs. OPEX e margem real (decimal.js)
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/project.spec.ts (7 tests)          # Validacao Zod de datas, toggle em desenvolvimento e LGPD
 ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ tests/unit/contract.spec.ts (14 tests)         # Maquina de estados, aceite digital imutavel e Zero Trust

 ✓ tests/unit/cycle-evaluation.spec.ts (36 tests) # Gatilhos 10 contratos / 30 dias, 5 dimensoes, token seguro e idempotencia

   Test Files  10 passed (10)
        Tests  98 passed (98)
   Duration  1.29s
```

---

## 7. Guia de ExecuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o & Deploy

### PrÃƒÆ’Ã‚Â©-requisitos
* **Node.js:** VersÃƒÆ’Ã‚Â£o 20+ LTS
* **PNPM:** VersÃƒÆ’Ã‚Â£o 10+ ou 11+
* **Conta Convex:** (Opcional para deploy na nuvem)

### Passo a Passo

```bash
# 1. Clonar o repositÃƒÆ’Ã‚Â³rio e entrar no diretÃƒÆ’Ã‚Â³rio
cd c:\Dev\AxiomLancer

# 2. Instalar dependÃƒÆ’Ã‚Âªncias
pnpm install

# 3. Configurar variÃƒÆ’Ã‚Â¡veis de ambiente (.env.local)
cp .env.example .env.local

# 4. Executar suÃƒÆ’Ã‚Â­te de testes unitÃƒÆ’Ã‚Â¡rios
pnpm test

# 5. Executar em modo desenvolvimento
pnpm dev

# 6. Gerar build otimizado de produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o
pnpm build

# 7. Iniciar servidor de produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o
pnpm start
```

### VariÃƒÆ’Ã‚Â¡veis de Ambiente NecessÃƒÆ’Ã‚Â¡rias (`.env.local`)

```env
# SeguranÃƒÆ’Ã‚Â§a e SessÃƒÆ’Ã‚Â£o
JWT_SECRET=seu-jwt-secret-com-pelo-menos-32-caracteres-seguros
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ConexÃƒÆ’Ã‚Â£o Convex Cloud
CONVEX_DEPLOYMENT=dev:trustworthy-otter-486
NEXT_PUBLIC_CONVEX_URL=https://trustworthy-otter-486.convex.cloud
CONVEX_DEPLOY_KEY=dev:trustworthy-otter-486|seu-token-de-deploy-convex
```

---

## 8. GovernanÃƒÆ’Ã‚Â§a e Autoria

* **Arquitetura & Engenharia:** Desenvolvido pelo time **7Keys**.
* **GovernanÃƒÆ’Ã‚Â§a TÃƒÆ’Ã‚Â©cnica:** Projetado sob as diretrizes constitucionais de **Henrique Monteiro Cardoso** (`@agente-core`).
* **Design Standards:** Interface desenvolvida respeitando a **Grade de 8px**, contraste perceptual **APCA**, layouts em **Bento Grid** e estÃƒÆ’Ã‚Â©tica **Liquid Glass**.
* **LicenÃƒÆ’Ã‚Â§a:** ProprietÃƒÆ’Ã‚Â¡rio ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 7Keys Studio. Todos os direitos reservados.
