export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface MealPlan {
  id: number;
  date: string;
  day: string;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  completedMeals: string[];
  planId: number;
}
