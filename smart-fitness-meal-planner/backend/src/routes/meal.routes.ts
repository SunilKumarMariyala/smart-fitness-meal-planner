import { Router, Request, Response } from 'express';
import { MealController } from '../controllers/meal.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const mealController = new MealController();

router.get('/daily', authMiddleware, (req: Request, res: Response) => mealController.getDailyMeals(req, res));
router.post('/generate', authMiddleware, (req: Request, res: Response) => mealController.generateMeals(req, res));
router.put('/complete', authMiddleware, (req: Request, res: Response) => mealController.markMealComplete(req, res));

export default router;
