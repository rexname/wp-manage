import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component.ts').then(c => c.DashboardComponent),
    title: 'Dashboard'
  },
  {
    path: 'websites',
    loadComponent: () => import('./components/websites/websites.component.ts').then(c => c.WebsitesComponent),
    title: 'Manage Websites'
  },
  {
    path: 'keywords',
    loadComponent: () => import('./components/keywords/keywords.component.ts').then(c => c.KeywordsComponent),
    title: 'Keyword Trends'
  },
  {
    path: 'generator',
    loadComponent: () => import('./components/generator/generator.component.ts').then(c => c.GeneratorComponent),
    title: 'Article Generator'
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component.ts').then(c => c.SettingsComponent),
    title: 'Settings'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];