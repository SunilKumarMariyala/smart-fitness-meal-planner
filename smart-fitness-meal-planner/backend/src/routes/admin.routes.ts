import { Router, Request, Response } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin/trainer role
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'trainer']));

router.get('/users', (req: Request, res: Response) => adminController.getAllUsers(req, res));
router.get('/analytics', (req: Request, res: Response) => adminController.getAnalytics(req, res));
router.put('/users/:userId', (req: Request, res: Response) => adminController.updateUser(req, res));
router.delete('/users/:userId', (req: Request, res: Response) => adminController.deleteUser(req, res));

export default router;
