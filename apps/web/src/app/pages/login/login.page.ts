import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Ambient Glows -->
      <div class="ambient-glow-emerald -top-20 -left-20"></div>
      <div class="ambient-glow-cyan -bottom-20 -right-20"></div>

      <div class="glass-card max-w-md w-full p-8 relative z-10 border-white/10 shadow-2xl">
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2 mb-4 text-decoration-none">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <span class="text-xl font-black text-black">⚡</span>
            </div>
            <span class="font-bold text-xl text-white font-['Outfit'] tracking-tight">Axiom<span class="text-emerald-400">Lancer</span></span>
          </a>
          <h2 class="text-2xl font-bold text-white font-['Outfit']">Acessar Sessão BFF Segura</h2>
          <p class="text-xs text-slate-400 mt-1">Protegido por Cookies HttpOnly & SameSite=Strict</p>
        </div>

        <form (ngSubmit)="handleLogin()" class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-400 mb-1">E-mail Cadastrado</label>
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
            <label class="block text-xs font-mono text-slate-400 mb-1">Senha de Acesso</label>
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
            class="btn-primary w-full py-3 text-sm font-bold mt-2 cursor-pointer">
            @if (authService.isLoading()) {
              <span>Conectando ao BFF...</span>
            } @else {
              <span>Entrar na Plataforma →</span>
            }
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
          <p>Dica de Teste: Aceita qualquer credencial no ambiente de desenvolvimento.</p>
          <a routerLink="/" class="text-emerald-400 hover:underline block mt-2">← Voltar para a Landing Page</a>
        </div>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  public email = signal<string>('freelancer.pro@axiomlancer.dev');
  public password = signal<string>('AxiomLancer2026!');

  public async handleLogin(): Promise<void> {
    const success = await this.authService.login(this.email(), this.password());
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
