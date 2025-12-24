import { Component, OnInit } from '@angular/core';
import { WorkoutMealPlanService } from '../../services/workout-meal-plan.service';
import { WorkoutMealPlan } from '../../models/WorkoutMealPlan';

@Component({
  selector: 'app-workout-routine',
  templateUrl: './workout-routine.component.html',
  styleUrls: ['./workout-routine.component.scss']
})
export class WorkoutRoutineComponent implements OnInit {
  workoutPlans: WorkoutMealPlan[] = [];

  constructor(private workoutMealPlanService: WorkoutMealPlanService) { }

  ngOnInit(): void {
    // For simplicity, we'll assume a single user with ID 1.
    this.loadWorkoutPlans(1);
  }

  loadWorkoutPlans(userId: number): void {
    this.workoutMealPlanService.getWorkoutMealPlans(userId).subscribe(plans => {
      this.workoutPlans = plans;
    });
  }
}
