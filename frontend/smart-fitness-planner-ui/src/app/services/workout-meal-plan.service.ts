import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkoutMealPlan } from '../models/WorkoutMealPlan';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutMealPlanService {
  private plansUrl: string;

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.plansUrl = `${this.apiService.apiUrl}/plans`;
  }

  createWorkoutMealPlan(plan: WorkoutMealPlan): Observable<WorkoutMealPlan> {
    return this.http.post<WorkoutMealPlan>(this.plansUrl, plan);
  }

  getWorkoutMealPlans(userId: number): Observable<WorkoutMealPlan[]> {
    return this.http.get<WorkoutMealPlan[]>(`${this.plansUrl}/${userId}`);
  }

  updateWorkoutMealPlan(id: number, plan: WorkoutMealPlan): Observable<WorkoutMealPlan> {
    return this.http.put<WorkoutMealPlan>(`${this.plansUrl}/${id}`, plan);
  }
}
