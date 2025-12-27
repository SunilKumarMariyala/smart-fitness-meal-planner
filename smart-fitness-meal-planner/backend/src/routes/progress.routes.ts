import { Router, Request, Response } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const progressController = new ProgressController();

router.get('/', authMiddleware, (req: Request, res: Response) => progressController.getProgress(req, res));
router.post('/', authMiddleware, (req: Request, res: Response) => progressController.addProgress(req, res));
router.get('/charts', authMiddleware, (req: Request, res: Response) => progressController.getChartData(req, res));

export default router;
