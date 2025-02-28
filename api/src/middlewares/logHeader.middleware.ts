import { Request, Response, NextFunction } from 'express';
import { config } from '../configs/config';
import { logger } from '../services/logger.service';

export const logHeaderMiddleware = () => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (config.application.env === 'development') {
            logger.info('📥 Incoming request headers:', req.headers);
        }
        next();
    };
};
