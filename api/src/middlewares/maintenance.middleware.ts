import { Request, Response, NextFunction } from 'express';
import { Maintenance } from '../models/Maintenance';
import { logger } from '../services/logger.service';

export const maintenanceMiddleware = () => {
    return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const maintenance = await Maintenance.findOne();

            if (maintenance && maintenance.isActive) {
                logger.warn('Service unavailable due to maintenance', {
                    title: maintenance.title,
                    message: maintenance.message
                });
                res.status(503).json({ title: maintenance.title, message: maintenance.message });
                return;
            }

            next();
        } catch (error: any) {
            logger.error('Failed to check maintenance status', { error: error.message, stack: error.stack });
            next(error);
        }
    };
};
