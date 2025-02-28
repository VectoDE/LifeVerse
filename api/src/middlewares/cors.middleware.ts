import cors, { CorsOptions } from 'cors';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger.service';

export const corsMiddleware = (options: CorsOptions = {
    origin: ['https://www.lifeversegame.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-API-KEY',
        'X-CSRF-Token',
        'X-Forwarded-For',
        'X-Requested-With',
        'Accept',
        'Accept-Encoding',
        'Accept-Language',
        'Cache-Control',
        'Origin',
        'User-Agent',
        'Referer',
        'Host',
        'DNT',
        'Connection',
        'Upgrade-Insecure-Requests',
        'Pragma',
    ],
    credentials: true,
    exposedHeaders: ['Authorization', 'X-CSRF-Token']
}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        logger.info('User IP:', ip);

        cors(options)(req, res, next);
    };
};
