import { Injectable, signal, computed } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
}

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  children?: NavigationItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Signals for reactive navigation state
  currentUrl = signal<string>('/');
  breadcrumbs = signal<BreadcrumbItem[]>([]);
  pageTitle = signal<string>('E-Learning Platform');
  
  // Main navigation items
  navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Courses',
      icon: 'school',
      route: '/courses',
      children: [
        { label: 'All Courses', icon: 'list', route: '/courses' },
        { label: 'Create Course', icon: 'add', route: '/courses/create', roles: ['admin', 'instructor'] }
      ]
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      route: '/analytics',
      roles: ['admin', 'instructor']
    },
    {
      label: 'Users',
      icon: 'people',
      route: '/admin/users',
      roles: ['admin']
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings'
    }
  ];

  // Computed navigation items based on user role
  availableNavigationItems = computed(() => {
    // This would filter based on current user's roles
    // For now, return all items
    return this.navigationItems;
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initializeNavigation();
  }

  private initializeNavigation(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.buildBreadcrumbs())
    ).subscribe(breadcrumbs => {
      this.breadcrumbs.set(breadcrumbs);
      this.currentUrl.set(this.router.url);
    });
  }

  private buildBreadcrumbs(): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    let route = this.activatedRoute.root;
    let url = '';

    while (route) {
      if (route.snapshot.data['breadcrumb']) {
        url += '/' + route.snapshot.url.map(segment => segment.path).join('/');
        
        breadcrumbs.push({
          label: route.snapshot.data['breadcrumb'],
          url: url,
          icon: route.snapshot.data['breadcrumbIcon']
        });
      }
      route = route.firstChild!;
    }

    return breadcrumbs;
  }

  // Navigation helper methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToCoursesWithQuery(params: any): void {
    this.router.navigate(['/courses'], { queryParams: params });
  }

  navigateBack(): void {
    window.history.back();
  }

  // Check if current route matches
  isCurrentRoute(route: string): boolean {
    return this.currentUrl().startsWith(route);
  }

  // Get navigation items filtered by user role
  getNavigationItemsForRole(userRoles: string[]): NavigationItem[] {
    return this.navigationItems.filter(item => {
      if (!item.roles || item.roles.length === 0) {
        return true; // Public navigation item
      }
      return item.roles.some(role => userRoles.includes(role));
    });
  }
} 