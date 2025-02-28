import { Request, Response, RequestHandler } from 'express';
import { ApiKey } from '../models/ApiKey';
import { logger } from '../services/logger.service';

export const createApiKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, key, user, expiresAt } = req.body;

        if (!name || !key || !expiresAt) {
            res.status(400).json({ message: 'Name, key, and expiration date are required' });
            return;
        }

        const apiKeyExists = await ApiKey.findOne({ key });
        if (apiKeyExists) {
            logger.warn('API Key already exists', { key });
            res.status(400).json({ message: 'API Key already exists' });
            return;
        }

        const newApiKey = new ApiKey({
            name,
            key,
            user,
            expiresAt,
            isActive: true
        });

        await newApiKey.save();
        logger.info('API Key created successfully', { key, user });

        res.status(201).json({ message: 'API Key created successfully', apiKey: newApiKey });
    } catch (error: any) {
        logger.error('Error creating API Key', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllApiKeys: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const apiKeys = await ApiKey.find();
        logger.info('Fetched all API keys', { count: apiKeys.length });

        res.status(200).json(apiKeys);
    } catch (error: any) {
        logger.error('Error fetching all API keys', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getApiKeyById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { apiKeyId } = req.params;

    try {
        const apiKey = await ApiKey.findById(apiKeyId);
        if (!apiKey) {
            logger.warn('API Key not found', { apiKeyId });
            res.status(404).json({ message: 'API Key not found' });
            return;
        }

        logger.info('Fetched API Key by ID', { apiKeyId });
        res.status(200).json(apiKey);
    } catch (error: any) {
        logger.error('Error fetching API Key by ID', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateApiKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { apiKeyId } = req.params;
    const { name, expiresAt, isActive } = req.body;

    try {
        const apiKey = await ApiKey.findById(apiKeyId);
        if (!apiKey) {
            logger.warn('API Key not found for update', { apiKeyId });
            res.status(404).json({ message: 'API Key not found' });
            return;
        }

        if (name) apiKey.name = name;
        if (expiresAt) apiKey.expiresAt = expiresAt;
        if (isActive !== undefined) apiKey.isActive = isActive;

        await apiKey.save();
        logger.info('API Key updated successfully', { apiKeyId, name, expiresAt, isActive });

        res.status(200).json({ message: 'API Key updated successfully', apiKey });
    } catch (error: any) {
        logger.error('Error updating API Key', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteApiKey: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { apiKeyId } = req.params;

    try {
        const apiKey = await ApiKey.findByIdAndDelete(apiKeyId);
        if (!apiKey) {
            logger.warn('API Key not found for deletion', { apiKeyId });
            res.status(404).json({ message: 'API Key not found' });
            return;
        }

        logger.info('API Key deleted successfully', { apiKeyId });
        res.status(200).json({ message: 'API Key deleted successfully' });
    } catch (error: any) {
        logger.error('Error deleting API Key', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};
