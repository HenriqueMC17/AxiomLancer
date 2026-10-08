import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

interface ProfessionOption {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-wrapper">
      <!-- Glows de Ambientação -->
      <div class="ambient-glow glow-mint"></div>
      <div class="ambient-glow glow-blue"></div>

      <div class="profile-card">
        <!-- Header com Badge de Etapa Final -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold mb-3">
            <span>🛡️</span>
            <span>ETAPA FINAL DE ONBOARDING • PERFIL PROGRESSIVO</span>
          </div>

          <h1 class="text-2xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Configure seu Perfil de Faturamento
          </h1>
          <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Os dados básicos da sua conta foram pré-carregados. Complete as informações fiscais e bancárias para habilitar a emissão de faturas e o Pix Bacen.
          </p>
        </div>

        <!-- Alerta Informativo de Dados Pré-Preenchidos -->
        <div class="prefill-notice mb-6">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400">✓</span>
            <span class="font-bold text-slate-200">Dados da Conta Sincronizados:</span>
          </div>
          <p class="text-slate-400 mt-1 text-[11px]">
            Seu nome e e-mail corporativo cadastrados foram vinculados automaticamente a esta sessão.
          </p>
        </div>

        <form (ngSubmit)="handleSubmit()" class="space-y-5">
          <!-- 1. Nome e E-mail (Pré-preenchidos) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">
                <span>Nome Completo</span>
                <span class="text-emerald-400 font-mono text-[10px]">• Pré-carregado</span>
              </label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                required
                class="form-input"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label class="form-label">
                <span>E-mail Corporativo</span>
                <span class="text-emerald-400 font-mono text-[10px]">• Verificado</span>
              </label>
              <div class="relative">
                <input
                  type="email"
                  [value]="email"
                  name="email"
                  readonly
                  disabled
                  class="form-input cursor-not-allowed bg-[#131418] border-white/5 text-slate-400 pl-8"
                />
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-emerald-400">🔒</span>
              </div>
            </div>
          </div>

          <!-- 2. CPF/CNPJ e WhatsApp -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">
                <span>CPF ou CNPJ</span>
                <span class="text-rose-400 font-mono text-[10px]">* Obrigatório</span>
              </label>
              <input
                type="text"
                [(ngModel)]="taxId"
                (input)="formatTaxId()"
                name="taxId"
                required
                maxlength="18"
                class="form-input font-mono"
                placeholder="000.000.000-00 ou CNPJ"
              />
            </div>

            <div>
              <label class="form-label">
                <span>WhatsApp de Cobrança</span>
                <span class="text-rose-400 font-mono text-[10px]">* Obrigatório</span>
              </label>
              <input
                type="text"
                [(ngModel)]="phone"
                (input)="formatPhone()"
                name="phone"
                required
                maxlength="15"
                class="form-input font-mono"
                placeholder="(11) 98765-4321"
              />
            </div>
          </div>

