import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error occurred:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
