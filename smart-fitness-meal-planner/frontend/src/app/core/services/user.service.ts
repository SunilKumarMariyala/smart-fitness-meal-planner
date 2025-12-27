import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/users';

  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(
      `${this.apiUrl}/profile`,
      { withCredentials: true }
    );
  }

  updateProfile(data: Partial<User>): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(
      `${this.apiUrl}/profile`,
      data,
      { withCredentials: true }
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/password`,
      { current_password: currentPassword, new_password: newPassword },
      { withCredentials: true }
    );
  }
}
