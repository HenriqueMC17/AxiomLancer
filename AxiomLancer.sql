
-- ==============================================================================
-- 1. TIPOS CUSTOMIZADOS (ENUMS) E FUNÃ‡Ã•ES GLOBAIS
-- ==============================================================================

-- Definem domÃ­nios fechados (ENUMs). O banco rejeitarÃ¡ qualquer texto fora destas opÃ§Ãµes.
CREATE TYPE integration_status AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR', 'PENDING');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELED');
CREATE TYPE channel_type AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE expense_status AS ENUM ('PENDING', 'PAID', 'CANCELED');
CREATE TYPE ledger_tx_type AS ENUM ('INCOME', 'EXPENSE', 'FEE', 'REFUND');
CREATE TYPE saas_billing_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED');
CREATE TYPE execution_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE contract_status AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED', 'PENDING_SIGNATURE');
CREATE TYPE cycle_trigger_type AS ENUM ('MILESTONE_10_PROJECTS', 'MONTHLY_30_DAYS', 'MANUAL');
CREATE TYPE cycle_evaluation_status AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- FunÃ§Ã£o global que serÃ¡ acionada por Triggers para manter a coluna updated_at sempre exata
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$ 
BEGIN   
    NEW.updated_at = NOW(); -- Atualiza o campo com a data/hora exata da modificaÃ§Ã£o
    RETURN NEW; -- Retorna a linha modificada para ser salva
END; 
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- 2. CRIAÃ‡ÃƒO DAS TABELAS BASE (USUÃRIOS E CONFIGURAÃ‡Ã•ES)
-- ==============================================================================

-- Tabela raiz: Armazena os inquilinos (Tenants/Freelancers) do sistema SaaS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- ID Ãºnico universal gerado nativamente
    email VARCHAR(255) UNIQUE NOT NULL, -- E-mail para login, obrigatÃ³rio e sem duplicidade
    name VARCHAR(255) NOT NULL, -- Nome completo ou RazÃ£o Social
    billing_paused BOOLEAN DEFAULT FALSE, -- Trava de seguranÃ§a para pausar o sistema de cobranÃ§a
    current_score DECIMAL(12,2) DEFAULT 0.00, -- Score geral de reputacao do freelancer (0.00 a 5.00)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Data de cadastro com fuso horÃ¡rio
    updated_at TIMESTAMPTZ, -- Ãšltima modificaÃ§Ã£o
    deleted_at TIMESTAMPTZ -- Marcador para exclusÃ£o lÃ³gica 
);
-- Gatilho para atualizar o updated_at automaticamente na tabela users
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ConfiguraÃ§Ãµes regionais exclusivas de cada usuÃ¡rio
CREATE TABLE user_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- RestriÃ§Ã£o UNIQUE garante relaÃ§Ã£o 1 para 1 com users
    timezone VARCHAR(100) DEFAULT 'UTC',
    default_currency VARCHAR(10) DEFAULT 'BRL',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT -- Impede a exclusÃ£o fÃ­sica do usuÃ¡rio se houver config
);
CREATE TRIGGER set_timestamp_user_config BEFORE UPDATE ON user_config FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- IntegraÃ§Ãµes de terceiros (ex: Stripe, Asaas, Twilio)
CREATE TABLE integration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider VARCHAR(100) NOT NULL, -- Nome do serviÃ§o externo
    status integration_status NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_integration BEFORE UPDATE ON integration FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 3. ENTIDADES FINANCEIRAS E DE ASSINATURA (SaaS)
-- ==============================================================================

-- Planos do prÃ³prio SaaS (AxiomLancer)
CREATE TABLE subscription_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, 
    name VARCHAR(255) NOT NULL, -- Nome comercial exibido no front
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0), 
    billing_interval VARCHAR(50) NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
