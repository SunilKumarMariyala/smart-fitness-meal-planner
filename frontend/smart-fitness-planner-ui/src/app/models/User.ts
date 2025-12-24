export interface User {
  id?: number;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: 'weight loss' | 'muscle gain' | 'maintenance';
}
