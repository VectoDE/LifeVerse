import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { logger } from '../services/logger.service';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (req.isAuthenticated()) {
        return next();
    }

    if (user instanceof User) {
        logger.info('User authenticated', { userId: user.id });
        return next();
    }

    logger.warn('User not authenticated', { ip: req.ip, headers: req.headers });
    res.status(401).json({ message: 'Unauthorized' });
};
