import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProgressEntry {
  date: string;
  weight: number;
  notes?: string;
}

export interface ChartData {
  labels: string[];
  weights: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/progress';

  getProgress(): Observable<{ progress: ProgressEntry[] }> {
    return this.http.get<{ progress: ProgressEntry[] }>(
      this.apiUrl,
      { withCredentials: true }
    );
  }

  logWeight(weight: number, notes?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiUrl,
      { weight, notes },
      { withCredentials: true }
    );
  }

  getChartData(): Observable<{ data: ChartData }> {
    return this.http.get<{ data: ChartData }>(
      `${this.apiUrl}/charts`,
      { withCredentials: true }
    );
  }
}
