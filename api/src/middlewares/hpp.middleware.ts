import { Request, Response, NextFunction } from 'express';

export const hppMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const params: Record<string, string[]> = {};

        for (const key in req.query) {
            if (params[key]) {
                res.status(400).json({ message: `Duplicate parameter detected: ${key}` });
                return;
            }
            params[key] = [req.query[key] as string];
        }

        for (const key in req.body) {
            if (params[key]) {
                res.status(400).json({ message: `Duplicate parameter detected: ${key}` });
                return;
            }
            params[key] = [req.body[key] as string];
        }

        next();
    };
};
