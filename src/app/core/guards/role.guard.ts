import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedRoles = route.data['expectedRoles'] as string[];
    
    if (!expectedRoles || expectedRoles.length === 0) {
      return this.createObservable(true);
    }

    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          return this.router.createUrlTree(['/auth/login']);
        }

        const user = this.authService.currentUser();
        if (!user) {
          return this.router.createUrlTree(['/auth/login']);
        }

        const hasRequiredRole = expectedRoles.some(role => 
          this.authService.hasRole(role)
        );

        if (hasRequiredRole) {
          return true;
        } else {
          return this.router.createUrlTree(['/403']); // Forbidden page
        }
      })
    );
  }

  private createObservable(value: boolean): Observable<boolean> {
    return new Observable(observer => {
      observer.next(value);
      observer.complete();
    });
  }
} 