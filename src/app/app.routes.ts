import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'testimonials',
    loadComponent: () =>
      import('./pages/testimonials/testimonials-page').then(m => m.TestimonialsPage),
  },
  {
    path: 'preview',
    loadComponent: () => import('./pages/preview/preview-page').then(m => m.PreviewPage),
  },
  {
    path: 'plans',
    loadComponent: () => import('./pages/plans/plans-page').then(m => m.PlansPage),
  },
  {
    path: 'team',
    loadComponent: () => import('./pages/team/team-page').then(m => m.TeamPage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq-page').then(m => m.FaqPage),
  },
  {
    path: 'changelog',
    loadComponent: () =>
      import('./pages/changelog/changelog-page').then(m => m.ChangelogPage),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/calculator/calculator-page').then(m => m.CalculatorPage),
  },
];
