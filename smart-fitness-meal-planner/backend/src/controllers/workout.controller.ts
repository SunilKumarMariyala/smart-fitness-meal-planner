import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { WorkoutService } from '../services/workout.service';
import { logger } from '../utils/logger.util';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const workoutService = new WorkoutService();

export class WorkoutController {
  async getWeeklyWorkout(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const weekStart = req.query.weekStart as string || this.getCurrentWeekStart();

      const [plans] = await db.query<RowDataPacket[]>(
        `SELECT * FROM workout_meal_plans 
         WHERE user_id = ? AND week_start_date = ? 
         ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`,
        [userId, weekStart]
      );

      if (plans.length === 0) {
        return res.status(404).json({ error: 'No workout plan found for this week' });
      }

      res.json({ workouts: plans });
    } catch (error) {
      logger.error('Get weekly workout error:', error);
      res.status(500).json({ error: 'Failed to fetch workout plan' });
    }
  }

  async generateWorkout(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      // Get user's goal
      const [users] = await db.query<RowDataPacket[]>(
        'SELECT goal FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const goal = users[0].goal;
      const weekStart = this.getCurrentWeekStart();

      // Check if plan already exists for this week
      const [existing] = await db.query<RowDataPacket[]>(
        'SELECT id FROM workout_meal_plans WHERE user_id = ? AND week_start_date = ?',
        [userId, weekStart]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Workout plan already exists for this week' });
      }

      // Generate workouts
      const weeklyWorkouts = workoutService.generateWeeklyWorkout(goal);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      // Insert workout plans (we'll add meals in meal controller)
      for (const day of days) {
        await db.query(
          `INSERT INTO workout_meal_plans (user_id, week_start_date, day, exercises, meals, completed_exercises, completed_meals) 
           VALUES (?, ?, ?, ?, '[]', '[]', '[]')`,
          [userId, weekStart, day, JSON.stringify(weeklyWorkouts[day])]
        );
      }

      logger.info(`Workout plan generated for user: ${userId}`);

      res.status(201).json({
        message: 'Workout plan generated successfully',
        weekStart
      });
    } catch (error) {
      logger.error('Generate workout error:', error);
      res.status(500).json({ error: 'Failed to generate workout plan' });
    }
  }

  async markExerciseComplete(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { planId, exerciseName } = req.body;

      if (!planId || !exerciseName) {
        return res.status(400).json({ error: 'Plan ID and exercise name required' });
      }

      const [plans] = await db.query<RowDataPacket[]>(
        'SELECT completed_exercises FROM workout_meal_plans WHERE id = ? AND user_id = ?',
        [planId, userId]
      );

      if (plans.length === 0) {
        return res.status(404).json({ error: 'Workout plan not found' });
      }

      const completedExercises = JSON.parse(plans[0].completed_exercises || '[]');
      
      if (!completedExercises.includes(exerciseName)) {
        completedExercises.push(exerciseName);
      }

      await db.query(
        'UPDATE workout_meal_plans SET completed_exercises = ? WHERE id = ?',
        [JSON.stringify(completedExercises), planId]
      );

      res.json({ message: 'Exercise marked as complete', completedExercises });
    } catch (error) {
      logger.error('Mark exercise complete error:', error);
      res.status(500).json({ error: 'Failed to mark exercise as complete' });
    }
  }

  async getWorkoutHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 30;

      const [history] = await db.query<RowDataPacket[]>(
        `SELECT week_start_date, day, exercises, completed_exercises, created_at 
         FROM workout_meal_plans 
         WHERE user_id = ? 
         ORDER BY week_start_date DESC, FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
         LIMIT ?`,
        [userId, limit]
      );

      res.json({ history });
    } catch (error) {
      logger.error('Get workout history error:', error);
      res.status(500).json({ error: 'Failed to fetch workout history' });
    }
  }

  private getCurrentWeekStart(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  }
}
