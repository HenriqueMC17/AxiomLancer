import { Routes } from '@angular/router';
import {
  authGuard,
  onboardingTourGuard,
  onboardingProfileGuard,
} from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((m) => m.LandingPageComponent),
    title: 'AxiomLancer ⚡ | Gestão Financeira, Faturamento & Cobrança Autônoma',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPageComponent),
    title: 'Autenticação & Registro | AxiomLancer',
  },
  {
    path: 'onboarding/tour',
    canActivate: [onboardingTourGuard],
    loadComponent: () =>
      import('./pages/onboarding/tour.page').then((m) => m.OnboardingTourPageComponent),
    title: 'Tour de Onboarding | AxiomLancer',
  },
  {
    path: 'onboarding/profile',
    canActivate: [onboardingProfileGuard],
    loadComponent: () =>
      import('./pages/onboarding/profile.page').then(
        (m) => m.ProgressiveProfilePageComponent
      ),
    title: 'Perfil de Faturamento & PIX | AxiomLancer',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPageComponent),
    title: 'Cockpit Financeiro Executivo | AxiomLancer',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
