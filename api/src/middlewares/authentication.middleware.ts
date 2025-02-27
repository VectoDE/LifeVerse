import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { config } from '../configs/config';

const discordClientId = config.discord.clientId;
const discordClientSecret = config.discord.clientSecret;
const discordCallbackUrl = config.discord.callbackUrl;

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        if (user) {
            return done(null, user);
        }
        return done('User not found');
    } catch (err) {
        return done(err);
    }
});

passport.use(new DiscordStrategy({
    clientID: discordClientId,
    clientSecret: discordClientSecret,
    callbackURL: discordCallbackUrl,
    scope: ['identify', 'email']
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ userId: profile.id });
        if (!user) {
            user = new User({
                username: profile.username,
                userId: profile.id,
                socketId: '',
                accessToken: _accessToken,
                refreshToken: _refreshToken,
            });
            await user.save();
        } else {
            user.accessToken = _accessToken;
            user.refreshToken = _refreshToken;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};
