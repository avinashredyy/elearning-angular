import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HealthComponent } from './features/health/health.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'health', component: HealthComponent },
  { 
    path: 'courses', 
    children: [
      { path: '', loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent) },
      { path: 'create', loadComponent: () => import('./features/courses/course-create/course-create.component').then(m => m.CourseCreateComponent) },
      { path: ':id/edit', loadComponent: () => import('./features/courses/course-edit/course-edit.component').then(m => m.CourseEditComponent) }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];