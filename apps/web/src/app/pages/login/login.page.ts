import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <!-- Glows de ambientação -->
      <div class="ambient-glow glow-mint"></div>
      <div class="ambient-glow glow-blue"></div>

      <div class="login-card">
        <!-- Header da Marca -->
        <div class="text-center mb-6">
          <a routerLink="/" class="brand-link">
            <div class="brand-badge-icon">
              <span class="text-lg">⚡</span>
            </div>
            <span class="brand-title">Axiom<span class="text-mint">Lancer</span></span>
            <span class="version-tag">2.0</span>
          </a>

          <h2 class="auth-headline">
            {{ mode() === 'login' ? 'Acessar Cockpit Financeiro' : 'Criar Nova Conta Corporativa' }}
          </h2>
          <p class="auth-subline">
            {{ mode() === 'login' 
                ? 'Conexão segura via BFF com proteção SameSite=Strict' 
                : 'Inicie sua jornada autônoma com tour guiado e perfil progressivo' }}
          </p>
        </div>

        <!-- Botões de Social Login (Google, Apple, Facebook) -->
        <div class="social-login-grid mb-5">
          <button
            type="button"
            (click)="handleSocialLogin('google')"
            [disabled]="authService.isLoading()"
            class="social-btn group">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.6.4-2.4L1.9 7C.7 9.4 0 12 0 14.7s.7 5.3 1.9 7.7l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            (click)="handleSocialLogin('apple')"
            [disabled]="authService.isLoading()"
            class="social-btn group">
            <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.81 1.43-.59.68-1.11 1.76-.97 2.81 1.07.08 2.16-.54 2.77-1.37z"/>
            </svg>
            <span>Apple</span>
          </button>

          <button
            type="button"
            (click)="handleSocialLogin('facebook')"
            [disabled]="authService.isLoading()"
            class="social-btn group">
            <svg class="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        <div class="divider-row mb-5">
          <span class="divider-line"></span>
          <span class="divider-text">ou com e-mail corporativo</span>
          <span class="divider-line"></span>
        </div>

        <!-- Abas de Navegação (Acessar vs Criar Usuário) -->
        <div class="mode-tabs mb-5">
          <button
            type="button"
            (click)="setMode('login')"
            [class.active-tab]="mode() === 'login'"
            class="mode-tab-btn">
            Acessar Conta
          </button>
          <button
            type="button"
            (click)="setMode('register')"
            [class.active-tab]="mode() === 'register'"
            class="mode-tab-btn">
            Criar Usuário
          </button>
        </div>

        <!-- FORMULÁRIO 1: LOGIN -->
        @if (mode() === 'login') {
          <form (ngSubmit)="handleLogin()" class="space-y-4">
            <div>
              <label class="input-label">E-mail Cadastrado</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="form-input"
                placeholder="seu.email@empresa.com"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="input-label">Senha de Acesso</label>
                <button
                  type="button"
                  (click)="openForgotPassword()"
                  class="text-xs text-mint hover:underline font-mono cursor-pointer">
                  Esqueci a senha
                </button>
              </div>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                class="form-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              [disabled]="authService.isLoading()"
              class="btn-submit cursor-pointer">
              @if (authService.isLoading()) {
                <span class="loading-spinner"></span>
                <span>Conectando ao BFF...</span>
              } @else {
                <span>Acessar Plataforma →</span>
              }
            </button>
          </form>
        }

        <!-- FORMULÁRIO 2: REGISTRO (CRIAR USUÁRIO) -->
        @if (mode() === 'register') {
          <form (ngSubmit)="handleRegister()" class="space-y-4">
            <div>
              <label class="input-label">Nome Completo</label>
              <input
                type="text"
                [(ngModel)]="registerName"
                name="registerName"
                required
                class="form-input"
                placeholder="Ex: Carlos Henrique Silva"
              />
            </div>

            <div>
              <label class="input-label">E-mail Corporativo</label>
              <input
                type="email"
                [(ngModel)]="registerEmail"
                name="registerEmail"
                required
                class="form-input"
                placeholder="carlos@consultoria.tech"
              />
            </div>

            <div>
              <label class="input-label">Senha Segura</label>
              <input
                type="password"
                [(ngModel)]="registerPassword"
                name="registerPassword"
                required
                minlength="6"
                class="form-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label class="input-label">Confirmar Senha</label>
              <input
                type="password"
                [(ngModel)]="registerConfirmPassword"
                name="registerConfirmPassword"
                required
                class="form-input"
                placeholder="Repita sua senha"
              />
            </div>

            @if (errorMessage()) {
              <div class="error-banner">
                <span>⚠️ {{ errorMessage() }}</span>
              </div>
            }

            <button
              type="submit"
              [disabled]="authService.isLoading()"
              class="btn-submit cursor-pointer">
              @if (authService.isLoading()) {
                <span class="loading-spinner"></span>
                <span>Criando credencial...</span>
              } @else {
                <span>Criar Usuário &amp; Iniciar Tour →</span>
              }
            </button>
          </form>
        }

        <!-- Rodapé do Card -->
        <div class="card-footer mt-6 pt-5 border-t border-white/10 text-center">
          <p class="text-xs text-slate-500 font-mono mb-2">
            Ambiente Seguro • Zero Data Leak • Criptografia AES-256
          </p>
          <a routerLink="/" class="text-xs text-mint hover:underline font-mono inline-flex items-center gap-1">
            <span>←</span> Voltar para a Landing Page
          </a>
        </div>
      </div>

      <!-- MODAL INTERATIVO: ESQUECI A SENHA -->
      @if (isForgotModalOpen()) {
        <div class="modal-backdrop" (click)="closeForgotPassword()">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>🔒</span> Redefinir Senha de Acesso
              </h3>
              <button
                type="button"
                (click)="closeForgotPassword()"
                class="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <p class="text-xs text-slate-400 mb-4">
              Informe seu e-mail cadastrado. Um link temporário com token criptográfico será enviado para redefinição segura.
            </p>

            <form (ngSubmit)="handleSendResetLink()" class="space-y-4">
              <div>
                <label class="input-label">Seu E-mail</label>
                <input
                  type="email"
                  [(ngModel)]="forgotEmail"
                  name="forgotEmail"
                  required
                  class="form-input"
                  placeholder="seu.email@empresa.com"
                />
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  (click)="closeForgotPassword()"
                  class="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-lg border border-white/10">
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn-primary-sm cursor-pointer">
                  Enviar Link de Recuperação
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      background-color: #121212;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      font-family: var(--font-sans, 'Inter', sans-serif);
    }

    .ambient-glow {
      position: absolute;
      width: 480px;
      height: 480px;
      border-radius: 9999px;
      filter: blur(120px);
      pointer-events: none;
      opacity: 0.18;
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

    .login-card {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.25rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      max-width: 460px;
      width: 100%;
      padding: 2.25rem;
      position: relative;
      z-index: 10;
      backdrop-filter: blur(16px);
    }

    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      text-decoration: none;
    }
    .brand-badge-icon {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.65rem;
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.25rem;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .text-mint {
      color: #10b981;
    }
    .version-tag {
      font-size: 0.7rem;
      font-family: var(--font-mono, monospace);
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
    }

    .auth-headline {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .auth-subline {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }

    .social-login-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.6rem 0.5rem;
      background: #21222a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.6rem;
      color: #e2e8f0;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .social-btn:hover {
      background: #292a35;
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .divider-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
    }
    .divider-text {
      font-size: 0.7rem;
      color: #64748b;
      font-family: var(--font-mono, monospace);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .mode-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0.25rem;
      background: #121316;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 0.6rem;
    }
    .mode-tab-btn {
      padding: 0.55rem 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      border: none;
      background: transparent;
      border-radius: 0.45rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .mode-tab-btn.active-tab {
      background: #21222a;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .input-label {
      display: block;
      font-size: 0.75rem;
      font-family: var(--font-mono, monospace);
      color: #94a3b8;
      margin-bottom: 0.35rem;
    }

    .btn-submit {
      width: 100%;
      padding: 0.8rem;
      background: #10b981;
      color: #064e3b;
      font-size: 0.9rem;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.65rem;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.15s ease;
    }
    .btn-submit:hover:not(:disabled) {
      background: #34d399;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
    }
    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-primary-sm {
      padding: 0.6rem 1.1rem;
      background: #10b981;
      color: #064e3b;
      font-size: 0.8rem;
      font-weight: 700;
      border-radius: 0.5rem;
      border: none;
    }
    .btn-primary-sm:hover {
      background: #34d399;
    }

    .error-banner {
      padding: 0.6rem 0.8rem;
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 0.5rem;
      color: #fca5a5;
      font-size: 0.78rem;
      font-family: var(--font-mono, monospace);
    }

    .loading-spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(6, 78, 59, 0.3);
      border-top-color: #064e3b;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 1rem;
    }
    .modal-box {
      background: #18191e;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 1rem;
      max-width: 440px;
      width: 100%;
      padding: 1.75rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    }
  `]
})
export class LoginPageComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  public mode = signal<AuthMode>('login');

  // Login inputs
  public email = 'freelancer.pro@axiomlancer.dev';
  public password = 'AxiomLancer2026!';

  // Register inputs
  public registerName = '';
  public registerEmail = '';
  public registerPassword = '';
  public registerConfirmPassword = '';
  public errorMessage = signal<string>('');

  // Forgot password modal
  public isForgotModalOpen = signal<boolean>(false);
  public forgotEmail = '';

  ngOnInit(): void {
    // Permite abrir diretamente no modo de cadastro via ?mode=register
    this.route.queryParams.subscribe((params) => {
      if (params['mode'] === 'register') {
        this.mode.set('register');
      }
    });
  }

  public setMode(newMode: AuthMode): void {
    this.mode.set(newMode);
    this.errorMessage.set('');
  }

  public async handleLogin(): Promise<void> {
    const success = await this.authService.login(this.email, this.password);
    if (success) {
      this.routeAfterAuth();
    }
  }

  public async handleRegister(): Promise<void> {
    this.errorMessage.set('');

    if (!this.registerName.trim() || !this.registerEmail.trim() || !this.registerPassword) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.errorMessage.set('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage.set('As senhas não coincidem. Verifique a digitação.');
      return;
    }

    const success = await this.authService.register(
      this.registerName,
      this.registerEmail,
      this.registerPassword
    );

    if (success) {
      // Novo registro sempre inicia o Onboarding Tour
      this.router.navigate(['/onboarding/tour']);
    }
  }

  public async handleSocialLogin(provider: 'google' | 'facebook' | 'apple'): Promise<void> {
    const success = await this.authService.socialLogin(provider);
    if (success) {
      this.routeAfterAuth();
    }
  }

  public openForgotPassword(): void {
    this.forgotEmail = this.email;
    this.isForgotModalOpen.set(true);
  }

  public closeForgotPassword(): void {
    this.isForgotModalOpen.set(false);
  }

  public handleSendResetLink(): void {
    if (!this.forgotEmail.trim()) {
      this.toast.show('Informe seu e-mail para continuar.', 'alert');
      return;
    }
    this.toast.show(
      `Link de recuperação temporário enviado com sucesso para ${this.forgotEmail}!`,
      'success'
    );
    this.closeForgotPassword();
  }

  private routeAfterAuth(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    switch (user.onboardingStatus) {
      case 'TOUR_PENDING':
        this.router.navigate(['/onboarding/tour']);
        break;
      case 'PROFILE_PENDING':
        this.router.navigate(['/onboarding/profile']);
        break;
      case 'COMPLETED':
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
