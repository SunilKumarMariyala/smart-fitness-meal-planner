import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="welcome-card card">
          <h1>Welcome to Your Fitness Dashboard! 🎯</h1>
          <p>Your personalized fitness and meal planning journey starts here.</p>
        </div>

        <div class="quick-actions">
          <div class="action-card card">
            <h3>🏋️ Generate Workout Plan</h3>
            <p>Get a personalized weekly workout routine based on your goals</p>
            <button class="btn-primary" routerLink="/workouts">View Workouts</button>
          </div>

          <div class="action-card card">
            <h3>🍽️ Generate Meal Plan</h3>
            <p>Receive customized meal plans with calorie tracking</p>
            <button class="btn-primary" routerLink="/meals">View Meals</button>
          </div>

          <div class="action-card card">
            <h3>📊 Track Progress</h3>
            <p>Monitor your weight and fitness journey with charts</p>
            <button class="btn-primary" routerLink="/progress">View Progress</button>
          </div>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .welcome-card {
      margin-bottom: 32px;
      text-align: center;
    }

    .welcome-card h1 {
      color: #1f2937;
      margin-bottom: 12px;
    }

    .welcome-card p {
      color: #6b7280;
      font-size: 18px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .action-card {
      text-align: center;
    }

    .action-card h3 {
      color: #1f2937;
      margin-bottom: 12px;
    }

    .action-card p {
      color: #6b7280;
      margin-bottom: 20px;
    }
  `]
})
export class DashboardComponent {}
