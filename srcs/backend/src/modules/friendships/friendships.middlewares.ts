import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

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
