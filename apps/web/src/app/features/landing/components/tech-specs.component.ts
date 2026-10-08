import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SpecTab {
  id: 'outbox' | 'bff' | 'ledger' | 'pix';
  title: string;
  badge: string;
  codeSnippet: string;
  highlights: string[];
}

@Component({
  selector: 'app-tech-specs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="tech-specs" class="tech-specs-wrap">
      <div class="section-header">
        <span class="badge badge-cyan mb-3">ESPECIFICAÇÕES DE ENGENHARIA</span>
        <h2 class="section-title">Construído para Engenheiros, Designers &amp; Agências Exigentes</h2>
        <p class="section-desc">
          Sem caixas pretas: descubra como nossa arquitetura orientada a eventos garante consistência contábil e zero vazamento de dados.
        </p>
      </div>

      <div class="terminal-shell glass-card">
        <!-- Barra de Abas do Terminal -->
        <div class="shell-topbar">
          <div class="window-controls">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>

          <div class="tabs-list">
            @for (tab of tabs; track tab.id) {
              <button
                type="button"
                (click)="activeTab.set(tab.id)"
                [class.tab-active]="activeTab() === tab.id"
                class="tab-btn cursor-pointer font-mono">
                <span>{{ tab.title }}</span>
                <span class="tab-badge">{{ tab.badge }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Conteúdo do Terminal -->
        <div class="shell-body">
          <div class="code-column">
            <div class="code-header">
              <span class="font-mono text-xs text-slate-400">
                // SOURCE: {{ currentTab().title.toUpperCase() }} SPECIFICATION
              </span>
              <span class="text-xs font-mono text-emerald-400 font-semibold">● DETERMINÍSTICO</span>
            </div>
            <pre class="code-block font-mono"><code>{{ currentTab().codeSnippet }}</code></pre>
          </div>

          <!-- Coluna Lateral de Garantias de Engenharia -->
          <div class="guarantees-column">
            <h4 class="column-title font-mono text-xs text-slate-300 uppercase tracking-wider mb-3">
              Garantias Arquiteturais:
            </h4>
            <ul class="highlights-list">
              @for (h of currentTab().highlights; track h) {
                <li class="highlight-item">
                  <span class="check-icon">✓</span>
                  <span class="highlight-text">{{ h }}</span>
                </li>
              }
            </ul>

            <div class="latency-benchmark mt-6">
              <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Tempo de Resposta Médio (P99):</span>
                <span class="text-emerald-400 font-bold">11.8ms</span>
              </div>
              <div class="benchmark-track">
                <div class="benchmark-fill" style="width: 24%"></div>
              </div>
              <span class="text-[11px] text-slate-500 font-mono mt-1 block">
                Benchmarking auditado com Fastify 5.x + PostgreSQL 16 + Redis Streams
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tech-specs-wrap {
      max-width: 1140px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3.5rem;
    }

    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 2.25rem;
      font-weight: 800;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
    }

    .section-desc {
      font-size: 1rem;
      color: #94a3b8;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .terminal-shell {
      background: #14151b;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
    }

    .shell-topbar {
      display: flex;
      flex-direction: column;
      background: #181920;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.75rem 1rem;
      gap: 0.75rem;
    }

    @media (min-width: 768px) {
      .shell-topbar {
        flex-direction: row;
        align-items: center;
        gap: 1.5rem;
      }
    }

    .window-controls {
      display: flex;
      gap: 0.45rem;
    }

    .dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }
    .red { background-color: #ef4444; }
    .yellow { background-color: #eab308; }
    .green { background-color: #22c55e; }

    .tabs-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      background: #1e1f28;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.5rem;
      color: #94a3b8;
      font-size: 0.78rem;
      transition: all 0.15s ease;
    }
    .tab-btn:hover {
      background: #252632;
      color: #ffffff;
    }
    .tab-active {
      background: rgba(6, 182, 212, 0.15) !important;
      border-color: #06b6d4 !important;
      color: #22d3ee !important;
    }

    .tab-badge {
      font-size: 0.65rem;
      padding: 0.1rem 0.35rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 0.25rem;
    }

    .shell-body {
      display: grid;
      grid-cols-1;
    }

    @media (min-width: 900px) {
      .shell-body {
        grid-template-columns: 1.6fr 1fr;
      }
    }

    .code-column {
      background: #0d0e12;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    @media (min-width: 900px) {
      .code-column {
        border-bottom: none;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
      }
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .code-block {
      color: #a5b4fc;
      font-size: 0.78rem;
      line-height: 1.65;
      overflow-x: auto;
      white-space: pre;
    }

    .guarantees-column {
      padding: 1.5rem;
      background: #14151b;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .highlights-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .highlight-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      font-size: 0.825rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    .check-icon {
      color: #10b981;
      font-weight: 900;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .benchmark-track {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 0.35rem;
    }

    .benchmark-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #06b6d4 100%);
      border-radius: 9999px;
    }
  `]
})
export class TechSpecsComponent {
  public activeTab = signal<'outbox' | 'bff' | 'ledger' | 'pix'>('outbox');

  public tabs: SpecTab[] = [
    {
      id: 'outbox',
      title: 'Transactional Outbox',
      badge: 'CQRS SYNC',
      codeSnippet: `// 1. Gravação Atômica (UnitOfWork)
await prisma.$transaction([
  prisma.invoice.create({ data: invoiceData }),
  prisma.outboxEvent.create({
    data: {
      eventType: 'INVOICE_CREATED',
      payload: invoiceData,
      status: 'PENDING',
      idempotencyKey: 'IDEMP_' + invoiceId,
    }
  })
]);

// 2. Outbox Worker em Background (Zero Perda de Evento)
const worker = new OutboxWorker({ intervalMs: 250 });
worker.process((evt) => convexSink.publish(evt));`,
      highlights: [
        'Atomicidade garantida com UnitOfWork (ACID no PostgreSQL)',
        'Worker desacoplado com reconciliação assíncrona',
        'Chaves de idempotência SHA-256 evitando cobranças duplicadas',
        'Sincronização em tempo real com Convex Cloud',
      ],
    },
    {
      id: 'bff',
      title: 'BFF & Zero Trust',
      badge: 'SECURITY',
      codeSnippet: `// Fastify Session Decorator com Cookies HttpOnly
fastify.decorateReply('setBffSession', function (token) {
  this.setCookie('__Host-axiom_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 86400,
  });
});

// Fail Fast Boot Validation
export const env = envSchema.parse(process.env);`,
      highlights: [
        'Cookies HttpOnly com prefixo __Host- anti-XSS e anti-CSRF',
        'SameSite=Strict impedindo qualquer ataque de sequestro de sessão',
        'Zod Fail-Fast impedindo instâncias com variáveis ausentes',
        'Zero credenciais bancárias persistidas no cliente',
      ],
    },
    {
      id: 'ledger',
      title: 'Double-Entry Ledger',
      badge: 'CONTÁBIL',
      codeSnippet: `// Lançamento de Partidas Dobradas (DRE Auditável)
const ledgerEntry = {
  debit: { account: 'ASSET_OPERACIONAL', amount: netAmount },
  credit: { account: 'RECEIVABLE_INVOICE', amount: grossAmount },
  taxReserve: {
    account: 'VIRTUAL_TAX_VAULT',
    splitRate: 0.06, // 6% retido automaticamente
    amount: taxAmount,
  }
};
assert(ledgerEntry.debit.amount + taxAmount === grossAmount);`,
      highlights: [
        'Contabilidade de partidas dobradas (Débito e Crédito balanceados)',
        'Split tributário automático isolado antes da distribuição do lucro',
        'Cálculo nativo em centavos para eliminar erros de ponto flutuante',
        'Geração de DRE e projeção de caixa para 30/60/90 dias',
      ],
    },
    {
      id: 'pix',
      title: 'PIX Bacen & Panic',
      badge: '12ms CORE',
      codeSnippet: `// Protocolo de Pânico Instantâneo (Safe Mode)
function triggerPanic(tenantId: string) {
  redis.publish('PANIC_KILL_SWITCH', {
    tenantId,
    timestamp: Date.now(),
    channels: ['WHATSAPP', 'SMTP_EMAIL'],
    action: 'FREEZE_ALL_PENDING_NOTIFICATIONS'
  });
  // Latência auditada: 12ms ponta a ponta
}

// QR Code Dinâmico com expiração e conciliação`,
      highlights: [
        'Congelamento em tempo real de réguas de cobrança em < 15ms',
        'QR Code dinâmico Bacen com payload copia-e-cola imediato',
        'Conciliação bancária autônoma via webhook bancário direto',
        'Nenhum alerta de cobrança disparado enquanto em Safe Mode',
      ],
    },
  ];

  public currentTab(): SpecTab {
    return this.tabs.find((t) => t.id === this.activeTab()) || this.tabs[0];
  }
}
