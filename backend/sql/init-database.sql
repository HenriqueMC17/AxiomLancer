-- ==============================================================================
-- INICIALIZAÇÃO DO BANCO DE DADOS E EXTENSÕES PARA ALTA ESCALA
-- ==============================================================================

-- Cria o banco de dados principal do sistema
CREATE DATABASE "AxiomLancer";

-- Conecta (usa) o banco de dados recém-criado
\c "AxiomLancer"

-- Habilita o TimescaleDB: extensão vital para particionar logs gigantes (Hypertables) por tempo
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Habilita o pg_cron: extensão para rodar tarefas agendadas (cron jobs) direto no banco de dados
CREATE EXTENSION IF NOT EXISTS pg_cron;


-- ==============================================================================
-- 1. TIPOS CUSTOMIZADOS (ENUMS) E FUNÇÕES GLOBAIS
-- ==============================================================================

-- Definem domínios fechados (ENUMs). O banco rejeitará qualquer texto fora destas opções.
CREATE TYPE integration_status AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR', 'PENDING');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELED');
CREATE TYPE channel_type AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE expense_status AS ENUM ('PENDING', 'PAID', 'CANCELED');
CREATE TYPE ledger_tx_type AS ENUM ('INCOME', 'EXPENSE', 'FEE', 'REFUND');
CREATE TYPE saas_billing_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED');
CREATE TYPE execution_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE contract_status AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED', 'PENDING_SIGNATURE');

-- Função global que será acionada por Triggers para manter a coluna updated_at sempre exata
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$ 
BEGIN   
    NEW.updated_at = NOW(); -- Atualiza o campo com a data/hora exata da modificação
    RETURN NEW; -- Retorna a linha modificada para ser salva
END; 
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- 2. CRIAÇÃO DAS TABELAS BASE (USUÁRIOS E CONFIGURAÇÕES)
-- ==============================================================================

-- Tabela raiz: Armazena os inquilinos (Tenants/Freelancers) do sistema SaaS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- ID único universal gerado nativamente
    email VARCHAR(255) UNIQUE NOT NULL, -- E-mail para login, obrigatório e sem duplicidade
    name VARCHAR(255) NOT NULL, -- Nome completo ou Razão Social
    billing_paused BOOLEAN DEFAULT FALSE, -- Trava de segurança para pausar o sistema de cobrança
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Data de cadastro com fuso horário
    updated_at TIMESTAMPTZ, -- Última modificação (gerido via trigger)
    deleted_at TIMESTAMPTZ -- Marcador para exclusão lógica (Soft Delete)
);
-- Gatilho para atualizar o updated_at automaticamente na tabela users
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Configurações regionais exclusivas de cada usuário
CREATE TABLE user_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- Restrição UNIQUE garante relação 1 para 1 com users
    timezone VARCHAR(100) DEFAULT 'UTC', -- Fuso horário base do tenant
    default_currency VARCHAR(10) DEFAULT 'BRL', -- Moeda padrão (ex: BRL, USD)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT -- Impede a exclusão física do usuário se houver config
);
CREATE TRIGGER set_timestamp_user_config BEFORE UPDATE ON user_config FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Integrações de terceiros (ex: Stripe, Asaas, Twilio)
CREATE TABLE integration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider VARCHAR(100) NOT NULL, -- Nome do serviço externo
    status integration_status NOT NULL, -- Usa o ENUM criado na seção 1
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_integration BEFORE UPDATE ON integration FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 3. ENTIDADES FINANCEIRAS E DE ASSINATURA (SaaS)
-- ==============================================================================

