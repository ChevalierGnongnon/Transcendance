import rateLimiter from 'express-rate-limit';

export function RateLimiter(time: number, trys: number, message: string ){
    const limiter = rateLimiter({
        windowMs: time * 60 * 1000,
        max: trys,
        message: message
    });
    return (limiter);
}
