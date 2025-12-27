import { Exercise } from '../models/plan.model';

export class WorkoutService {
  generateWeeklyWorkout(goal: string): { [key: string]: Exercise[] } {
    const workouts: { [key: string]: Exercise[] } = {};

    if (goal === 'weight_loss') {
      workouts['Monday'] = [
        { name: 'Running', sets: 1, reps: '30 min', duration: '30 min', instructions: 'Moderate pace cardio' },
        { name: 'Jumping Jacks', sets: 3, reps: '20', instructions: 'Full body warm-up exercise' },
        { name: 'Burpees', sets: 3, reps: '15', instructions: 'High-intensity full body exercise' }
      ];
      workouts['Tuesday'] = [
        { name: 'Cycling', sets: 1, reps: '45 min', duration: '45 min', instructions: 'Steady state cardio' },
        { name: 'Mountain Climbers', sets: 3, reps: '20', instructions: 'Core and cardio exercise' }
      ];
      workouts['Wednesday'] = [
        { name: 'Swimming', sets: 1, reps: '30 min', duration: '30 min', instructions: 'Low impact full body workout' },
        { name: 'Plank', sets: 3, reps: '60 sec', instructions: 'Hold plank position' }
      ];
      workouts['Thursday'] = [
        { name: 'HIIT Training', sets: 4, reps: '5 min', instructions: '30 sec work, 30 sec rest intervals' },
        { name: 'Jump Rope', sets: 3, reps: '2 min', instructions: 'Cardio exercise' }
      ];
      workouts['Friday'] = [
        { name: 'Brisk Walking', sets: 1, reps: '45 min', duration: '45 min', instructions: 'Active recovery' },
        { name: 'Bodyweight Squats', sets: 3, reps: '20', instructions: 'Lower body exercise' }
      ];
      workouts['Saturday'] = [
        { name: 'Rowing', sets: 1, reps: '30 min', duration: '30 min', instructions: 'Full body cardio' },
        { name: 'Lunges', sets: 3, reps: '15 each leg', instructions: 'Lower body strength' }
      ];
      workouts['Sunday'] = [
        { name: 'Yoga', sets: 1, reps: '30 min', duration: '30 min', instructions: 'Flexibility and recovery' }
      ];
    } else if (goal === 'muscle_gain') {
      workouts['Monday'] = [
        { name: 'Bench Press', sets: 4, reps: '8-10', instructions: 'Chest exercise with barbell' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', instructions: 'Upper chest focus' },
        { name: 'Tricep Dips', sets: 3, reps: '12', instructions: 'Tricep strength builder' }
      ];
      workouts['Tuesday'] = [
        { name: 'Deadlifts', sets: 4, reps: '6-8', instructions: 'Full body compound movement' },
        { name: 'Barbell Rows', sets: 4, reps: '8-10', instructions: 'Back thickness exercise' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', instructions: 'Back width exercise' }
      ];
      workouts['Wednesday'] = [
        { name: 'Rest Day', sets: 0, reps: 'N/A', instructions: 'Active recovery - light stretching' }
      ];
      workouts['Thursday'] = [
        { name: 'Squats', sets: 4, reps: '8-10', instructions: 'Leg compound movement' },
        { name: 'Leg Press', sets: 3, reps: '10-12', instructions: 'Quad and glute builder' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', instructions: 'Hamstring isolation' }
      ];
      workouts['Friday'] = [
        { name: 'Overhead Press', sets: 4, reps: '8-10', instructions: 'Shoulder compound exercise' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', instructions: 'Side delt isolation' },
        { name: 'Bicep Curls', sets: 3, reps: '10-12', instructions: 'Bicep builder' }
      ];
      workouts['Saturday'] = [
        { name: 'Cardio', sets: 1, reps: '20 min', duration: '20 min', instructions: 'Light cardio for recovery' }
      ];
      workouts['Sunday'] = [
        { name: 'Rest Day', sets: 0, reps: 'N/A', instructions: 'Complete rest and recovery' }
      ];
    } else { // maintenance
      workouts['Monday'] = [
        { name: 'Full Body Workout', sets: 3, reps: '12', instructions: 'Compound movements' },
        { name: 'Push-ups', sets: 3, reps: '15', instructions: 'Upper body strength' },
        { name: 'Squats', sets: 3, reps: '15', instructions: 'Lower body strength' }
      ];
      workouts['Tuesday'] = [
        { name: 'Cardio', sets: 1, reps: '30 min', duration: '30 min', instructions: 'Moderate intensity' }
      ];
      workouts['Wednesday'] = [
        { name: 'Yoga/Pilates', sets: 1, reps: '45 min', duration: '45 min', instructions: 'Flexibility and core' }
      ];
      workouts['Thursday'] = [
        { name: 'Circuit Training', sets: 3, reps: '10 exercises', instructions: 'Full body circuit' },
        { name: 'Plank', sets: 3, reps: '60 sec', instructions: 'Core stability' }
      ];
      workouts['Friday'] = [
        { name: 'Swimming/Cycling', sets: 1, reps: '30 min', duration: '30 min', instructions: 'Low impact cardio' }
      ];
      workouts['Saturday'] = [
        { name: 'Active Recreation', sets: 1, reps: '60 min', duration: '60 min', instructions: 'Sports or outdoor activity' }
      ];
      workouts['Sunday'] = [
        { name: 'Rest/Stretching', sets: 1, reps: '20 min', duration: '20 min', instructions: 'Recovery and flexibility' }
      ];
    }

    return workouts;
  }
}