-- Planos do próprio SaaS (AxiomLancer)
CREATE TABLE subscription_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, -- Código interno (ex: PRO_MONTHLY)
    name VARCHAR(255) NOT NULL, -- Nome comercial exibido no front
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0), -- Blindagem: O preço jamais pode ser negativo
    billing_interval VARCHAR(50) NOT NULL, -- Mensal, Anual, etc
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
CREATE TRIGGER set_timestamp_subscription_plan BEFORE UPDATE ON subscription_plan FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Assinaturas ativas dos usuários
CREATE TABLE user_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Quem assinou
    plan_id UUID NOT NULL, -- O que assinou
    status subscription_status NOT NULL, -- ENUM: ACTIVE, CANCELED, etc
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Início da vigência
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
    legal_name VARCHAR(255) NOT NULL, -- Nome ou Razão Social do cliente
    email VARCHAR(255) NOT NULL, -- Contato para disparo de faturas
    tone_of_voice VARCHAR(100), -- Tom de voz customizado para as mensagens
    billing_paused BOOLEAN DEFAULT FALSE, -- Permite pausar réguas apenas para este cliente
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_client BEFORE UPDATE ON client FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Faturas emitidas pelo Freelancer para o Cliente
CREATE TABLE invoice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Emissor
    client_id UUID NOT NULL, -- Pagador
    invoice_number VARCHAR(100) NOT NULL, -- Número sequencial da fatura
    status invoice_status NOT NULL, -- ENUM (PENDING, PAID, etc)
    due_date TIMESTAMPTZ NOT NULL, -- Vencimento da fatura
    gross_value DECIMAL(12,2) NOT NULL CHECK (gross_value >= 0), -- Valor bruto sem choro (>=0)
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0), -- Impostos percentuais
    net_value DECIMAL(12,2) NOT NULL CHECK (net_value >= 0), -- Valor líquido
    billing_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    UNIQUE (user_id, invoice_number), -- Garante que o número da fatura seja único apenas DENTRO do mesmo freelancer
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_invoice BEFORE UPDATE ON invoice FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 4. ENTIDADES DE FATURAMENTO, RÉGUAS E DESPESAS
-- ==============================================================================

-- Regras de automação (Motor de cobrança)
CREATE TABLE billing_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL, -- Nome da régua (ex: Aviso de Atraso 3 Dias)
    trigger_type VARCHAR(100) NOT NULL, -- Tipo do gatilho (ex: AFTER_DUE)
    offset_days INT NOT NULL, -- Dias de deslocamento em relação ao vencimento
    channel channel_type NOT NULL, -- ENUM (EMAIL, SMS, WHATSAPP)
    tone_of_voice VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_billing_rule BEFORE UPDATE ON billing_rule FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Textos/Modelos das mensagens da régua
CREATE TABLE message_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tone_of_voice VARCHAR(100) NOT NULL,
    channel channel_type NOT NULL,
    subject VARCHAR(255), -- Assunto (útil para e-mail)
    body TEXT NOT NULL, -- Corpo com variáveis (ex: Olá {{client_name}})
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
    category VARCHAR(100) NOT NULL, -- Classificação (Software, Imposto, etc)
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0), -- Valores matemáticos fechados
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

-- Livro Razão Central. NOTA: 'occurred_at' compõe a PK para o TimescaleDB funcionar.
CREATE TABLE ledger_transaction (
    id UUID DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL, -- Data/hora efetiva do evento contábil (Eixo X do Timescale)
    user_id UUID NOT NULL,
    invoice_id UUID, -- Nulo se for despesa
    expense_id UUID, -- Nulo se for receita
    integration_id UUID,
    type ledger_tx_type NOT NULL, -- ENUM (INCOME, EXPENSE, etc)
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    external_id VARCHAR(255), -- ID no banco/gateway
    reconciled_at TIMESTAMPTZ, -- Confirmação bancária
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    PRIMARY KEY (id, occurred_at), -- Composição obrigatória para Hypertables
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT,
    FOREIGN KEY (expense_id) REFERENCES expense(id) ON DELETE RESTRICT,
    FOREIGN KEY (integration_id) REFERENCES integration(id) ON DELETE SET NULL
);
CREATE TRIGGER set_timestamp_ledger_transaction BEFORE UPDATE ON ledger_transaction FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Cobranças do SaaS contra o Freelancer
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

-- Log de disparos de mensagens (Réguas executadas)
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

-- Comissões retidas pela plataforma por recuperação de faturas
CREATE TABLE recovery_take_rate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID UNIQUE NOT NULL, -- Relação 1:1, uma comissão por fatura
    recovered_amount DECIMAL(12,2) NOT NULL CHECK (recovered_amount >= 0),
    rate_percent DECIMAL(5,2) NOT NULL CHECK (rate_percent >= 0),
    commission_amount DECIMAL(12,2) NOT NULL CHECK (commission_amount >= 0),
    recovered_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_recovery_take_rate BEFORE UPDATE ON recovery_take_rate FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ==============================================================================
-- 6. TABELAS DE RESILIÊNCIA E INTEGRAÇÃO (DEDUPLICAÇÃO E OUTBOX)
-- ==============================================================================

