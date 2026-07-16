import rateLimiter from 'express-rate-limit'

const rateLimit = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {error: 'TOO_MANY_TRYS'}
});

export = rateLimit;