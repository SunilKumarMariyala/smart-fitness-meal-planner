import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AdminController {
  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const [users] = await db.query<RowDataPacket[]>(
        `SELECT id, email, name, age, gender, height, weight, goal, role, created_at, updated_at 
         FROM users 
         ORDER BY created_at DESC`
      );

      res.json({ users });
    } catch (error) {
      logger.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async getAnalytics(req: AuthRequest, res: Response) {
    try {
      // Total users
      const [totalUsers] = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM users'
      );

      // Users by goal
      const [usersByGoal] = await db.query<RowDataPacket[]>(
        'SELECT goal, COUNT(*) as count FROM users GROUP BY goal'
      );

      // Active users (logged progress in last 7 days)
      const [activeUsers] = await db.query<RowDataPacket[]>(
        `SELECT COUNT(DISTINCT user_id) as count 
         FROM workout_meal_plans 
         WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
      );

      // Total workout plans
      const [totalPlans] = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM workout_meal_plans'
      );

      res.json({
        totalUsers: totalUsers[0].count,
        usersByGoal,
        activeUsers: activeUsers[0].count,
        totalPlans: totalPlans[0].count
      });
    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { role, goal } = req.body;

      const updates: string[] = [];
      const values: any[] = [];

      if (role) {
        updates.push('role = ?');
        values.push(role);
      }
      if (goal) {
        updates.push('goal = ?');
        values.push(goal);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(userId);

      await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      logger.info(`User ${userId} updated by admin`);

      res.json({ message: 'User updated successfully' });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;

      await db.query('DELETE FROM users WHERE id = ?', [userId]);

      logger.info(`User ${userId} deleted by admin`);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}
