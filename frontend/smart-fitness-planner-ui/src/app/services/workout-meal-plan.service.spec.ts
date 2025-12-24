import { TestBed } from '@angular/core/testing';

import { WorkoutMealPlanService } from './workout-meal-plan.service';

describe('WorkoutMealPlanService', () => {
  let service: WorkoutMealPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutMealPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
