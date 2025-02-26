import { Request, Response, NextFunction } from 'express';
import { Beta } from '../models/Beta';

export const verifyBetaKey = async (req: Request, res: Response, next: NextFunction) => {
    const betaKey = req.headers['X-BETA-KEY'] as string;

    if (!betaKey) {
        return res.status(401).json({ error: 'Beta key is required' });
    }

    try {
        const beta = await Beta.findOne();

        if (!beta || !beta.isEnabled) {
            return res.status(403).json({ error: 'Beta system is not enabled' });
        }

        const betaKeyRecord = beta.keys.find((key) => key.key === betaKey);

        if (!betaKeyRecord) {
            return res.status(403).json({ error: 'Invalid Beta Key' });
        }

        if (betaKeyRecord.isExpired || !betaKeyRecord.isActive) {
            return res.status(403).json({ error: 'Beta Key is expired or inactive' });
        }

        req.body.user = betaKeyRecord.user;

        return next();
    } catch (error) {
        console.error('Error verifying beta key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
