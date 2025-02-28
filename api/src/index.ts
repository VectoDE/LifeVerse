import './strategies/discord.strategy';
import express from 'express';
import dotenv from 'dotenv';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './configs/config';
import { connectDB } from './database/connectDB';
import { jsonErrorHandler, notFoundHandler, globalErrorHandler } from './middlewares/errorHandler.middleware';
import { bodyParserMiddleware } from './middlewares/bodyParser.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware';
import { maintenanceMiddleware } from './middlewares/maintenance.middleware';
import { csrfMiddleware } from './middlewares/csrf.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { slowDownMiddleware } from './middlewares/slowDown.middleware';
import { compressionMiddleware } from './middlewares/compression.middleware';
import { logHeaderMiddleware } from './middlewares/logHeader.middleware';
import { SocketIOService } from './services/socketio.service';
import { hppMiddleware } from './middlewares/hpp.middleware';
import { helmetMiddleware } from './middlewares/helmet.middleware';

import apikeyRouter from './routes/apikey.router';
import authRouter from './routes/authentication.router';
import betaRouter from './routes/beta.router';
import blogRouter from './routes/blog.router';
import paymentRouter from './routes/payment.router';
import roleRouter from './routes/role.router';
import userRouter from './routes/user.router';
import smsRouter from './routes/sms.router';

const app = express();
const server = createServer(app);

dotenv.config();

const io = new Server(server, {
    cors: {
        origin: ['https://www.lifeversegame.com'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const socketService = new SocketIOService(io);

const PORT = config.application.port || 3000;

connectDB();

app.use(hppMiddleware());
app.use(helmetMiddleware());
app.use(mongoSanitize());
app.use(bodyParserMiddleware());
app.use(corsMiddleware());
app.use(slowDownMiddleware());
app.use(csrfMiddleware());
app.use(rateLimitMiddleware());
app.use(loggerMiddleware());
app.use(compressionMiddleware());
app.use(logHeaderMiddleware());
app.use(maintenanceMiddleware());
app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    name: 'discord-oauth2'
}));

app.use(passport.initialize());
app.use(passport.session());

// Example route
app.get('/', (_req, res) => {
    res.json({ message: 'API is running securely with WebSockets enabled!' });
});

app.use('/api/keys', apikeyRouter);
app.use('/api/beta', betaRouter);
app.use('/api/auth', authRouter);
app.use('/api/sms', smsRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/roles', roleRouter); 
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

// Error handling middleware
app.use(jsonErrorHandler);
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ========================
// START SERVER
// ========================
server.listen(PORT, () => {
    console.log(`API is running securely with WebSockets on port ${PORT}`);
    socketService;
});
