import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { WorkoutService, WeeklyWorkout, DayWorkout } from '@core/services/workout.service';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="card header-card">
          <h1>🏋️ Your Workout Plan</h1>
          <p>Personalized weekly workout routine based on your fitness goals</p>
          
          <button 
            class="btn-primary" 
            (click)="generatePlan()"
            [disabled]="loading"
          >
            {{ hasWorkout ? 'Regenerate Workout Plan' : 'Generate Workout Plan' }}
          </button>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Generating your personalized workout plan...</p>
        </div>

        <div *ngIf="errorMessage" class="error-card card">
          {{ errorMessage }}
        </div>

        <div *ngIf="!loading && weeklyWorkout" class="workout-grid">
          <div *ngFor="let dayWorkout of weeklyWorkout.workouts" class="day-card card">
            <h3>{{ dayWorkout.day }}</h3>
            
            <div *ngIf="dayWorkout.exercises && dayWorkout.exercises.length > 0" class="exercises">
              <div *ngFor="let exercise of dayWorkout.exercises" class="exercise-item">
                <div class="exercise-header">
                  <input 
                    type="checkbox" 
                    [checked]="isExerciseCompleted(dayWorkout.day, exercise.name)"
                    (change)="toggleExercise(dayWorkout.day, exercise.name)"
                    class="exercise-checkbox"
                  />
                  <span class="exercise-name">{{ exercise.name }}</span>
                </div>
                <div class="exercise-details">
                  <span class="badge">{{ exercise.sets }} sets</span>
                  <span class="badge">{{ exercise.reps }} reps</span>
                  <span class="badge">{{ exercise.rest }} rest</span>
                </div>
              </div>
            </div>

            <div *ngIf="!dayWorkout.exercises || dayWorkout.exercises.length === 0" class="rest-day">
              <p>🌟 Rest Day - Recovery is important!</p>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !weeklyWorkout && !errorMessage" class="empty-state card">
          <p>No workout plan yet. Click the button above to generate your personalized plan!</p>
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
      margin-bottom: 20px;
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

    .error-card {
      background: #fee2e2;
      color: #991b1b;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .workout-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .day-card {
      padding: 20px;
    }

    .day-card h3 {
      color: #667eea;
      margin-bottom: 16px;
      font-size: 20px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
    }

    .exercises {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .exercise-item {
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }

    .exercise-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .exercise-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .exercise-name {
      font-weight: 600;
      color: #1f2937;
      flex: 1;
    }

    .exercise-details {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-left: 26px;
    }

    .badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .rest-day {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-style: italic;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }
  `]
})
export class WorkoutsComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  
  weeklyWorkout: WeeklyWorkout | null = null;
  loading = false;
  errorMessage = '';
  hasWorkout = false;

  ngOnInit(): void {
    this.loadWorkout();
  }

  loadWorkout(): void {
    this.loading = true;
    this.errorMessage = '';

    this.workoutService.getWeeklyWorkout().subscribe({
      next: (response) => {
        this.weeklyWorkout = response.plan;
        this.hasWorkout = true;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.hasWorkout = false;
        } else {
          this.errorMessage = 'Failed to load workout plan';
        }
        this.loading = false;
      }
    });
  }

  generatePlan(): void {
    this.loading = true;
    this.errorMessage = '';

    this.workoutService.generateWorkoutPlan().subscribe({
      next: (response) => {
        this.weeklyWorkout = response.plan;
        this.hasWorkout = true;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to generate workout plan';
        this.loading = false;
      }
    });
  }

  isExerciseCompleted(day: string, exerciseName: string): boolean {
    const dayWorkout = this.weeklyWorkout?.workouts.find(w => w.day === day);
    return dayWorkout?.completed_exercises?.includes(exerciseName) || false;
  }

  toggleExercise(day: string, exerciseName: string): void {
    this.workoutService.markExerciseComplete(day, exerciseName).subscribe({
      next: () => {
        this.loadWorkout(); // Reload to get updated completion status
      },
      error: (error) => {
        console.error('Failed to update exercise status', error);
      }
    });
  }
}
