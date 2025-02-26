import { Request, Response, NextFunction } from 'express';
import { ApiKey } from '../models/ApiKey';
import { User } from '../models/User';
import { Role } from '../models/Role';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers['X-API-KEY'] as string;

        if (!apiKey) {
            return res.status(401).json({ error: 'Access denied: API key is required' });
        }

        const apiKeyDoc = await ApiKey.findOne({ key: apiKey, isActive: true });

        if (!apiKeyDoc) {
            return res.status(403).json({ error: 'Access denied: Invalid or inactive API key' });
        }

        if (apiKeyDoc.isExpired()) {
            return res.status(403).json({ error: 'Access denied: API key has expired' });
        }

        const user = await User.findById(apiKeyDoc.user).populate('role');

        if (!user) {
            return res.status(404).json({ error: 'Access denied: User not found' });
        }

        req.user = user;

        return next();
    } catch (error) {
        console.error('API Key Check Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const hasRole = (...roles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ error: 'Access denied: User not authenticated' });
            return;
        }

        try {
            const userRole = await Role.findById(req.user.role);

            if (!userRole) {
                res.status(403).json({ error: 'Access denied: Role not found' });
                return;
            }

            if (!roles.includes(userRole.name)) {
                res.status(403).json({ error: 'Access denied: Insufficient permissions' });
                return;
            }

            return next();
        } catch (error) {
            console.error('Role Check Error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    };
};
