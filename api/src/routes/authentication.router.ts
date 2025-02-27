import { Router, Request, Response } from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/authentication.middleware';

const router = Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (_req, res) => {
    res.redirect('/dashboard');
});

router.get('/logout', (req, res, next) => {
    req.logout((err: any) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/profile', isAuthenticated, (req: Request, res: Response): void => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(400).json({ message: 'User not found' });
    }
});

export default router;
