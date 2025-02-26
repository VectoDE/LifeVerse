import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

export const helmetMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        helmet()(req, res, next);
    };
};
