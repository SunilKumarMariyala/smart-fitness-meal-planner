export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  instructions: string;
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface WorkoutMealPlan {
  id?: number;
  user_id: number;
  week_start_date: Date;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  exercises: Exercise[];
  meals: Meal[];
  completed_exercises: string[];
  completed_meals: string[];
  weight_log?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}
