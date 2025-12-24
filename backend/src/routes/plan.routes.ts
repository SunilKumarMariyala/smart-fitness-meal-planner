import { Router } from 'express';
import { createWorkoutMealPlan, getWorkoutMealPlans, updateWorkoutMealPlan } from '../controllers/workoutMealPlanController';

const router = Router();

router.post('/plans', createWorkoutMealPlan);
router.get('/plans/:userId', getWorkoutMealPlans);
router.put('/plans/:id', updateWorkoutMealPlan);

export default router;
