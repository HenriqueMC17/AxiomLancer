import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  id: string;
  category: 'seguranca' | 'panico' | 'split' | 'planos';
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="faq" class="faq-section-wrap">
      <div class="section-header">
        <span class="badge badge-emerald mb-3">TIRE SUAS DÚVIDAS</span>
        <h2 class="section-title">Perguntas Frequentes &amp; Garantias de Missão Crítica</h2>
        <p class="section-desc">
          Entenda como o AxiomLancer protege seu faturamento, automatiza cobranças e respeita as normas do Bacen.
        </p>
      </div>

      <!-- Filtro por Categoria -->
      <div class="categories-row">
        @for (cat of categories; track cat.id) {
          <button
            type="button"
            (click)="activeCategory.set(cat.id)"
            [class.category-active]="activeCategory() === cat.id"
            class="category-btn cursor-pointer">
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        }
      </div>

      <!-- Lista do Acordeão -->
      <div class="faq-list">
        @for (item of filteredFaqs(); track item.id) {
          <div 
            class="glass-card faq-card"
            [class.faq-card-open]="openItemId() === item.id">
            <button
              type="button"
              (click)="toggleItem(item.id)"
              class="faq-trigger cursor-pointer">
              <span class="faq-question">{{ item.question }}</span>
              <span class="faq-icon" [class.rotate-icon]="openItemId() === item.id">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </button>

            @if (openItemId() === item.id) {
              <div class="faq-body">
                <p class="faq-answer">{{ item.answer }}</p>
              </div>
            }
          </div>
        }
      </div>

      <!-- Box de Suporte Imediato -->
      <div class="support-banner">
        <div class="support-content">
          <div class="support-icon">🛡️</div>
          <div>
            <h4 class="support-title">Ainda tem alguma dúvida operacional ou jurídica?</h4>
            <p class="support-desc">Nossa equipe de engenharia e suporte financeiro responde em até 15 minutos.</p>
          </div>
        </div>
        <a href="mailto:suporte@axiomlancer.dev" class="btn-support-contact">
          Falar com um Especialista →
        </a>
      </div>
    </section>
  `,
  styles: [`
    .faq-section-wrap {
      max-width: 1040px;
      margin: 0 auto;
      padding: 6rem 1.5rem;
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
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .categories-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .category-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 9999px;
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      transition: all 0.2s ease;
    }
    .category-btn:hover {
      background: #22232b;
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .category-active {
      background: rgba(16, 185, 129, 0.15) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 3.5rem;
    }

    .faq-card {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.2s ease;
    }
    .faq-card:hover {
      border-color: rgba(255, 255, 255, 0.16);
      transform: translateY(-1px);
    }
    .faq-card-open {
      border-color: rgba(16, 185, 129, 0.35);
      background: #1b1c23;
    }

    .faq-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
      background: transparent;
      border: none;
      text-align: left;
      color: #ffffff;
    }

    .faq-question {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #f1f5f9;
      line-height: 1.4;
    }

    .faq-icon {
      color: #94a3b8;
      display: flex;
      align-items: center;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
    }
    .rotate-icon {
      transform: rotate(180deg);
      color: #10b981;
    }

    .faq-body {
      padding: 0 1.5rem 1.25rem 1.5rem;
      animation: fadeIn 0.2s ease;
    }

    .faq-answer {
      font-size: 0.925rem;
      color: #94a3b8;
      line-height: 1.65;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .support-banner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 1.25rem;
      padding: 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      align-items: center;
      justify-content: space-between;
    }

    @media (min-width: 768px) {
      .support-banner {
        flex-direction: row;
      }
    }

    .support-content {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .support-icon {
      font-size: 2rem;
      background: #1e1f26;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .support-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.2rem;
    }

    .support-desc {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .btn-support-contact {
      padding: 0.75rem 1.5rem;
      background: #18191e;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 0.65rem;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .btn-support-contact:hover {
      background: #2563eb;
      border-color: #3b82f6;
      transform: translateY(-1px);
    }
  `]
})
export class FaqAccordionComponent {
  public activeCategory = signal<string>('todos');
  public openItemId = signal<string | null>('faq-1');

  public categories = [
    { id: 'todos', label: 'Todas as Dúvidas', icon: '⚡' },
    { id: 'panico', label: 'Botão de Pânico 12ms', icon: '🚨' },
    { id: 'seguranca', label: 'Segurança & BACEN', icon: '🛡️' },
    { id: 'split', label: 'Split & Cofre Fiscal', icon: '🏦' },
    { id: 'planos', label: 'Planos & Cancelamento', icon: '💎' },
  ];

  public faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'panico',
      question: 'Como funciona o Botão de Pânico (Safe Mode) com latência de 12ms?',
      answer: 'Ao acionar o Botão de Pânico, um trigger de alta prioridade propaga o estado de congelamento por toda a esteira em menos de 15 milissegundos. Todos os disparos agendados de WhatsApp, e-mails de cobrança e lembretes automáticos são suspensos instantaneamente. Seu cliente nunca saberá que a esteira foi congelada, preservando a diplomacia enquanto você resolve qualquer desalinhamento com a diretoria.',
    },
    {
      id: 'faq-2',
      category: 'seguranca',
      question: 'O AxiomLancer tem custódia do meu dinheiro ou acesso à minha conta bancária?',
      answer: 'Não! Seguimos estritamente o padrão Zero-Custody e Open Finance do Banco Central do Brasil. O AxiomLancer gera chaves PIX dinâmicas e reconcilia eventos através do sistema do BACEN, mas o dinheiro transita diretamente da conta do seu cliente para a sua conta bancária cadastrada. Nós nunca retemos fundos nem temos poder de saque.',
    },
    {
      id: 'faq-3',
      category: 'split',
      question: 'O que é o Split Tributário Automático com Cofre Virtual?',
      answer: 'Sempre que uma fatura é liquidada via PIX (ex: R$ 10.000,00), nosso motor calcula a alíquota fiscal configurada (ex: Simples Nacional 6%). Ele provisiona no Livro Razão Contábil o valor de R$ 600,00 em um cofre contábil isolado. Dessa forma, você nunca gasta por engano o dinheiro do DAS/IRPJ e sabe exatamente qual é o lucro líquido real do seu trabalho.',
    },
    {
      id: 'faq-4',
      category: 'seguranca',
      question: 'O que significa a garantia "Zero Data Leak"?',
      answer: 'Nossa arquitetura foi desenhada com Backend-for-Frontend (BFF), criptografia de cookies SameSite=Strict e segredos de ambiente validados em tempo de boot (Fail Fast). Não utilizamos bibliotecas de rastreamento invasivo e os dados financeiros de contratos, faturas e clientes pertencem exclusivamente ao seu tenant.',
    },
    {
      id: 'faq-5',
      category: 'planos',
      question: 'Existe fidelidade contratual ou taxa sobre o meu faturamento?',
      answer: 'Zero fidelidade e zero percentual sobre o seu dinheiro! Nós cobramos uma assinatura fixa pelo software. Você pode cancelar sua assinatura com apenas um clique a qualquer momento e exportar todo o seu histórico contábil (DRE e Livro Razão) em formato CSV ou JSON aberto.',
    },
    {
      id: 'faq-6',
      category: 'split',
      question: 'Posso integrar a emissão com as prefeituras e nota fiscal de serviço (NFS-e)?',
      answer: 'Sim! Nos planos Freelancer Pro e Studio Scale, fornecemos webhooks bidirecionais e endpoints de integração para emissão autônoma de NFS-e via provedores padrão de notas fiscais municipais.',
    },
  ];

  public toggleItem(id: string): void {
    this.openItemId.update((current) => (current === id ? null : id));
  }

  public filteredFaqs(): FaqItem[] {
    const cat = this.activeCategory();
    if (cat === 'todos') {
      return this.faqs;
    }
    return this.faqs.filter((f) => f.category === cat);
  }
}