CREATE TRIGGER set_timestamp_subscription_plan BEFORE UPDATE ON subscription_plan FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Assinaturas ativas dos usuÃ¡rios
CREATE TABLE user_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Quem assinou
    plan_id UUID NOT NULL, -- O que assinou
    status subscription_status NOT NULL, 
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- InÃ­cio da vigÃªncia
    current_period_end TIMESTAMPTZ, -- Fim do ciclo atual pago
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (plan_id) REFERENCES subscription_plan(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_user_subscription BEFORE UPDATE ON user_subscription FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Clientes dos Freelancers (Consumidores finais)
CREATE TABLE client (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Freelancer dono deste cadastro
    legal_name VARCHAR(255) NOT NULL, -- Nome do cliente
    email VARCHAR(255) NOT NULL, -- Contato para disparo de faturas
    tone_of_voice VARCHAR(100), -- Tom de voz customizado para as mensagens
    billing_paused BOOLEAN DEFAULT FALSE, -- Permite pausar rÃ©guas apenas para este cliente
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    UNIQUE (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_client BEFORE UPDATE ON client FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Faturas emitidas pelo Freelancer para o Cliente
CREATE TABLE invoice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Emissor
    client_id UUID NOT NULL, -- Pagador
    invoice_number VARCHAR(100) NOT NULL, -- NÃºmero sequencial da fatura
    status invoice_status NOT NULL, 
    due_date TIMESTAMPTZ NOT NULL, -- Vencimento da fatura
    gross_value DECIMAL(12,2) NOT NULL CHECK (gross_value >= 0),
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0 AND tax_rate <= 100), -- Impostos percentuais
    net_value DECIMAL(12,2) NOT NULL CHECK (net_value >= 0), -- Valor lÃ­quido
    billing_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    UNIQUE (user_id, invoice_number), 
    UNIQUE (id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id, user_id) REFERENCES client(id, user_id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_invoice BEFORE UPDATE ON invoice FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 4. ENTIDADES DE FATURAMENTO, RÃ‰GUAS E DESPESAS
-- ==============================================================================

-- Regras de automaÃ§Ã£o (Motor de cobranÃ§a)
CREATE TABLE billing_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL, 
    trigger_type VARCHAR(100) NOT NULL, -- Tipo do gatilho
    offset_days INT NOT NULL, -- Dias de deslocamento em relaÃ§Ã£o ao vencimento
    channel channel_type NOT NULL, 
    tone_of_voice VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_billing_rule BEFORE UPDATE ON billing_rule FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Textos/Modelos das mensagens da rÃ©gua
CREATE TABLE message_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tone_of_voice VARCHAR(100) NOT NULL,
    channel channel_type NOT NULL,
    subject VARCHAR(255), -- Assunto 
    body TEXT NOT NULL, -- Corpo com variÃ¡veis 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_message_template BEFORE UPDATE ON message_template FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Despesas operacionais do Freelancer
CREATE TABLE expense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- ClassificaÃ§Ã£o 
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    due_date DATE, -- Quando vence
    paid_at TIMESTAMPTZ, -- Quando foi pago
    status expense_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_expense BEFORE UPDATE ON expense FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 5. LEDGER TRANSACTIONS E AUDITORIA FINANCEIRA
-- ==============================================================================

-- Livro RazÃ£o Central. A chave primÃ¡ria composta Ã© mantida sem depender de TimescaleDB.
CREATE TABLE ledger_transaction (
    id UUID DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL, -- Data/hora efetiva do evento contÃ¡bil
    user_id UUID NOT NULL,
    invoice_id UUID, -- Nulo se for despesa
    expense_id UUID, -- Nulo se for receita
    integration_id UUID,
    type ledger_tx_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    external_id VARCHAR(255), -- ID no banco/gateway
    reconciled_at TIMESTAMPTZ, -- ConfirmaÃ§Ã£o bancÃ¡ria
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    PRIMARY KEY (id, occurred_at), -- ComposiÃ§Ã£o obrigatÃ³ria para Hypertables
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT,
    FOREIGN KEY (expense_id) REFERENCES expense(id) ON DELETE RESTRICT,
    FOREIGN KEY (integration_id) REFERENCES integration(id) ON DELETE SET NULL
);
CREATE TRIGGER set_timestamp_ledger_transaction BEFORE UPDATE ON ledger_transaction FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- CobranÃ§as do SaaS contra o Freelancer
CREATE TABLE saas_billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    status saas_billing_status NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (subscription_id) REFERENCES user_subscription(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_saas_billing BEFORE UPDATE ON saas_billing FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Log de disparos de mensagens (RÃ©guas executadas)
CREATE TABLE billing_execution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL,
    rule_id UUID NOT NULL,
    template_id UUID NOT NULL,
    channel channel_type NOT NULL,
    status execution_status NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ,
    error_message TEXT, -- Stacktrace se falhar
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT,
    FOREIGN KEY (rule_id) REFERENCES billing_rule(id) ON DELETE RESTRICT,
    FOREIGN KEY (template_id) REFERENCES message_template(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_billing_execution BEFORE UPDATE ON billing_execution FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ComissÃµes retidas pela plataforma por recuperaÃ§Ã£o de faturas
CREATE TABLE recovery_take_rate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID UNIQUE NOT NULL, -- RelaÃ§Ã£o 1:1, uma comissÃ£o por fatura
    recovered_amount DECIMAL(12,2) NOT NULL CHECK (recovered_amount >= 0),
    rate_percent DECIMAL(5,2) NOT NULL CHECK (rate_percent >= 0 AND rate_percent <= 100),
    commission_amount DECIMAL(12,2) NOT NULL CHECK (commission_amount >= 0),
    recovered_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_recovery_take_rate BEFORE UPDATE ON recovery_take_rate FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 6. TABELAS DE RESILIÃŠNCIA E INTEGRAÃ‡ÃƒO (DEDUPLICAÃ‡ÃƒO E OUTBOX)
-- ==============================================================================

-- DiÃ¡rio de IdempotÃªncia: impede que a mesma rÃ©gua dispare duas vezes no mesmo dia para a mesma fatura
CREATE TABLE deduplication_journal (
    event_id VARCHAR(150) PRIMARY KEY, -- ID criptogrÃ¡fico do evento
    invoice_id UUID NOT NULL,
    trigger_day DATE NOT NULL,
    rule_id UUID NOT NULL,
    execution_id UUID UNIQUE,
    processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (invoice_id, trigger_day, rule_id), -- Impede repetir a mesma regra para a fatura no mesmo dia
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT,
    FOREIGN KEY (rule_id) REFERENCES billing_rule(id) ON DELETE RESTRICT,
    FOREIGN KEY (execution_id) REFERENCES billing_execution(id) ON DELETE RESTRICT
);

-- Fila interna
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Permite filtrar eventos no nÃ­vel do Tenant
    aggregate_type VARCHAR(100) NOT NULL, -- Ex: 'Invoice', 'Project'
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- Ex: 'InvoiceCreated', 'FeedbackRequested'
    payload JSONB NOT NULL, -- Carga de dados nÃ£o estruturados para o mensageiro
    processed_at TIMESTAMPTZ, -- Nulo indica evento pendente de disparo
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);


-- ==============================================================================
-- 7. MÃ“DULO DE PORTFÃ“LIO, CONTRATOS, PROJETOS E SCORE
-- ==============================================================================

-- 7.1. Perfil PÃºblico e Agregador de Score do Freelancer
CREATE TABLE freelancer_portfolio (
    user_id UUID PRIMARY KEY, -- RelaÃ§Ã£o 1:1 rigorosa com users
    photo_url VARCHAR(255), -- Link do Bucket S3 da imagem de perfil
    phone VARCHAR(50), 
    website_url VARCHAR(255),
    overall_score DECIMAL(12,2) DEFAULT 0.00, -- MÃ©dia exata atualizada via BullMQ
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Se apagar o user, apaga o portfÃ³lio
);
CREATE TRIGGER set_timestamp_freelancer_portfolio BEFORE UPDATE ON freelancer_portfolio FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.2. Tabela de GestÃ£o de Contratos JurÃ­dicos/Comerciais
CREATE TABLE contract (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Freelancer
    client_id UUID NOT NULL, -- Empresa contratante
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contract_value DECIMAL(12,2) NOT NULL CHECK (contract_value >= 0), 
    status contract_status DEFAULT 'PENDING_SIGNATURE',
    start_date DATE NOT NULL,
    end_date DATE, -- Pode ser nulo se for por tempo indeterminado
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_contract_dates CHECK (end_date IS NULL OR end_date >= start_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id, user_id) REFERENCES client(id, user_id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_contract BEFORE UPDATE ON contract FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.3. PortfÃ³lio de Projetos Executados
CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    client_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE, -- Front-end envia NULL quando o toggle "Em desenvolvimento" for ativado
    is_public_client_name BOOLEAN DEFAULT FALSE, -- Flag de Lei Geral de ProteÃ§Ã£o de Dados (LGPD)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR end_date >= start_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id, user_id) REFERENCES client(id, user_id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_project BEFORE UPDATE ON project FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.4. AvaliaÃ§Ã£o e Feedback por Projeto EspecÃ­fico
CREATE TABLE project_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID UNIQUE NOT NULL, -- RestriÃ§Ã£o 1:1, evita reviews duplicadas no mesmo projeto
    score DECIMAL(12,2) NOT NULL CHECK (score >= 0 AND score <= 5), -- Bloqueio matemÃ¡tico na borda do banco
    comments TEXT, -- Feedback qualitativo detalhado
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_project_feedback BEFORE UPDATE ON project_feedback FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.5. Sistema de AvaliaÃ§Ã£o de Ciclo (Milestone de 10 Contratos / Fechamento Mensal)
CREATE TABLE cycle_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    client_id UUID NOT NULL,
    cycle_identifier VARCHAR(150) UNIQUE NOT NULL, 
    score_communication DECIMAL(12,2) CHECK (score_communication IS NULL OR (score_communication >= 0 AND score_communication <= 5)),
    score_proactivity DECIMAL(12,2) CHECK (score_proactivity IS NULL OR (score_proactivity >= 0 AND score_proactivity <= 5)),
    score_results DECIMAL(12,2) CHECK (score_results IS NULL OR (score_results >= 0 AND score_results <= 5)),
    score_understanding DECIMAL(12,2) CHECK (score_understanding IS NULL OR (score_understanding >= 0 AND score_understanding <= 5)),
    score_demand_delivery DECIMAL(12,2) CHECK (score_demand_delivery IS NULL OR (score_demand_delivery >= 0 AND score_demand_delivery <= 5)),
    general_score DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (general_score >= 0 AND general_score <= 5),
    comments TEXT,
    trigger_type cycle_trigger_type NOT NULL DEFAULT 'MANUAL',
    status cycle_evaluation_status NOT NULL DEFAULT 'PENDING',
    invitation_token VARCHAR(255) UNIQUE,
    invitation_sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    client_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id, user_id) REFERENCES client(id, user_id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_cycle_evaluation BEFORE UPDATE ON cycle_evaluation FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.6. VÃ­nculo (Lote) entre AvaliaÃ§Ã£o de Ciclo e Contratos
CREATE TABLE cycle_evaluation_contract (
    cycle_evaluation_id UUID NOT NULL,
    contract_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cycle_evaluation_id, contract_id), -- Chave composta impede duplicidade no vÃ­nculo
    FOREIGN KEY (cycle_evaluation_id) REFERENCES cycle_evaluation(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES contract(id) ON DELETE RESTRICT
);


-- ==============================================================================
-- 8. ÃNDICES DE PERFORMANCE E CONSULTAS COMPLEXAS
-- ==============================================================================

-- Ãndices Parciais (SÃ³ indexam registros ativos, poupando RAM)
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_client_user_active ON client(user_id) WHERE deleted_at IS NULL;

-- Ãndices Compostos EstratÃ©gicos (Para Dashboards RÃ¡pidos)
CREATE INDEX idx_invoice_user_status ON invoice(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_expense_user_status ON expense(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_ledger_user_date ON ledger_transaction(user_id, occurred_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_subscription_user_status ON user_subscription(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_billing_execution_invoice ON billing_execution(invoice_id, status);

-- Ãndices de Chaves Estrangeiras ClÃ¡ssicas (Evita Full Table Scan em JOINs)
CREATE INDEX idx_integration_user_id ON integration(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoice_client_id ON invoice(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_saas_billing_subscription_id ON saas_billing(subscription_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_deduplication_invoice_id ON deduplication_journal(invoice_id);

-- Ãndices Especiais para a Fila Outbox (Essencial para o Worker achar os pendentes na hora)
CREATE INDEX idx_outbox_unprocessed ON outbox_events(created_at) WHERE processed_at IS NULL;
CREATE INDEX idx_outbox_payload_gin ON outbox_events USING GIN (payload);

-- Ãndices das novas entidades (Contratos, Projetos, Score e Lote)
CREATE INDEX idx_contract_user_id ON contract(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contract_client_id ON contract(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contract_user_client ON contract(user_id, client_id);
CREATE INDEX idx_project_user_id ON project(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_client_id ON project(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_user_client ON project(user_id, client_id);
CREATE INDEX idx_cycle_eval_user_client ON cycle_evaluation(user_id, client_id);
CREATE INDEX idx_cycle_eval_contract_cycle_id ON cycle_evaluation_contract(cycle_evaluation_id);
CREATE INDEX idx_cycle_eval_contract_contract_id ON cycle_evaluation_contract(contract_id);

-- Tabela ProfessionalExpenses (Alias para auditoria estrita de gastos operacionais corporativos)
CREATE TABLE IF NOT EXISTS professional_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    due_date DATE,
    paid_at TIMESTAMPTZ,
    status expense_status NOT NULL DEFAULT 'PENDING',
    is_fixed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_professional_expenses_user_status ON professional_expenses(user_id, status) WHERE deleted_at IS NULL;