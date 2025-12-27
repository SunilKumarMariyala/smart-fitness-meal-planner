import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './utils/logger.util';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import workoutRoutes from './routes/workout.routes';
import mealRoutes from './routes/meal.routes';
import progressRoutes from './routes/progress.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fitness Planner API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    logger.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    logger.info(`📊 API Health: http://localhost:${PORT}/api/health`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

export default app;
