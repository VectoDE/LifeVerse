import { Request, Response, NextFunction } from 'express';
import { Beta } from '../models/Beta';
import { logger } from '../services/logger.service';

export const verifyBetaKey = async (req: Request, res: Response, next: NextFunction) => {
    const betaKey = req.headers['X-BETA-KEY'] as string;

    if (!betaKey) {
        logger.warn('Beta key missing in request headers');
        return res.status(401).json({ error: 'Beta key is required' });
    }

    try {
        const beta = await Beta.findOne();

        if (!beta || !beta.isEnabled) {
            logger.warn('Beta system is disabled or not found');
            return res.status(403).json({ error: 'Beta system is not enabled' });
        }

        const betaKeyRecord = beta.keys.find((key) => key.key === betaKey);

        if (!betaKeyRecord) {
            logger.warn('Invalid beta key provided');
            return res.status(403).json({ error: 'Invalid Beta Key' });
        }

        if (betaKeyRecord.isExpired || !betaKeyRecord.isActive) {
            logger.warn('Beta key is expired or inactive', { betaKeyRecord });
            return res.status(403).json({ error: 'Beta Key is expired or inactive' });
        }

        req.body.user = betaKeyRecord.user;
        logger.info('Beta key successfully verified', { user: req.body.user });

        return next();
    } catch (error: any) {
        logger.error('Error verifying beta key', { error: error.message, stack: error.stack });
        return res.status(500).json({ error: 'Internal server error' });
    }
};
