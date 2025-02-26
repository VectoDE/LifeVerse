import slowDown from 'express-slow-down';

export const slowDownMiddleware = (windowMs: number = 15 * 60 * 1000, delayAfter: number = 50) => {
    return slowDown({
        windowMs,
        delayAfter,
        delayMs: (used, req) => {
            const delayAfterLimit = req.slowDown.limit;
            return (used - delayAfterLimit) * 500;
        },
    });
};
