import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setCurrentUser(response.user);
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setCurrentUser(response.user);
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.clearCurrentUser();
        })
      );
  }

  getMe(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(
        tap(response => {
          this.setCurrentUser(response.user);
        })
      );
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearCurrentUser();
      }
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}