-- Diário de Idempotência: impede que a mesma régua dispare duas vezes no mesmo dia para a mesma fatura
CREATE TABLE deduplication_journal (
    event_id VARCHAR(150) PRIMARY KEY, -- ID criptográfico do evento
    invoice_id UUID NOT NULL,
    trigger_day DATE NOT NULL,
    rule_id UUID,
    execution_id UUID UNIQUE,
    processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (invoice_id, trigger_day), -- Restrição central da idempotência
    FOREIGN KEY (invoice_id) REFERENCES invoice(id) ON DELETE RESTRICT,
    FOREIGN KEY (rule_id) REFERENCES billing_rule(id) ON DELETE RESTRICT,
    FOREIGN KEY (execution_id) REFERENCES billing_execution(id) ON DELETE RESTRICT
);

-- Fila interna (Transactional Outbox) para o BullMQ/RabbitMQ consumir e enviar e-mails de forma garantida
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Permite filtrar eventos no nível do Tenant
    aggregate_type VARCHAR(100) NOT NULL, -- Ex: 'Invoice', 'Project'
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- Ex: 'InvoiceCreated', 'FeedbackRequested'
    payload JSONB NOT NULL, -- Carga de dados não estruturados para o mensageiro
    processed_at TIMESTAMPTZ, -- Nulo indica evento pendente de disparo
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);


-- ==============================================================================
-- 7. MÓDULO DE PORTFÓLIO, CONTRATOS, PROJETOS E SCORE
-- ==============================================================================

-- 7.1. Perfil Público e Agregador de Score do Freelancer
CREATE TABLE freelancer_portfolio (
    user_id UUID PRIMARY KEY, -- Relação 1:1 rigorosa com users
    photo_url VARCHAR(255), -- Link do Bucket S3 da imagem de perfil
    phone VARCHAR(50), 
    website_url VARCHAR(255),
    overall_score DECIMAL(12,2) DEFAULT 0.00, -- Média exata atualizada via BullMQ
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Se apagar o user, apaga o portfólio
);
CREATE TRIGGER set_timestamp_freelancer_portfolio BEFORE UPDATE ON freelancer_portfolio FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.2. Tabela de Gestão de Contratos Jurídicos/Comerciais
CREATE TABLE contract (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Freelancer
    client_id UUID NOT NULL, -- Empresa contratante
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contract_value DECIMAL(12,2) NOT NULL CHECK (contract_value >= 0), -- Precisão monetária blindada
    status contract_status DEFAULT 'PENDING_SIGNATURE',
    start_date DATE NOT NULL,
    end_date DATE, -- Pode ser nulo se for por tempo indeterminado
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_contract BEFORE UPDATE ON contract FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.3. Portfólio de Projetos Executados
CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    client_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE, -- Front-end envia NULL quando o toggle "Em desenvolvimento" for ativado
    is_public_client_name BOOLEAN DEFAULT FALSE, -- Flag de Lei Geral de Proteção de Dados (LGPD)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_project BEFORE UPDATE ON project FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.4. Avaliação e Feedback por Projeto Específico
CREATE TABLE project_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID UNIQUE NOT NULL, -- Restrição 1:1, evita reviews duplicadas no mesmo projeto
    score DECIMAL(12,2) NOT NULL CHECK (score >= 0 AND score <= 5), -- Bloqueio matemático na borda do banco
    comments TEXT, -- Feedback qualitativo detalhado
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_project_feedback BEFORE UPDATE ON project_feedback FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.5. Sistema de Avaliação de Ciclo (Milestone de 10 Contratos / Fechamento Mensal)
CREATE TABLE cycle_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    client_id UUID NOT NULL,
    cycle_identifier VARCHAR(150) UNIQUE NOT NULL, -- Chave de Idempotência (ex: eval_userA_clientB_month082026)
    score_communication DECIMAL(12,2) NOT NULL CHECK (score_communication >= 0 AND score_communication <= 5),
    score_proactivity DECIMAL(12,2) NOT NULL CHECK (score_proactivity >= 0 AND score_proactivity <= 5),
    score_results DECIMAL(12,2) NOT NULL CHECK (score_results >= 0 AND score_results <= 5),
    score_understanding DECIMAL(12,2) NOT NULL CHECK (score_understanding >= 0 AND score_understanding <= 5),
    general_score DECIMAL(12,2) NOT NULL CHECK (general_score >= 0 AND general_score <= 5), -- Média exata
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT
);
CREATE TRIGGER set_timestamp_cycle_evaluation BEFORE UPDATE ON cycle_evaluation FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 7.6. Vínculo (Lote) entre Avaliação de Ciclo e Contratos
CREATE TABLE cycle_evaluation_contract (
    cycle_evaluation_id UUID NOT NULL,
    contract_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cycle_evaluation_id, contract_id), -- Chave composta impede duplicidade no vínculo
    FOREIGN KEY (cycle_evaluation_id) REFERENCES cycle_evaluation(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES contract(id) ON DELETE RESTRICT
);


