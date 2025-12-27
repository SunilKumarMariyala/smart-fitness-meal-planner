import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  type: string;
  items: MealItem[];
  total_calories: number;
}

export interface DailyMeals {
  date: string;
  meals: Meal[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  completed_meals?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/meals';

  generateMealPlan(): Observable<{ message: string; plan: DailyMeals }> {
    return this.http.post<{ message: string; plan: DailyMeals }>(
      `${this.apiUrl}/generate`,
      {},
      { withCredentials: true }
    );
  }

  getDailyMeals(date?: string): Observable<{ plan: DailyMeals }> {
    const params = date ? { date } : {};
    return this.http.get<{ plan: DailyMeals }>(
      `${this.apiUrl}/daily`,
      { params, withCredentials: true }
    );
  }

  markMealComplete(mealType: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/complete`,
      { meal_type: mealType },
      { withCredentials: true }
    );
  }
}
