import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';


export const requireAuth = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);

  } catch (error) {
      return res.status(401).json({error: 'INVALID_TOKEN',});
  }

  if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }

  let user;
  try{
    user = await prisma.user.findUnique({
      where: {
        id:decoded.userId
      },
      select: {
        id:true
      }
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }

  if (!user)
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  req.jwtPayload = decoded;
  req.userId = decoded.userId;

  next();
};

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : undefined,
      code: error.msg,
    }));

    return res.status(400).json({
      error: details[0].code,
      details,
    });
  }

  next();
}

//Only for files since we can download (default_avatar) files when register, don't use it anywhere else then in this situation
export function attachUserIfPresent(req: Request, res: Response, next:NextFunction){
  const token = req.cookies.token;

  if (!token || typeof token !== 'string') {
    return (next());
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return (next());
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
      return (next());
    }

    req.jwtPayload = decoded;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(error);
    return (next());
  }
}

