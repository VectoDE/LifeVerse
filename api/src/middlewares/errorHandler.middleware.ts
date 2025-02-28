import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../services/logger.service';

export const jsonErrorHandler: ErrorRequestHandler = (
    err: SyntaxError | any,
    _req: Request,
    res: Response,
    next: NextFunction
): void | Promise<void> => {
    if (err instanceof SyntaxError && 'body' in err) {
        logger.error('JSON Parsing Error: Invalid JSON format received.', { message: err.message, stack: err.stack });
        res.status(400).json({ error: 'Invalid JSON format.' });
        return;
    }
    return next(err);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
    logger.warn('404 Not Found: A request was made to an unknown route.');
    res.status(404).json({ error: '404 Error | Route not found!' });
};

export const globalErrorHandler: ErrorRequestHandler = (
    err: any, 
    _req: Request, 
    res: Response, 
    next: NextFunction
): void | Promise<void> => {
    logger.error('Unhandled Server Error:', { message: err.message, stack: err.stack });

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || 500;
    const errorMessage = process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred. Please try again later.'
        : err.message;

    res.status(statusCode).json({
        error: errorMessage,
        ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
    });
};
