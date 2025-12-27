import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { updateProfileValidator } from '../validators/user.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/profile', authMiddleware, (req: Request, res: Response) => userController.getProfile(req, res));
router.put('/profile', authMiddleware, updateProfileValidator, (req: Request, res: Response) => userController.updateProfile(req, res));
router.put('/password', authMiddleware, (req: Request, res: Response) => userController.changePassword(req, res));

export default router;
