import type { Request, Response, NextFunction } from 'express';
import rateLimiter from 'express-rate-limit';
import { validationResult } from 'express-validator';
import { UnsupportedFileTypeError } from './errors.ts';
import { MulterError } from 'multer';
export function RateLimiter(time: number, tries: number, message: string, skipIfSuccessful = false) {
  const limiter = rateLimiter({
    windowMs: time * 60 * 1000,
    max: tries,
    message: { error: message },
    skipSuccessfulRequests: skipIfSuccessful
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

export function notFoundCall(req: Request, res: Response) {
  return (res.status(404).json({error: 'NOT_FOUND'}))
}


export function errorManager(error: unknown, req: Request, res: Response, next: NextFunction){
  if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE'){
    return (res.status(413).json({error: 'INVALID_FILE_SIZE'}));
  }
  else if (error instanceof MulterError ){
    return (res.status(400).json ({error: 'INVALID_UPLOAD'}));
  }

  else if (error instanceof UnsupportedFileTypeError){
    return (res.status(415).json ({error: 'WRONG_FILE_TYPE'}));
  }
  else if (typeof error === 'object' && error !== null && 'status' in error
    && typeof error.status === 'number' && error.status >= 400 && error.status < 500){
    return (res.status(error.status).json({error: 'INVALID_REQUEST'}));
  }
  else {
    console.error('Unhandled error:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
    
  }

}