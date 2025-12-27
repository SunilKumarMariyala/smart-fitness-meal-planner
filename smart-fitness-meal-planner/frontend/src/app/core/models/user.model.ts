export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  role: 'user' | 'trainer' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}
