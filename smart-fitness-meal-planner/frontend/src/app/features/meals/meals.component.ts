import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { MealService, DailyMeals, Meal } from '@core/services/meal.service';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="card header-card">
          <h1>🍽️ Your Meal Plan</h1>
          <p>Personalized daily meal plan with calorie and macro tracking</p>
          
          <button 
            class="btn-primary" 
            (click)="generatePlan()"
            [disabled]="loading"
          >
            {{ hasMeals ? 'Regenerate Meal Plan' : 'Generate Meal Plan' }}
          </button>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Generating your personalized meal plan...</p>
        </div>

        <div *ngIf="errorMessage" class="error-card card">
          {{ errorMessage }}
        </div>

        <div *ngIf="!loading && dailyMeals" class="meals-container">
          <!-- Nutrition Summary -->
          <div class="card nutrition-card">
            <h3>📊 Daily Nutrition Summary</h3>
            <div class="nutrition-grid">
              <div class="nutrition-item">
                <span class="nutrition-label">Total Calories</span>
                <span class="nutrition-value">{{ dailyMeals.total_calories }} kcal</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">Protein</span>
                <span class="nutrition-value">{{ dailyMeals.total_protein }}g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">Carbs</span>
                <span class="nutrition-value">{{ dailyMeals.total_carbs }}g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">Fats</span>
                <span class="nutrition-value">{{ dailyMeals.total_fats }}g</span>
              </div>
            </div>
          </div>

          <!-- Meals -->
          <div class="meals-grid">
            <div *ngFor="let meal of dailyMeals.meals" class="meal-card card">
              <div class="meal-header">
                <h3>{{ getMealIcon(meal.type) }} {{ meal.type }}</h3>
                <input 
                  type="checkbox" 
                  [checked]="isMealCompleted(meal.type)"
                  (change)="toggleMeal(meal.type)"
                  class="meal-checkbox"
                />
              </div>

              <div class="meal-items">
                <div *ngFor="let item of meal.items" class="meal-item">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-macros">
                    <span class="macro">{{ item.calories }} cal</span>
                    <span class="macro">P: {{ item.protein }}g</span>
                    <span class="macro">C: {{ item.carbs }}g</span>
                    <span class="macro">F: {{ item.fats }}g</span>
                  </div>
                </div>
              </div>

              <div class="meal-total">
                Total: {{ meal.total_calories }} calories
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !dailyMeals && !errorMessage" class="empty-state card">
          <p>No meal plan yet. Click the button above to generate your personalized plan!</p>
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

    .nutrition-card {
      margin-bottom: 24px;
    }

    .nutrition-card h3 {
      color: #1f2937;
      margin-bottom: 16px;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .nutrition-item {
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .nutrition-label {
      display: block;
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .nutrition-value {
      display: block;
      color: #667eea;
      font-size: 24px;
      font-weight: 700;
    }

    .meals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .meal-card {
      padding: 20px;
    }

    .meal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }

    .meal-header h3 {
      color: #667eea;
      margin: 0;
      font-size: 20px;
    }

    .meal-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .meal-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .meal-item {
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 3px solid #10b981;
    }

    .item-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .item-macros {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .macro {
      background: #e0e7ff;
      color: #4338ca;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .meal-total {
      text-align: right;
      color: #667eea;
      font-weight: 600;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }
  `]
})
export class MealsComponent implements OnInit {
  private mealService = inject(MealService);
  
  dailyMeals: DailyMeals | null = null;
  loading = false;
  errorMessage = '';
  hasMeals = false;

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {
    this.loading = true;
    this.errorMessage = '';

    this.mealService.getDailyMeals().subscribe({
      next: (response) => {
        this.dailyMeals = response.plan;
        this.hasMeals = true;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.hasMeals = false;
        } else {
          this.errorMessage = 'Failed to load meal plan';
        }
        this.loading = false;
      }
    });
  }

  generatePlan(): void {
    this.loading = true;
    this.errorMessage = '';

    this.mealService.generateMealPlan().subscribe({
      next: (response) => {
        this.dailyMeals = response.plan;
        this.hasMeals = true;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to generate meal plan';
        this.loading = false;
      }
    });
  }

  isMealCompleted(mealType: string): boolean {
    return this.dailyMeals?.completed_meals?.includes(mealType) || false;
  }

  toggleMeal(mealType: string): void {
    this.mealService.markMealComplete(mealType).subscribe({
      next: () => {
        this.loadMeals(); // Reload to get updated completion status
      },
      error: (error) => {
        console.error('Failed to update meal status', error);
      }
    });
  }

  getMealIcon(mealType: string): string {
    const icons: { [key: string]: string } = {
      'Breakfast': '🌅',
      'Lunch': '☀️',
      'Dinner': '🌙',
      'Snacks': '🍎'
    };
    return icons[mealType] || '🍽️';
  }
}
