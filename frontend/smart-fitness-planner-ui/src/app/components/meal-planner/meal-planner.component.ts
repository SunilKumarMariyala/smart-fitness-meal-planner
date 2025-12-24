import { Component, OnInit } from '@angular/core';
import { WorkoutMealPlanService } from '../../services/workout-meal-plan.service';
import { WorkoutMealPlan } from '../../models/WorkoutMealPlan';

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.scss']
})
export class MealPlannerComponent implements OnInit {
  mealPlans: WorkoutMealPlan[] = [];

  constructor(private workoutMealPlanService: WorkoutMealPlanService) { }

  ngOnInit(): void {
    // For simplicity, we'll assume a single user with ID 1.
    this.loadMealPlans(1);
  }

  loadMealPlans(userId: number): void {
    this.workoutMealPlanService.getWorkoutMealPlans(userId).subscribe(plans => {
      this.mealPlans = plans;
    });
  }

  getTotalCalories(plan: WorkoutMealPlan): number {
    let total = 0;
    for (const meal in plan.meals) {
      total += plan.meals[meal].calories;
    }
    return total;
  }
}
