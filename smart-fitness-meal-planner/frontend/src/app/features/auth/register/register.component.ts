import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Create Your Account</h1>
        <p class="auth-subtitle">Start your fitness transformation today</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name*</label>
            <input type="text" formControlName="name" class="form-control" placeholder="Enter your name" />
          </div>

          <div class="form-group">
            <label class="form-label">Email*</label>
            <input type="email" formControlName="email" class="form-control" placeholder="Enter your email" />
          </div>

          <div class="form-group">
            <label class="form-label">Password*</label>
            <input type="password" formControlName="password" class="form-control" placeholder="Min 8 characters" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Age*</label>
              <input type="number" formControlName="age" class="form-control" placeholder="Age" />
            </div>

            <div class="form-group">
              <label class="form-label">Gender*</label>
              <select formControlName="gender" class="form-control">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Height (cm)*</label>
              <input type="number" formControlName="height" class="form-control" placeholder="Height" />
            </div>

            <div class="form-group">
              <label class="form-label">Weight (kg)*</label>
              <input type="number" formControlName="weight" class="form-control" placeholder="Weight" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fitness Goal*</label>
            <select formControlName="goal" class="form-control">
              <option value="">Select your goal</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary btn-full" [disabled]="loading">
            <span *ngIf="!loading">Register</span>
            <span *ngIf="loading" class="loading-spinner"></span>
          </button>

          <p class="auth-link">
            Already have an account? <a routerLink="/login">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 48px;
      max-width: 550px;
      width: 100%;
    }

    .auth-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
      text-align: center;
    }

    .auth-subtitle {
      color: #6b7280;
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-form {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .btn-full {
      width: 100%;
      margin-top: 8px;
    }

    .auth-link {
      text-align: center;
      margin-top: 24px;
      color: #6b7280;
    }

    .auth-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(500)]],
      goal: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
