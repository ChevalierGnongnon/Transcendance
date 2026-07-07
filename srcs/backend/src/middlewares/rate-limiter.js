const rateLimiter = require('express-rate-limit');

const rateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {error: 'TOO_MANY_TRYS'}
});