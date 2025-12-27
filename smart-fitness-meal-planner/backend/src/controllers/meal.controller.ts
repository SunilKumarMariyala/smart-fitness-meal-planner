import { Response } from 'express';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { MealService } from '../services/meal.service';
import { logger } from '../utils/logger.util';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const mealService = new MealService();

export class MealController {
  async getDailyMeals(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const dayName = this.getDayName(new Date(date));

      const weekStart = this.getWeekStart(new Date(date));

      const [plans] = await db.query<RowDataPacket[]>(
        'SELECT * FROM workout_meal_plans WHERE user_id = ? AND week_start_date = ? AND day = ?',
        [userId, weekStart, dayName]
      );

      if (plans.length === 0) {
        return res.status(404).json({ error: 'No meal plan found for this date' });
      }

      const meals = JSON.parse(plans[0].meals);
      const totalCalories = mealService.calculateDailyCalories(meals);
      const macros = mealService.calculateMacros(meals);

      res.json({
        date,
        day: dayName,
        meals,
        totalCalories,
        macros,
        completedMeals: JSON.parse(plans[0].completed_meals || '[]'),
        planId: plans[0].id
      });
    } catch (error) {
      logger.error('Get daily meals error:', error);
      res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
  }

  async generateMeals(req: AuthRequest, res: Response) {
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

      // Generate meals
      const weeklyMeals = mealService.generateDailyMeals(goal);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      // Update existing plans or create new ones
      for (const day of days) {
        const [existing] = await db.query<RowDataPacket[]>(
          'SELECT id FROM workout_meal_plans WHERE user_id = ? AND week_start_date = ? AND day = ?',
          [userId, weekStart, day]
        );

        if (existing.length > 0) {
          // Update existing
          await db.query(
            'UPDATE workout_meal_plans SET meals = ? WHERE id = ?',
            [JSON.stringify(weeklyMeals[day]), existing[0].id]
          );
        } else {
          // Create new
          await db.query(
            `INSERT INTO workout_meal_plans (user_id, week_start_date, day, exercises, meals, completed_exercises, completed_meals) 
             VALUES (?, ?, ?, '[]', ?, '[]', '[]')`,
            [userId, weekStart, day, JSON.stringify(weeklyMeals[day])]
          );
        }
      }

      logger.info(`Meal plan generated for user: ${userId}`);

      res.status(201).json({
        message: 'Meal plan generated successfully',
        weekStart
      });
    } catch (error) {
      logger.error('Generate meals error:', error);
      res.status(500).json({ error: 'Failed to generate meal plan' });
    }
  }

  async markMealComplete(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { planId, mealName } = req.body;

      if (!planId || !mealName) {
        return res.status(400).json({ error: 'Plan ID and meal name required' });
      }

      const [plans] = await db.query<RowDataPacket[]>(
        'SELECT completed_meals FROM workout_meal_plans WHERE id = ? AND user_id = ?',
        [planId, userId]
      );

      if (plans.length === 0) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }

      const completedMeals = JSON.parse(plans[0].completed_meals || '[]');
      
      if (!completedMeals.includes(mealName)) {
        completedMeals.push(mealName);
      }

      await db.query(
        'UPDATE workout_meal_plans SET completed_meals = ? WHERE id = ?',
        [JSON.stringify(completedMeals), planId]
      );

      res.json({ message: 'Meal marked as complete', completedMeals });
    } catch (error) {
      logger.error('Mark meal complete error:', error);
      res.status(500).json({ error: 'Failed to mark meal as complete' });
    }
  }

  private getCurrentWeekStart(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  private getWeekStart(date: Date): string {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  private getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
}
