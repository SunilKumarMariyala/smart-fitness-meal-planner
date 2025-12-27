import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <nav class="navbar">
        <div class="nav-brand">
          <h2>💪 Fitness Planner</h2>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <a routerLink="/workouts" routerLinkActive="active">Workouts</a>
          <a routerLink="/meals" routerLinkActive="active">Meals</a>
          <a routerLink="/progress" routerLinkActive="active">Progress</a>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </nav>

      <div class="content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .navbar {
      background: white;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-brand h2 {
      margin: 0;
      color: #667eea;
    }

    .nav-links {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .nav-links a {
      color: #374151;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #667eea;
    }

    .btn-logout {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #dc2626;
    }

    .content {
      padding: 40px 20px;
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
