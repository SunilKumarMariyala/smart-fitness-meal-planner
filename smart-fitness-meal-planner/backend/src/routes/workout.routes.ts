import { Router, Request, Response } from 'express';
import { WorkoutController } from '../controllers/workout.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const workoutController = new WorkoutController();

router.get('/weekly', authMiddleware, (req: Request, res: Response) => workoutController.getWeeklyWorkout(req, res));
router.post('/generate', authMiddleware, (req: Request, res: Response) => workoutController.generateWorkout(req, res));
router.put('/complete', authMiddleware, (req: Request, res: Response) => workoutController.markExerciseComplete(req, res));
router.get('/history', authMiddleware, (req: Request, res: Response) => workoutController.getWorkoutHistory(req, res));

export default router;
