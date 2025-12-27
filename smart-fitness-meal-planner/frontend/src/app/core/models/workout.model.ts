export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  instructions: string;
}

export interface WorkoutPlan {
  id: number;
  user_id: number;
  week_start_date: string;
  day: string;
  exercises: Exercise[];
  completed_exercises: string[];
  weight_log?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
