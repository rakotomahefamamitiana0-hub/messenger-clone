import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type AuthenticatedRequest = Request & { user?: { id?: string; username?: string; email?: string } };

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const request = req as AuthenticatedRequest;
  const token = request.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { id?: string; username?: string; email?: string };
    request.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};

export default authMiddleware;