          <!-- 3. Área de Atuação (Seletor de Chips) -->
          <div>
            <label class="form-label mb-2">
              <span>Área Principal de Atuação</span>
              <span class="text-rose-400 font-mono text-[10px]">* Selecione uma opção</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              @for (opt of professionOptions; track opt.id) {
                <button
                  type="button"
                  (click)="selectedProfession.set(opt.id)"
                  [class.profession-chip-active]="selectedProfession() === opt.id"
                  class="profession-chip cursor-pointer">
                  <span class="text-base">{{ opt.icon }}</span>
                  <span class="text-xs font-semibold leading-tight text-center">{{ opt.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- 4. Chave PIX Padrão & Razão Social Opcional -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">
                <span>Chave PIX para Liquidação</span>
                <span class="text-rose-400 font-mono text-[10px]">* Obrigatório</span>
              </label>
              <input
                type="text"
                [(ngModel)]="pixKey"
                name="pixKey"
                required
                class="form-input font-mono"
                placeholder="E-mail, CPF, Celular ou EVP"
              />
            </div>

            <div>
              <label class="form-label">
                <span>Razão Social / Fantasia</span>
                <span class="text-slate-500 font-mono text-[10px]">• Opcional</span>
              </label>
              <input
                type="text"
                [(ngModel)]="companyName"
                name="companyName"
                class="form-input"
                placeholder="Ex: Tech Solutions Consultoria"
              />
            </div>
          </div>

          @if (errorMessage()) {
            <div class="error-banner">
              <span>⚠️ {{ errorMessage() }}</span>
            </div>
          }

          <!-- Botão de Finalização -->
          <div class="pt-2">
            <button
              type="submit"
              [disabled]="isSubmitting()"
              class="btn-complete-profile cursor-pointer">
              @if (isSubmitting()) {
                <span class="spinner"></span>
                <span>Ativando Cockpit...</span>
              } @else {
                <span>Finalizar Configuração e Acessar Cockpit →</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-wrapper {
      min-height: 100vh;
      background-color: #121212;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      position: relative;
      overflow: hidden;
      font-family: var(--font-sans, 'Inter', sans-serif);
    }

    .ambient-glow {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 9999px;
      filter: blur(120px);
      pointer-events: none;
      opacity: 0.15;
    }
    .glow-mint {
      background: #10b981;
      top: -120px;
      left: -100px;
    }
    .glow-blue {
      background: #2563eb;
      bottom: -120px;
      right: -100px;
    }

    .profile-card {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
      max-width: 680px;
      width: 100%;
      padding: 2.25rem;
      position: relative;
      z-index: 10;
      backdrop-filter: blur(16px);
    }

    .prefill-notice {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 0.8rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      font-family: var(--font-mono, monospace);
      color: #94a3b8;
      margin-bottom: 0.35rem;
    }

    .profession-chip {
      background: #21222a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      padding: 0.75rem 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      color: #94a3b8;
      transition: all 0.15s ease;
    }
    .profession-chip:hover {
      background: #282933;
      border-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .profession-chip-active {
      background: rgba(16, 185, 129, 0.15);
      border-color: #10b981;
      color: #34d399;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);
    }

    .btn-complete-profile {
      width: 100%;
      padding: 0.9rem;
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      color: #042f2e;
      font-size: 0.95rem;
      font-weight: 800;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
      transition: all 0.15s ease;
    }
    .btn-complete-profile:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
    }
    .btn-complete-profile:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-banner {
      padding: 0.65rem 0.85rem;
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 0.5rem;
      color: #fca5a5;
      font-size: 0.78rem;
      font-family: var(--font-mono, monospace);
    }

    .spinner {
      width: 1.1rem;
      height: 1.1rem;
      border: 2px solid rgba(4, 47, 46, 0.3);
      border-top-color: #042f2e;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProgressiveProfilePageComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  // Dados Obrigatórios Pré-preenchidos da Conta
  public name = '';
  public email = '';

  // Dados Fiscais e Operacionais
  public taxId = '';
  public phone = '';
  public selectedProfession = signal<string>('software');
  public pixKey = '';
  public companyName = '';

  public errorMessage = signal<string>('');
  public isSubmitting = signal<boolean>(false);

  public professionOptions: ProfessionOption[] = [
    { id: 'software', label: 'Engenharia de Software', icon: '💻' },
    { id: 'design', label: 'UI/UX Design', icon: '🎨' },
    { id: 'agency', label: 'Agência / Tech Studio', icon: '🏢' },
    { id: 'data_ai', label: 'Dados & IA', icon: '📊' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      // PRE-POPULAÇÃO OBRIGATÓRIA A PARTIR DOS DADOS DE CRIAÇÃO DA CONTA
      this.name = user.name || '';
      this.email = user.email || '';

      // Se houver dados já salvos em sessão anterior, restaura
      if (user.taxId) this.taxId = user.taxId;
      if (user.phone) this.phone = user.phone;
      if (user.profession) this.selectedProfession.set(user.profession);
      if (user.pixKey) this.pixKey = user.pixKey;
      if (user.companyName) this.companyName = user.companyName;
    } else {
      // Fallback
      this.email = 'usuario@empresa.com';
      this.name = 'Usuário';
    }
  }

  public formatTaxId(): void {
    let v = this.taxId.replace(/\D/g, '');
    if (v.length <= 11) {
      // CPF: 000.000.000-00
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0001-00
      v = v.substring(0, 14);
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    this.taxId = v;
  }

  public formatPhone(): void {
    let v = this.phone.replace(/\D/g, '');
    v = v.substring(0, 11);
    if (v.length > 2) {
      v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    }
    if (v.length > 9) {
      v = `${v.substring(0, 10)}-${v.substring(10)}`;
    }
    this.phone = v;
  }

  public async handleSubmit(): Promise<void> {
    this.errorMessage.set('');

    if (!this.name.trim()) {
      this.errorMessage.set('Por favor, confirme seu nome completo.');
      return;
    }

    if (!this.taxId.trim() || this.taxId.replace(/\D/g, '').length < 11) {
      this.errorMessage.set('Informe um CPF ou CNPJ válido.');
      return;
    }

    if (!this.phone.trim() || this.phone.replace(/\D/g, '').length < 10) {
      this.errorMessage.set('Informe um WhatsApp válido para notificações e cobranças.');
      return;
    }

    if (!this.pixKey.trim()) {
      this.errorMessage.set('Informe uma chave PIX padrão para recebimentos automáticos.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await this.authService.updateProfile({
        name: this.name.trim(),
        taxId: this.taxId.trim(),
        phone: this.phone.trim(),
        profession: this.selectedProfession(),
        pixKey: this.pixKey.trim(),
        companyName: this.companyName.trim() || undefined,
      });

      this.toast.show(
        'Onboarding concluído com sucesso! Bem-vindo ao Cockpit Financeiro AxiomLancer.',
        'success'
      );
      this.router.navigate(['/dashboard']);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
