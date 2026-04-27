import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'panel',
    loadComponent: () => import('./components/panel/panel.component').then(m => m.PanelComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'buscador', pathMatch: 'full' },
      {
        path: 'buscador',
        loadComponent: () => import('./components/buscador/buscador.component').then(m => m.BuscadorComponent)
      },
      {
        path: 'especialistas',
        loadComponent: () => import('./components/especialistas-list/especialistas-list.component').then(m => m.EspecialistasListComponent)
      },
      {
        path: 'instituciones',
        loadComponent: () => import('./components/instituciones-list/instituciones-list.component').then(m => m.InstitucionesListComponent)
      },
      {
        path: 'pacientes',
        loadComponent: () => import('./components/pacientes-list/pacientes-list.component').then(m => m.PacientesListComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];