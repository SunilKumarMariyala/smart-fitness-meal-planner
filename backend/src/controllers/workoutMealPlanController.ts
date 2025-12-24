import { Request, Response } from 'express';
import { db } from '../config/db';
import { WorkoutMealPlan } from '../models/WorkoutMealPlan';

export const createWorkoutMealPlan = async (req: Request, res: Response) => {
  const { user_id, day, exercises, meals, completed_status } = req.body as WorkoutMealPlan;

  if (!user_id || !day || !exercises || !meals) {
    return res.status(400).json({ message: 'User ID, day, exercises, and meals are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO WorkoutMealPlans (user_id, day, exercises, meals, completed_status) VALUES (?, ?, ?, ?, ?)',
      [user_id, day, JSON.stringify(exercises), JSON.stringify(meals), JSON.stringify(completed_status || {})]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout/meal plan', error });
  }
};

export const getWorkoutMealPlans = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM WorkoutMealPlans WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout/meal plans', error });
  }
};

export const updateWorkoutMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { exercises, meals, completed_status } = req.body as WorkoutMealPlan;

  if (!exercises || !meals) {
    return res.status(400).json({ message: 'Exercises and meals are required' });
  }

  try {
    await db.query(
      'UPDATE WorkoutMealPlans SET exercises = ?, meals = ?, completed_status = ? WHERE id = ?',
      [JSON.stringify(exercises), JSON.stringify(meals), JSON.stringify(completed_status || {}), id]
    );
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout/meal plan', error });
  }
};
