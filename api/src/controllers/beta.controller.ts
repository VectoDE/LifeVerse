import { Request, Response, RequestHandler } from 'express';
import { Beta, BetaKey } from '../models/Beta';

export const createBetaKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, key, expireAt, user } = req.body;

        if (!name || !key || !expireAt) {
            res.status(400).json({ message: 'Name, key, and expiration date are required' });
            return;
        }

        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
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

        res.status(201).json({ message: 'Beta key created successfully', betaKey: newBetaKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllBetaKeys: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        res.status(200).json(beta.keys);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBetaKeyById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { betaKeyId } = req.params;

    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const betaKey = beta.keys.find((keyObj) => keyObj._id.toString() === betaKeyId);
        if (!betaKey) {
            res.status(404).json({ message: 'Beta key not found' });
            return;
        }

        res.status(200).json(betaKey);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBetaKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { betaKeyId } = req.params;
    const { isActive, expireAt, user } = req.body;

    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const betaKey = beta.keys.find((keyObj) => keyObj._id.toString() === betaKeyId);
        if (!betaKey) {
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

        res.status(200).json({ message: 'Beta key updated successfully', betaKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBetaKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { betaKeyId } = req.params;

    try {
        const beta = await Beta.findOne();
        if (!beta || !beta.isEnabled) {
            res.status(403).json({ message: 'Beta system is not enabled' });
            return;
        }

        const betaKeyIndex = beta.keys.findIndex((keyObj) => keyObj._id.toString() === betaKeyId);
        if (betaKeyIndex === -1) {
            res.status(404).json({ message: 'Beta key not found' });
            return;
        }

        beta.keys.splice(betaKeyIndex, 1);
        await beta.save();

        res.status(200).json({ message: 'Beta key deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleBetaSystem: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const beta = await Beta.findOne();
        if (!beta) {
            res.status(404).json({ message: 'Beta system not found' });
            return;
        }

        beta.toggleBetaSystem();
        await beta.save();

        res.status(200).json({ message: `Beta system is now ${beta.isEnabled ? 'enabled' : 'disabled'}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
