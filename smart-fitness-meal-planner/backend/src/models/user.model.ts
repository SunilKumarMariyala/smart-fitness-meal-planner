export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  role?: 'user' | 'trainer' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
