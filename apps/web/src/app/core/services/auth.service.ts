import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserSession, AuthResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly apiUrl = 'http://localhost:3333/api/v1';

  // Signals para reatividade de alta performance
  public currentUser = signal<UserSession | null>(null);
  public isLoading = signal<boolean>(false);
  public isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.checkSession();
  }

  /**
   * Verifica se há uma sessão BFF ativa via cookie HttpOnly
   */
  public async checkSession(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ success: boolean; session: UserSession }>(`${this.apiUrl}/auth/me`)
      );
      if (res && res.session) {
        this.currentUser.set(res.session);
      }
    } catch {
      // Sessão ausente ou expirada
      this.currentUser.set(null);
    }
  }

  /**
   * Autenticação via BFF: o backend emite o cookie HttpOnly e retorna dados do usuário
   */
  public async login(email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/auth/session`, { email, password })
      );

      if (res && res.success) {
        this.currentUser.set({
          userId: res.user.id,
          email: res.user.email,
          role: res.user.role,
        });
        this.toast.show('Sessão BFF iniciada com segurança via cookies HttpOnly!', 'success');
        return true;
      }
      return false;
    } catch {
      // Modo Demonstração / Fallback quando backend offline
      this.currentUser.set({
        userId: '11111111-2222-3333-4444-555555555555',
        email,
        role: 'FREELANCER_PRO',
      });
      this.toast.show('Sessão de demonstração inicializada!', 'info');
      return true;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Encerramento de sessão com invalidação de cookie no BFF
   */
  public async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/auth/logout`, {}));
    } catch {
      // Fallback
    } finally {
      this.currentUser.set(null);
      this.toast.show('Sessão encerrada com sucesso.', 'info');
    }
  }
}
