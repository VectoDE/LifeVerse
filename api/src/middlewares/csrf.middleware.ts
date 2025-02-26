import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { config } from '../configs/config';

export const csrfMiddleware = (cookieOptions: object = { httpOnly: true, secure: config.application.env === 'production' }) => {
    return [
        cookieParser(),
        csurf({ cookie: cookieOptions }),
        (req: Request, res: Response, next: NextFunction) => {
            res.cookie('X-CSRF-TOKEN', req.csrfToken(), cookieOptions);
            next();
        }
    ];
};
