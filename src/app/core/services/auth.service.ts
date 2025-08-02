import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  // Angular Signals for reactive state
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  private _token = signal<string | null>(null);

  // Public signals
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  token = this._token.asReadonly();

  // Computed values
  userRole = computed(() => this._currentUser()?.role || 'guest');
  userRoles = computed(() => this._currentUser()?.roles || []);

  // BehaviorSubject for backward compatibility
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check for stored token on app initialization
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this._token.set(storedToken);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
        this.isAuthenticated$.next(true);
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    this.clearAuth();
    // Optionally call logout endpoint
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {});
  }

  setAuthData(user: User, token: string): void {
    this._currentUser.set(user);
    this._token.set(token);
    this._isAuthenticated.set(true);
    this.isAuthenticated$.next(true);
    
    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private clearAuth(): void {
    this._currentUser.set(null);
    this._token.set(null);
    this._isAuthenticated.set(false);
    this.isAuthenticated$.next(false);
    
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  hasRole(role: string): boolean {
    const user = this._currentUser();
    return user?.roles?.includes(role) || user?.role === role || false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Mock methods for development (remove in production)
  mockLogin(email: string, password: string): Observable<LoginResponse> {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: email,
      role: 'instructor',
      roles: ['instructor', 'student']
    };
    
    const mockResponse: LoginResponse = {
      user: mockUser,
      token: 'mock-jwt-token'
    };
    
    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        this.setAuthData(mockUser, mockResponse.token);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }
} 