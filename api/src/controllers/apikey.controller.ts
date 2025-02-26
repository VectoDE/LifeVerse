import { Request, Response, RequestHandler } from 'express';
import { ApiKey } from '../models/ApiKey';

export const createApiKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, key, user, expiresAt } = req.body;

        const apiKeyExists = await ApiKey.findOne({ key });
        if (apiKeyExists) {
            res.status(400).json({ message: 'API Key already exists' });
            return;
        }

        const newApiKey = new ApiKey({
            name,
            key,
            user,
            expiresAt,
            isActive: true,
        });

        await newApiKey.save();

        res.status(201).json({ message: 'API Key created successfully', apiKey: newApiKey });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getAllApiKeys: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const apiKeys = await ApiKey.find();
        res.status(200).json(apiKeys);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getApiKeyById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const apiKey = await ApiKey.findById(id);

        if (!apiKey) {
            res.status(404).json({ message: 'API Key not found' });
            return;
        }

        res.status(200).json(apiKey);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const updateApiKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, expiresAt, isActive } = req.body;

    try {
        const updatedApiKey = await ApiKey.findByIdAndUpdate(
            id,
            { name, expiresAt, isActive },
            { new: true }
        );

        if (!updatedApiKey) {
            res.status(404).json({ message: 'API Key not found' });
            return;
        }

        res.status(200).json({ message: 'API Key updated successfully', apiKey: updatedApiKey });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const deleteApiKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedApiKey = await ApiKey.findByIdAndDelete(id);

        if (!deletedApiKey) {
            res.status(404).json({ message: 'API Key not found' });
            return;
        }

        res.status(200).json({ message: 'API Key deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
