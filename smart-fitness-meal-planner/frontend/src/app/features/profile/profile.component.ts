import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="card header-card">
          <h1>👤 Your Profile</h1>
          <p>View and manage your fitness profile</p>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your profile...</p>
        </div>

        <div *ngIf="!loading && user" class="profile-grid">
          <!-- Personal Information -->
          <div class="card info-card">
            <h3>📋 Personal Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">{{ user.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Age</span>
                <span class="info-value">{{ user.age }} years</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gender</span>
                <span class="info-value">{{ user.gender | titlecase }}</span>
              </div>
            </div>
          </div>

          <!-- Physical Stats -->
          <div class="card info-card">
            <h3>📏 Physical Stats</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Height</span>
                <span class="info-value">{{ user.height }} cm</span>
              </div>
              <div class="info-item">
                <span class="info-label">Weight</span>
                <span class="info-value">{{ user.weight }} kg</span>
              </div>
              <div class="info-item">
                <span class="info-label">BMI</span>
                <span class="info-value">{{ calculateBMI() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Fitness Goal</span>
                <span class="info-value goal-badge">{{ formatGoal(user.goal) }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card actions-card">
            <h3>⚡ Quick Actions</h3>
            <div class="actions-grid">
              <button class="btn-secondary" routerLink="/workouts">
                🏋️ View Workouts
              </button>
              <button class="btn-secondary" routerLink="/meals">
                🍽️ View Meals
              </button>
              <button class="btn-secondary" routerLink="/progress">
                📊 Track Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .header-card {
      text-align: center;
      margin-bottom: 32px;
    }

    .header-card h1 {
      color: #1f2937;
      margin-bottom: 8px;
    }

    .header-card p {
      color: #6b7280;
    }

    .loading-state {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .profile-grid {
      display: grid;
      gap: 24px;
    }

    .info-card h3 {
      color: #1f2937;
      margin-bottom: 20px;
      font-size: 18px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }

    .info-label {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .info-value {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    .goal-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-size: 14px;
    }

    .actions-card h3 {
      color: #1f2937;
      margin-bottom: 20px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  
  user: User | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;

    this.userService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load profile', error);
        this.loading = false;
      }
    });
  }

  calculateBMI(): string {
    if (!this.user) return '-';
    const heightInMeters = this.user.height / 100;
    const bmi = this.user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  }

  formatGoal(goal: string): string {
    return goal.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