-- ==============================================================================
-- 8. ÍNDICES DE PERFORMANCE E CONSULTAS COMPLEXAS
-- ==============================================================================

-- Índices Parciais (Só indexam registros ativos, poupando RAM)
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_client_user_active ON client(user_id) WHERE deleted_at IS NULL;

-- Índices Compostos Estratégicos (Para Dashboards Rápidos)
CREATE INDEX idx_invoice_user_status ON invoice(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_expense_user_status ON expense(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_ledger_user_date ON ledger_transaction(user_id, occurred_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_subscription_user_status ON user_subscription(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_billing_execution_invoice ON billing_execution(invoice_id, status);

-- Índices de Chaves Estrangeiras Clássicas (Evita Full Table Scan em JOINs)
CREATE INDEX idx_integration_user_id ON integration(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoice_client_id ON invoice(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_saas_billing_subscription_id ON saas_billing(subscription_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_deduplication_invoice_id ON deduplication_journal(invoice_id);

-- Índices Especiais para a Fila Outbox (Essencial para o Worker achar os pendentes na hora)
CREATE INDEX idx_outbox_unprocessed ON outbox_events(created_at) WHERE processed_at IS NULL;
CREATE INDEX idx_outbox_payload_gin ON outbox_events USING GIN (payload);

-- Índices das novas entidades (Contratos, Projetos, Score e Lote)
CREATE INDEX idx_contract_user_id ON contract(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contract_client_id ON contract(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_user_id ON project(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_client_id ON project(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cycle_eval_user_client ON cycle_evaluation(user_id, client_id);
CREATE INDEX idx_cycle_eval_contract_cycle_id ON cycle_evaluation_contract(cycle_evaluation_id);
CREATE INDEX idx_cycle_eval_contract_contract_id ON cycle_evaluation_contract(contract_id);


-- ==============================================================================
-- 9. APLICAÇÃO DE ESCALABILIDADE (TIMESCALEDB, RLS E CRON)
-- ==============================================================================

-- 9.1. Conversão do Ledger para Hypertable
-- Faz o fatiamento físico do livro razão por mês/ano, mantendo consultas ultrarrápidas 
SELECT create_hypertable('ledger_transaction', 'occurred_at');

-- 9.2. Segurança e Isolamento Nível de Linha (RLS - Row Level Security)
-- Ativa a barreira de proteção. Ninguém consegue ler/escrever dados que não sejam do próprio tenant
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract ENABLE ROW LEVEL SECURITY;
ALTER TABLE project ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_evaluation_contract ENABLE ROW LEVEL SECURITY;

-- 9.3 Criação das Políticas de Tenant. O Backend DEVE enviar "SET LOCAL app.current_tenant = 'ID'"
CREATE POLICY tenant_isolation_client ON client FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_invoice ON invoice FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_expense ON expense FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_ledger ON ledger_transaction FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_outbox ON outbox_events FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_portfolio ON freelancer_portfolio FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_contract ON contract FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_project ON project FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_cycle_eval ON cycle_evaluation FOR ALL USING (user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID);
CREATE POLICY tenant_isolation_cycle_eval_contract ON cycle_evaluation_contract 
    FOR ALL USING (
        cycle_evaluation_id IN (
            SELECT id FROM cycle_evaluation 
            WHERE user_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::UUID
        )
    );

-- Proteção Máxima: Força o RLS mesmo para superusuários (Postgres Role admins)
ALTER TABLE client FORCE ROW LEVEL SECURITY;
ALTER TABLE invoice FORCE ROW LEVEL SECURITY;
ALTER TABLE expense FORCE ROW LEVEL SECURITY;
ALTER TABLE ledger_transaction FORCE ROW LEVEL SECURITY;

-- 9.4. Rotina de Limpeza Automática do Outbox (Garbage Collection via pg_cron)
-- O próprio banco de dados deletará os logs já enviados para o BullMQ/RabbitMQ há mais de 7 dias, evitando inchaço.
SELECT cron.schedule(
    'limpeza_outbox_semanal',
    '0 3 * * *', -- Executa todos os dias às 03:00 da manhã
    $$
        DELETE FROM outbox_events
        WHERE processed_at IS NOT NULL
          AND processed_at < NOW() - INTERVAL '7 days';
    $$
);
