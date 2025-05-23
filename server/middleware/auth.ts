import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export interface AuthenticatedRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    username: string;
    email?: string;
    subscriptionTier?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export function generateJWT(userId: number, email: string): string {
  return jwt.sign(
    { userId, email, iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function jwtAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: { code: 401, message: 'No token provided' } 
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);
    
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: { code: 401, message: 'User not found' } 
      });
    }
    
    req.userId = user.id;
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      subscriptionTier: user.subscriptionTier
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: { code: 401, message: 'Invalid token' } 
    });
  }
}