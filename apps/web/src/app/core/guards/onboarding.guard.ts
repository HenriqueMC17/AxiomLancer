import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de rota para proteger o Cockpit Dashboard.
 * Redireciona usuários não autenticados para o login e direciona
 * para as etapas pendentes de onboarding se o fluxo não estiver completo.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (user.onboardingStatus === 'TOUR_PENDING') {
    return router.createUrlTree(['/onboarding/tour']);
  }

  if (user.onboardingStatus === 'PROFILE_PENDING') {
    return router.createUrlTree(['/onboarding/profile']);
  }

  return true;
};

/**
 * Guarda para a tela de Tour de Onboarding (/onboarding/tour).
 * Impede que usuários com perfil pendente ou concluído fiquem presos no tour.
 */
export const onboardingTourGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (user.onboardingStatus === 'COMPLETED') {
    return router.createUrlTree(['/dashboard']);
  }

  if (user.onboardingStatus === 'PROFILE_PENDING') {
    return router.createUrlTree(['/onboarding/profile']);
  }

  return true;
};

/**
 * Guarda para a tela de Progressive Profiling (/onboarding/profile).
 * Garante que o usuário concluiu o tour antes e não acesse se já estiver 100% concluído.
 */
export const onboardingProfileGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (user.onboardingStatus === 'COMPLETED') {
    return router.createUrlTree(['/dashboard']);
  }

  if (user.onboardingStatus === 'TOUR_PENDING') {
    return router.createUrlTree(['/onboarding/tour']);
  }

  return true;
};
