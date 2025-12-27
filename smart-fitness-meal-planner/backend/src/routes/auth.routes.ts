import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/user.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', registerValidator, (req: Request, res: Response) => authController.register(req, res));
router.post('/login', loginValidator, (req: Request, res: Response) => authController.login(req, res));
router.post('/logout', (req: Request, res: Response) => authController.logout(req, res));
router.get('/me', authMiddleware, (req: Request, res: Response) => authController.getMe(req, res));

export default router;
