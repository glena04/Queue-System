// filepath: src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define middleware as an Express RequestHandler to fix TypeScript errors
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return; // Return void instead of the response
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded; // Now TypeScript recognizes 'user'
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return; // Return void instead of the response
  }
};