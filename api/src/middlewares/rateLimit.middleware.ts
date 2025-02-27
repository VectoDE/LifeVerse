import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = (windowMs: number = 15 * 60 * 1000, max: number = 100, message: string = 'Too many requests. Please wait a moment.') => {
    return rateLimit({
        windowMs,
        max,
        message
    });
};
