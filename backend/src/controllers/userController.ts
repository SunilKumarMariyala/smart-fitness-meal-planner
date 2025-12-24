import { Request, Response } from 'express';
import { db } from '../config/db';
import { User } from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  const { name, age, gender, height, weight, goal } = req.body as User;

  if (!name || !age || !gender || !height || !weight || !goal) {
    return res.status(400).json({ message: 'All profile fields are required' });
  }

  if (!['weight loss', 'muscle gain', 'maintenance'].includes(goal)) {
    return res.status(400).json({ message: 'Invalid goal' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Users (name, age, gender, height, weight, goal) VALUES (?, ?, ?, ?, ?, ?)',
      [name, age, gender, height, weight, goal]
    );
    res.status(201).json({ id: (result as any).insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json((rows as any)[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, gender, height, weight, goal } = req.body as User;

  if (!name || !age || !gender || !height || !weight || !goal) {
    return res.status(400).json({ message: 'All profile fields are required' });
  }

  if (!['weight loss', 'muscle gain', 'maintenance'].includes(goal)) {
    return res.status(400).json({ message: 'Invalid goal' });
  }

  try {
    await db.query(
      'UPDATE Users SET name = ?, age = ?, gender = ?, height = ?, weight = ?, goal = ? WHERE id = ?',
      [name, age, gender, height, weight, goal, id]
    );
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
