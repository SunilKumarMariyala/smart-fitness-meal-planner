import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { WorkoutsComponent } from './features/workouts/workouts.component';
import { MealsComponent } from './features/meals/meals.component';
import { ProgressComponent } from './features/progress/progress.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'workouts', component: WorkoutsComponent, canActivate: [authGuard] },
  { path: 'meals', component: MealsComponent, canActivate: [authGuard] },
  { path: 'progress', component: ProgressComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
