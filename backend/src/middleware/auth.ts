import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: {
        message: 'Access token is required',
        status: 401,
        code: 'MISSING_TOKEN'
      }
    });
    return;
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    res.status(403).json({
      error: {
        message: 'Invalid or expired token',
        status: 403,
        code: 'INVALID_TOKEN'
      }
    });
    return;
  }

  req.user = decoded;
  next();
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

export const requireRole = (requiredRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          status: 401,
          code: 'AUTH_REQUIRED'
        }
      });
      return;
    }

    // TODO: Implement role checking logic with database lookup
    // For now, allow all authenticated users
    next();
  };
};