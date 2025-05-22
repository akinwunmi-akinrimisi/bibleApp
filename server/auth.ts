import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import bcrypt from 'bcrypt';

// Middleware to authenticate user from session
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      req.user = null;
      return next();
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      req.user = null;
      return next();
    }
    
    // Set user in request object, omitting password
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    req.user = null;
    next();
  }
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Password validation function
export async function validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password validation error:', error);
    return false;
  }
}

// Password hashing function
export async function generatePasswordHash(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email?: string;
      } | null;
    }
    
    interface Session {
      userId?: number;
    }
  }
}
