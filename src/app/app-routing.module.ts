import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

const routes: Routes = [
  // Redirect empty path to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Auth routes (login, register) - no auth required
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    data: { hideNavigation: true }
  },

  // Main application routes - require authentication
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          title: 'Dashboard',
          breadcrumb: 'Dashboard' 
        }
      },

      // Courses feature module - lazy loaded
      {
        path: 'courses',
        loadChildren: () => import('./features/courses/courses.module').then(m => m.CoursesModule),
        canActivate: [RoleGuard],
        data: { 
          expectedRoles: ['admin', 'instructor', 'student'],
          breadcrumb: 'Courses' 
        }
      },

      // Admin routes - restricted to admins only
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [RoleGuard],
        data: { 
          expectedRoles: ['admin'],
          breadcrumb: 'Administration' 
        }
      },

      // User profile
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
        data: { 
          breadcrumb: 'Profile' 
        }
      },

      // Settings
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
        data: { 
          breadcrumb: 'Settings' 
        }
      }
    ]
  },

  // 404 Not Found
  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { title: 'Page Not Found' }
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { } 