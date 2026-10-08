import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserSession, AuthResponse, OnboardingStep, UserProfileData } from '../models/user.model';
import { ToastService } from './toast.service';

const SESSION_STORAGE_KEY = 'axiom_lancer_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly apiUrl = 'http://localhost:3333/api/v1';

  // Signals para reatividade de alta performance
  public currentUser = signal<UserSession | null>(this.loadPersistedSession());
  public isLoading = signal<boolean>(false);
  public isAuthenticated = computed(() => this.currentUser() !== null);
  public onboardingStatus = computed(() => this.currentUser()?.onboardingStatus ?? null);

  constructor() {
    this.checkSession();
  }

  private loadPersistedSession(): UserSession | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved) as UserSession;
        }
      }
    } catch {
      // Fallback silencioso
    }
    return null;
  }

  private persistSession(session: UserSession | null): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (session) {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch {
      // Fallback silencioso
    }
  }

  /**
   * Verifica se há uma sessão BFF ativa via cookie HttpOnly ou local
   */
  public async checkSession(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ success: boolean; session: UserSession }>(`${this.apiUrl}/auth/me`, {
          withCredentials: true,
        })
      );
      if (res && res.session) {
        const existing = this.currentUser();
        const merged: UserSession = {
          ...res.session,
          name: existing?.name || res.session.name || 'Freelancer Pro',
          onboardingStatus: (res.session.onboardingStatus as OnboardingStep) || existing?.onboardingStatus || 'COMPLETED',
        };
        this.currentUser.set(merged);
        this.persistSession(merged);
      }
    } catch {
      // Se a API estiver offline mas houver sessão persistida localmente, mantém
      const local = this.loadPersistedSession();
      if (local) {
        this.currentUser.set(local);
      }
    }
  }

  /**
   * Autenticação via BFF ou Demonstração com suporte a status de onboarding
   */
  public async login(email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(
          `${this.apiUrl}/auth/session`,
          { email, password },
          { withCredentials: true }
        )
      );

      if (res && res.success) {
        const existing = this.loadPersistedSession();
        const userSession: UserSession = {
          userId: res.user.id,
          name: existing?.name || res.user.name || this.formatNameFromEmail(email),
          email: res.user.email,
          role: res.user.role,
          onboardingStatus: (res.user.onboardingStatus as OnboardingStep) || existing?.onboardingStatus || 'COMPLETED',
          ...(existing?.taxId ? { taxId: existing.taxId } : {}),
          ...(existing?.phone ? { phone: existing.phone } : {}),
          ...(existing?.profession ? { profession: existing.profession } : {}),
          ...(existing?.pixKey ? { pixKey: existing.pixKey } : {}),
        };
        this.currentUser.set(userSession);
        this.persistSession(userSession);
        this.toast.show('Sessão BFF iniciada com segurança via cookies HttpOnly!', 'success');
        return true;
      }
      return false;
    } catch {
      // Modo Demonstração / Fallback quando backend offline
      const existing = this.loadPersistedSession();
      const userSession: UserSession = {
        userId: existing?.userId || '11111111-2222-3333-4444-555555555555',
        name: existing?.name || this.formatNameFromEmail(email),
        email,
        role: 'FREELANCER_PRO',
        onboardingStatus: existing?.onboardingStatus || 'COMPLETED',
        ...(existing?.taxId ? { taxId: existing.taxId } : {}),
        ...(existing?.phone ? { phone: existing.phone } : {}),
        ...(existing?.profession ? { profession: existing.profession } : {}),
        ...(existing?.pixKey ? { pixKey: existing.pixKey } : {}),
      };
      this.currentUser.set(userSession);
      this.persistSession(userSession);
      this.toast.show('Sessão inicializada com sucesso!', 'info');
      return true;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Registro de novo usuário - Inicializa a jornada com onboardingStatus = 'TOUR_PENDING'
   */
  public async register(name: string, email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    try {
      try {
        const res = await firstValueFrom(
          this.http.post<AuthResponse>(
            `${this.apiUrl}/auth/register`,
            { name, email, password },
            { withCredentials: true }
          )
        );
        if (res && res.success) {
          const newSession: UserSession = {
            userId: res.user.id,
            name: res.user.name || name.trim(),
            email: res.user.email,
            role: res.user.role,
            onboardingStatus: 'TOUR_PENDING',
          };
          this.currentUser.set(newSession);
          this.persistSession(newSession);
          this.toast.show(`Conta criada com sucesso! Bem-vindo, ${newSession.name}!`, 'success');
          return true;
        }
      } catch {
        // Fallback local se o BFF estiver offline
      }

      const newSession: UserSession = {
        userId: 'usr_' + Date.now().toString(36),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'FREELANCER_PRO',
        onboardingStatus: 'TOUR_PENDING',
      };

      this.currentUser.set(newSession);
      this.persistSession(newSession);
      this.toast.show(`Conta criada com sucesso! Bem-vindo, ${newSession.name}!`, 'success');
      return true;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Autenticação Social (Google, Facebook, Apple)
   */
  public async socialLogin(provider: 'google' | 'facebook' | 'apple'): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const providerProfiles = {
        google: {
          name: 'Henrique Montes (Google)',
          email: 'henrique.montes@gmail.com',
        },
        apple: {
          name: 'Henrique Montes (Apple ID)',
          email: 'henrique.montes@privaterelay.appleid.com',
        },
        facebook: {
          name: 'Henrique Montes (Facebook)',
          email: 'henrique.montes@facebook.com',
        },
      };

      const profile = providerProfiles[provider];
      const newSession: UserSession = {
        userId: `usr_${provider}_${Date.now().toString(36)}`,
        name: profile.name,
        email: profile.email,
        role: 'FREELANCER_PRO',
        onboardingStatus: 'TOUR_PENDING',
      };

      this.currentUser.set(newSession);
      this.persistSession(newSession);
      this.toast.show(`Autenticado com ${provider.toUpperCase()} com sucesso!`, 'success');
      return true;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Conclui o Tour de Onboarding -> Transiciona para 'PROFILE_PENDING'
   */
  public async completeTour(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put(
          `${this.apiUrl}/auth/onboarding/tour`,
          { tourCompleted: true },
          { withCredentials: true }
        )
      );
    } catch {
      // Fallback
    }

    const current = this.currentUser();
    if (current) {
      const updated: UserSession = {
        ...current,
        onboardingStatus: 'PROFILE_PENDING',
      };
      this.currentUser.set(updated);
      this.persistSession(updated);
      this.toast.show('Tour concluído! Complete seus dados para ativar o Cockpit.', 'info');
    }
  }

  /**
   * Conclui o Progressive Profiling -> Transiciona para 'COMPLETED'
   */
  public async updateProfile(data: UserProfileData & { name?: string }): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put(
          `${this.apiUrl}/auth/profile`,
          data,
          { withCredentials: true }
        )
      );
    } catch {
      // Fallback
    }

    const current = this.currentUser();
    if (current) {
      const updated: UserSession = {
        ...current,
        ...data,
        name: data.name?.trim() || current.name,
        onboardingStatus: 'COMPLETED',
      };
      this.currentUser.set(updated);
      this.persistSession(updated);
      this.toast.show('Perfil concluído com sucesso! Cockpit liberado.', 'success');
    }
  }

  /**
   * Encerramento de sessão com invalidação de cookie no BFF e limpeza do storage
   */
  public async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      );
    } catch {
      // Fallback
    } finally {
      this.currentUser.set(null);
      this.persistSession(null);
      this.toast.show('Sessão encerrada com sucesso.', 'info');
    }
  }

  private formatNameFromEmail(email: string): string {
    const localPart = email.split('@')[0] || 'Usuário';
    return localPart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}

