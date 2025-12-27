import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface DayWorkout {
  day: string;
  exercises: Exercise[];
  completed_exercises?: string[];
}

export interface WeeklyWorkout {
  week_start_date: string;
  workouts: DayWorkout[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/workouts';

  generateWorkoutPlan(): Observable<{ message: string; plan: WeeklyWorkout }> {
    return this.http.post<{ message: string; plan: WeeklyWorkout }>(
      `${this.apiUrl}/generate`,
      {},
      { withCredentials: true }
    );
  }

  getWeeklyWorkout(date?: string): Observable<{ plan: WeeklyWorkout }> {
    const params = date ? { date } : {};
    return this.http.get<{ plan: WeeklyWorkout }>(
      `${this.apiUrl}/weekly`,
      { params, withCredentials: true }
    );
  }

  markExerciseComplete(day: string, exerciseName: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/complete`,
      { day, exercise_name: exerciseName },
      { withCredentials: true }
    );
  }

  getWorkoutHistory(): Observable<{ history: any[] }> {
    return this.http.get<{ history: any[] }>(
      `${this.apiUrl}/history`,
      { withCredentials: true }
    );
  }
}
