import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { ProgressService, ProgressEntry } from '@core/services/progress.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, ReactiveFormsModule],
  template: `
    <app-layout>
      <div class="container">
        <div class="card header-card">
          <h1>📊 Track Your Progress</h1>
          <p>Monitor your weight and fitness journey</p>
        </div>

        <!-- Log Weight Form -->
        <div class="card log-card">
          <h3>📝 Log Today's Weight</h3>
          <form [formGroup]="weightForm" (ngSubmit)="logWeight()" class="weight-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Weight (kg)*</label>
                <input 
                  type="number" 
                  formControlName="weight" 
                  class="form-control"
                  placeholder="Enter weight"
                  step="0.1"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Notes (optional)</label>
                <input 
                  type="text" 
                  formControlName="notes" 
                  class="form-control"
                  placeholder="How do you feel?"
                />
              </div>
            </div>
            <button type="submit" class="btn-primary" [disabled]="weightForm.invalid || loading">
              {{ loading ? 'Saving...' : 'Log Weight' }}
            </button>
          </form>

          <div *ngIf="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Progress History -->
        <div class="card history-card">
          <h3>📈 Weight History</h3>
          
          <div *ngIf="loadingHistory" class="loading-state">
            <div class="spinner"></div>
            <p>Loading your progress...</p>
          </div>

          <div *ngIf="!loadingHistory && progressHistory.length > 0" class="history-list">
            <div *ngFor="let entry of progressHistory" class="history-item">
              <div class="history-date">
                {{ formatDate(entry.date) }}
              </div>
              <div class="history-weight">
                {{ entry.weight }} kg
              </div>
              <div *ngIf="entry.notes" class="history-notes">
                {{ entry.notes }}
              </div>
            </div>
          </div>

          <div *ngIf="!loadingHistory && progressHistory.length === 0" class="empty-state">
            <p>No progress entries yet. Start logging your weight above!</p>
          </div>
        </div>

        <!-- Progress Chart Placeholder -->
        <div class="card chart-card">
          <h3>📉 Weight Trend</h3>
          <div class="chart-placeholder">
            <p>📊 Chart visualization coming soon with Chart.js integration</p>
            <p class="chart-note">Your weight trend will be displayed here once you have multiple entries</p>
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

    .log-card {
      margin-bottom: 24px;
    }

    .log-card h3 {
      color: #1f2937;
      margin-bottom: 20px;
    }

    .weight-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .success-message {
      background: #d1fae5;
      color: #065f46;
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
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

    .history-card {
      margin-bottom: 24px;
    }

    .history-card h3 {
      color: #1f2937;
      margin-bottom: 20px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
    }

    .history-item {
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 3px solid #10b981;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 16px;
      align-items: center;
    }

    .history-date {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }

    .history-weight {
      color: #667eea;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
    }

    .history-notes {
      color: #6b7280;
      font-style: italic;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }

    .chart-card h3 {
      color: #1f2937;
      margin-bottom: 20px;
    }

    .chart-placeholder {
      text-align: center;
      padding: 60px 20px;
      background: #f9fafb;
      border-radius: 8px;
      border: 2px dashed #d1d5db;
    }

    .chart-placeholder p {
      color: #6b7280;
      margin-bottom: 8px;
    }

    .chart-note {
      font-size: 14px;
      font-style: italic;
    }
  `]
})
export class ProgressComponent implements OnInit {
  private fb = inject(FormBuilder);
  private progressService = inject(ProgressService);
  
  weightForm: FormGroup;
  progressHistory: ProgressEntry[] = [];
  loading = false;
  loadingHistory = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.weightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(20), Validators.max(500)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loadingHistory = true;

    this.progressService.getProgress().subscribe({
      next: (response) => {
        this.progressHistory = response.progress.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loadingHistory = false;
      },
      error: (error) => {
        console.error('Failed to load progress history', error);
        this.loadingHistory = false;
      }
    });
  }

  logWeight(): void {
    if (this.weightForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { weight, notes } = this.weightForm.value;

    this.progressService.logWeight(weight, notes).subscribe({
      next: () => {
        this.successMessage = 'Weight logged successfully!';
        this.weightForm.reset();
        this.loadHistory();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to log weight';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}
