import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import winston from 'winston';

export const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new winston.transports.Console()
    ],
});

export const jsonErrorHandler: ErrorRequestHandler = (
    err: SyntaxError | any,
    _req: Request,
    res: Response,
    next: NextFunction
): void | Promise<void> => {
    if (err instanceof SyntaxError && 'body' in err) {
        logger.error(`JSON Error: ${err.message}`);
        res.status(400).json({ error: 'Invalid JSON format.' });
        return;
    }
    return next(err);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
    res.status(404).json({ error: '404 Error | Route not found!' });
};

export const globalErrorHandler: ErrorRequestHandler = (
    err: any, 
    _req: Request, 
    res: Response, 
    next: NextFunction
): void | Promise<void> => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || 500;
    const errorMessage = process.env.NODE_ENV === 'production'
        ? 'An error occurred. Please try again later.'
        : err.message;

    res.status(statusCode).json({
        error: errorMessage,
        ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
    });
};
