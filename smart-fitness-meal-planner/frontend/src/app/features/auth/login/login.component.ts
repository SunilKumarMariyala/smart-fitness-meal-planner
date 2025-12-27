import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to continue your fitness journey</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              formControlName="email" 
              class="form-control"
              placeholder="Enter your email"
            />
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Valid email is required
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              formControlName="password" 
              class="form-control"
              placeholder="Enter your password"
            />
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary btn-full" [disabled]="loading">
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading" class="loading-spinner"></span>
          </button>

          <p class="auth-link">
            Don't have an account? <a routerLink="/register">Create Account</a>
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
      max-width: 450px;
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.error || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
