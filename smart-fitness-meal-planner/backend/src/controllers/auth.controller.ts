import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import db from '../config/database';
import { User, UserResponse } from '../models/user.model';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { logger } from '../utils/logger.util';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, age, gender, height, weight, goal } = req.body;

      // Check if user exists
      const [existingUsers] = await db.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO users (email, password, name, age, gender, height, weight, goal, role) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user')`,
        [email, hashedPassword, name, age, gender, height, weight, goal]
      );

      const userId = result.insertId;

      // Generate tokens
      const accessToken = generateAccessToken({ userId, email, role: 'user' });
      const refreshToken = generateRefreshToken({ userId, email, role: 'user' });

      // Set cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      logger.info(`User registered: ${email}`);

      res.status(201).json({
        message: 'Registration successful',
        user: { id: userId, email, name, age, gender, height, weight, goal, role: 'user' },
        accessToken
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const [users] = await db.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0] as User;

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password!);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id!,
        email: user.email,
        role: user.role || 'user'
      });
      const refreshToken = generateRefreshToken({
        userId: user.id!,
        email: user.email,
        role: user.role || 'user'
      });

      // Set cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      logger.info(`User logged in: ${email}`);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          role: user.role
        },
        accessToken
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const [users] = await db.query<RowDataPacket[]>(
        'SELECT id, email, name, age, gender, height, weight, goal, role, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: users[0] });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
}
