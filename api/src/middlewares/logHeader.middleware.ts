import { Request, Response, NextFunction } from 'express';
import { config } from '../configs/config';

export const logHeaderMiddleware = () => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (config.application.env === 'development') {
            console.log('📥 Incoming request headers:', req.headers);
        }
        next();
    };
};
