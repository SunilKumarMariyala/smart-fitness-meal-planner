export interface WorkoutMealPlan {
  id?: number;
  user_id: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  exercises: any; // JSON
  meals: any; // JSON
  completed_status: any; // JSON
}
