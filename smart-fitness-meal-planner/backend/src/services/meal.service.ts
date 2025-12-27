import { Meal } from '../models/plan.model';

export class MealService {
  generateDailyMeals(goal: string): { [key: string]: Meal[] } {
    const meals: { [key: string]: Meal[] } = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (goal === 'weight_loss') {
      days.forEach(day => {
        meals[day] = [
          {
            name: 'Oatmeal with Berries',
            type: 'breakfast',
            calories: 300,
            protein: 10,
            carbs: 50,
            fats: 8,
            description: 'Steel-cut oats with mixed berries and almonds'
          },
          {
            name: 'Grilled Chicken Salad',
            type: 'lunch',
            calories: 400,
            protein: 35,
            carbs: 30,
            fats: 15,
            description: 'Mixed greens with grilled chicken, vegetables, and light vinaigrette'
          },
          {
            name: 'Apple with Almond Butter',
            type: 'snack',
            calories: 200,
            protein: 5,
            carbs: 25,
            fats: 10,
            description: 'Sliced apple with 2 tbsp almond butter'
          },
          {
            name: 'Baked Salmon with Vegetables',
            type: 'dinner',
            calories: 450,
            protein: 40,
            carbs: 35,
            fats: 18,
            description: 'Baked salmon with steamed broccoli and sweet potato'
          }
        ];
      });
    } else if (goal === 'muscle_gain') {
      days.forEach(day => {
        meals[day] = [
          {
            name: 'Protein Pancakes',
            type: 'breakfast',
            calories: 500,
            protein: 35,
            carbs: 60,
            fats: 12,
            description: 'Whole grain pancakes with protein powder, eggs, and banana'
          },
          {
            name: 'Chicken Rice Bowl',
            type: 'lunch',
            calories: 650,
            protein: 45,
            carbs: 70,
            fats: 18,
            description: 'Grilled chicken with brown rice, black beans, and avocado'
          },
          {
            name: 'Protein Shake',
            type: 'snack',
            calories: 350,
            protein: 30,
            carbs: 40,
            fats: 8,
            description: 'Whey protein with banana, oats, and peanut butter'
          },
          {
            name: 'Steak with Quinoa',
            type: 'dinner',
            calories: 700,
            protein: 50,
            carbs: 65,
            fats: 22,
            description: 'Lean steak with quinoa and roasted vegetables'
          }
        ];
      });
    } else { // maintenance
      days.forEach(day => {
        meals[day] = [
          {
            name: 'Greek Yogurt Parfait',
            type: 'breakfast',
            calories: 350,
            protein: 20,
            carbs: 45,
            fats: 10,
            description: 'Greek yogurt with granola, honey, and fresh fruit'
          },
          {
            name: 'Turkey Sandwich',
            type: 'lunch',
            calories: 450,
            protein: 30,
            carbs: 50,
            fats: 15,
            description: 'Whole grain bread with turkey, vegetables, and hummus'
          },
          {
            name: 'Mixed Nuts',
            type: 'snack',
            calories: 200,
            protein: 8,
            carbs: 15,
            fats: 14,
            description: 'Handful of mixed nuts and dried fruit'
          },
          {
            name: 'Grilled Fish with Rice',
            type: 'dinner',
            calories: 500,
            protein: 35,
            carbs: 55,
            fats: 15,
            description: 'Grilled white fish with brown rice and steamed vegetables'
          }
        ];
      });
    }

    return meals;
  }

  calculateDailyCalories(meals: Meal[]): number {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  }

  calculateMacros(meals: Meal[]): { protein: number; carbs: number; fats: number } {
    return meals.reduce(
      (totals, meal) => ({
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fats: totals.fats + meal.fats
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );
  }
}
