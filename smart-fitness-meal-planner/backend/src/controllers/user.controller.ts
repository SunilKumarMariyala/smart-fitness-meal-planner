import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import db from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger.util';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const [users] = await db.query<RowDataPacket[]>(
        'SELECT id, email, name, age, gender, height, weight, goal, role, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ profile: users[0] });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user!.userId;
      const { name, age, gender, height, weight, goal } = req.body;

      const updates: string[] = [];
      const values: any[] = [];

      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (age !== undefined) {
        updates.push('age = ?');
        values.push(age);
      }
      if (gender !== undefined) {
        updates.push('gender = ?');
        values.push(gender);
      }
      if (height !== undefined) {
        updates.push('height = ?');
        values.push(height);
      }
      if (weight !== undefined) {
        updates.push('weight = ?');
        values.push(weight);
      }
      if (goal !== undefined) {
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

      logger.info(`Profile updated for user: ${userId}`);

      const [updatedUsers] = await db.query<RowDataPacket[]>(
        'SELECT id, email, name, age, gender, height, weight, goal, role FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        message: 'Profile updated successfully',
        profile: updatedUsers[0]
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
      }

      // Get current password
      const [users] = await db.query<RowDataPacket[]>(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      logger.info(`Password changed for user: ${userId}`);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
}
