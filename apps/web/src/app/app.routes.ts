import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((m) => m.LandingPageComponent),
    title: 'AxiomLancer ⚡ | Gestão Financeira, Faturamento & Cobrança Autônoma',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPageComponent),
    title: 'Cockpit Financeiro | AxiomLancer',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPageComponent),
    title: 'Login Seguro BFF | AxiomLancer',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
