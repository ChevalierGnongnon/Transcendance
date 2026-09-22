import type { Request, Response, NextFunction } from 'express';
import rateLimiter from 'express-rate-limit';
import { validationResult } from 'express-validator';

export function RateLimiter(time: number, trys: number, message: string) {
  const limiter = rateLimiter({
    windowMs: time * 60 * 1000,
    max: trys,
    message: message,
  });
  return limiter;
}

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
