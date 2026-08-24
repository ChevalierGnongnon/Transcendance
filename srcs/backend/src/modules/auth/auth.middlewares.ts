import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({
      error: 'Token missing or invalid',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
      return res.status(403).json({
        error: 'Unauthorized',
      });
    }

    req.jwtPayload = decoded;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      error: 'Invalid token',
    });
  }
};


export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
}

// export default requireAuth;
