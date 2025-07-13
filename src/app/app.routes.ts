import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HealthComponent } from './features/health/health.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'health', component: HealthComponent },
  { path: 'courses', loadComponent: () => import('./features/courses/courses.component').then(m => m.CoursesComponent) },
  { path: '**', redirectTo: '/dashboard' }
];