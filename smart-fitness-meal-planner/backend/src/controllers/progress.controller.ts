import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';
import { RowDataPacket } from 'mysql2';

export class ProgressController {
  async getProgress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 30;

      const [weightLogs] = await db.query<RowDataPacket[]>(
        `SELECT week_start_date, day, weight_log, created_at 
         FROM workout_meal_plans 
         WHERE user_id = ? AND weight_log IS NOT NULL 
         ORDER BY week_start_date DESC, created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );

      res.json({ progress: weightLogs });
    } catch (error) {
      logger.error('Get progress error:', error);
      res.status(500).json({ error: 'Failed to fetch progress data' });
    }
  }

  async addProgress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { planId, weight, notes } = req.body;

      if (!planId || !weight) {
        return res.status(400).json({ error: 'Plan ID and weight required' });
      }

      const [plans] = await db.query<RowDataPacket[]>(
        'SELECT id FROM workout_meal_plans WHERE id = ? AND user_id = ?',
        [planId, userId]
      );

      if (plans.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      await db.query(
        'UPDATE workout_meal_plans SET weight_log = ?, notes = ? WHERE id = ?',
        [weight, notes || null, planId]
      );

      // Also update user's current weight
      await db.query(
        'UPDATE users SET weight = ? WHERE id = ?',
        [weight, userId]
      );

      logger.info(`Progress logged for user: ${userId}`);

      res.json({ message: 'Progress logged successfully' });
    } catch (error) {
      logger.error('Add progress error:', error);
      res.status(500).json({ error: 'Failed to log progress' });
    }
  }

  async getChartData(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const days = parseInt(req.query.days as string) || 30;

      // Get weight progress
      const [weightData] = await db.query<RowDataPacket[]>(
        `SELECT week_start_date, day, weight_log, created_at 
         FROM workout_meal_plans 
         WHERE user_id = ? AND weight_log IS NOT NULL 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, days]
      );

      // Get workout completion stats
      const [workoutStats] = await db.query<RowDataPacket[]>(
        `SELECT 
          COUNT(*) as total_workouts,
          SUM(JSON_LENGTH(completed_exercises)) as completed_exercises_count
         FROM workout_meal_plans 
         WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [userId, days]
      );

      // Get meal adherence stats
      const [mealStats] = await db.query<RowDataPacket[]>(
        `SELECT 
          COUNT(*) as total_days,
          SUM(JSON_LENGTH(completed_meals)) as completed_meals_count
         FROM workout_meal_plans 
         WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [userId, days]
      );

      res.json({
        weightProgress: weightData.reverse(),
        workoutStats: workoutStats[0],
        mealStats: mealStats[0]
      });
    } catch (error) {
      logger.error('Get chart data error:', error);
      res.status(500).json({ error: 'Failed to fetch chart data' });
    }
  }
}
