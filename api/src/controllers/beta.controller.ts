import { Request, Response, RequestHandler } from 'express';
import { Beta, BetaKey } from '../models/Beta';
import { logger } from '../services/logger.service';

export const createBetaKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, key, expireAt, user } = req.body;

        if (!name || !key || !expireAt) {
            res.status(400).json({ message: 'Name, key, and expiration date are required' });
            return;
        }

        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            logger.warn('Beta system is not enabled');
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const newBetaKey = new BetaKey({
            name,
            key,
            expireAt,
            user,
            isActive: true,
            isExpired: false
        });

        beta.keys.push(newBetaKey);
        await beta.save();

        logger.info('Beta key created successfully', { name, user });
        res.status(201).json({ message: 'Beta key created successfully', betaKey: newBetaKey });
    } catch (error: any) {
        logger.error('Error creating beta key', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllBetaKeys: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            logger.warn('Beta system is not enabled');
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        logger.info('Fetched all beta keys', { count: beta.keys.length });
        res.status(200).json(beta.keys);
    } catch (error: any) {
        logger.error('Error fetching beta keys', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBetaKeyById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { betaKeyId } = req.params;

    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            logger.warn('Beta system is not enabled');
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const betaKey = beta.keys.find((keyObj) => keyObj._id.toString() === betaKeyId);
        if (!betaKey) {
            logger.warn('Beta key not found', { betaKeyId });
            res.status(404).json({ message: 'Beta key not found' });
            return;
        }

        logger.info('Fetched beta key by ID', { betaKeyId });
        res.status(200).json(betaKey);
    } catch (error: any) {
        logger.error('Error fetching beta key by ID', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBetaKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { betaKeyId } = req.params;
    const { isActive, expireAt, user } = req.body;

    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            logger.warn('Beta system is not enabled');
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const betaKey = beta.keys.find((keyObj) => keyObj._id.toString() === betaKeyId);
        if (!betaKey) {
            logger.warn('Beta key not found for update', { betaKeyId });
            res.status(404).json({ message: 'Beta key not found' });
            return;
        }

        if (isActive !== undefined) {
            betaKey.isActive = isActive;
        }
        if (expireAt) {
            betaKey.expireAt = expireAt;
            betaKey.isExpired = new Date() > expireAt;
        }
        if (user) {
            betaKey.user = user;
        }

        await beta.save();
        logger.info('Beta key updated successfully', { betaKeyId, isActive, expireAt, user });
        res.status(200).json({ message: 'Beta key updated successfully', betaKey });
    } catch (error: any) {
        logger.error('Error updating beta key', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBetaKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { betaKeyId } = req.params;

    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            logger.warn('Beta system is not enabled');
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const betaKeyIndex = beta.keys.findIndex((keyObj) => keyObj._id.toString() === betaKeyId);
        if (betaKeyIndex === -1) {
            logger.warn('Beta key not found for deletion', { betaKeyId });
            res.status(404).json({ message: 'Beta key not found' });
            return;
        }

        beta.keys.splice(betaKeyIndex, 1);
        await beta.save();

        logger.info('Beta key deleted successfully', { betaKeyId });
        res.status(200).json({ message: 'Beta key deleted successfully' });
    } catch (error: any) {
        logger.error('Error deleting beta key', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleBetaSystem: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const beta = await Beta.findOne();
        if (!beta) {
            logger.warn('Beta system not found');
            res.status(404).json({ message: 'Beta system not found' });
            return;
        }

        beta.toggleBetaSystem();
        await beta.save();

        logger.info('Beta system toggled successfully', { isEnabled: beta.isEnabled });
        res.status(200).json({ message: `Beta system is now ${beta.isEnabled ? 'enabled' : 'disabled'}` });
    } catch (error: any) {
        logger.error('Error toggling beta system', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};
