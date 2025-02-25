import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import hpp from 'hpp';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import winston from 'winston';

// Initialize Express
const app = express();

// Configuration
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Logging with Winston
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
        new winston.transports.Console()
    ],
});

// Security headers with Helmet
app.use(helmet());

// CORS with secure configuration
app.use(cors({
    origin: ['https://www.lifeversegame.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'User-Agent',
        'Referer',
        'Host',
        'DNT',
        'Connection',
        'Upgrade-Insecure-Requests',
        'Accept-Encoding',
        'Accept-Language',
        'X-CSRF-Token',
        'Cache-Control',
        'Pragma'
    ],
    credentials: true,
    exposedHeaders: ['Authorization', 'X-CSRF-Token']
}));

// Middleware to log incoming request headers
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('📥 Incoming request headers:', req.headers);
    next();
});

// Rate limiting to prevent attacks
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests. Please wait a moment.',
}));

// Slow down to prevent spam attacks
app.use(slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: 500,
}));

// Security protections
app.use(hpp());
app.use(xss());
app.use(mongoSanitize());

// Compression
app.use(compression());

// CSRF protection (requires Cookie Parser)
app.use(cookieParser());
app.use(csurf({ cookie: true }));

// Logging requests with Morgan & Winston
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// JSON parsing middleware
app.use(express.json());

// Session storage
app.use(session({
    secret: 'super-secure-secret-password',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: 'strict' },
}));

// Maintenance mode middleware
const maintenanceMode = false;
app.use((req, res, next) => {
    if (maintenanceMode) {
        return res.status(503).json({ message: 'The API is currently in maintenance mode.' });
    }
    next();
});

// Example route
app.get('/', (req, res) => {
    res.json({ message: 'API is running securely!' });
});

// ========================
// EXTENDED ERROR HANDLING
// ========================

// Error handling for invalid JSON requests (syntax errors)
app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        logger.error(`JSON Error: ${err.message}`);
        return res.status(400).json({ error: 'Invalid JSON format.' });
    }
    next(err);
});

// 404 error handling (Route not found)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Global error handling for API and server errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.status || 500;
    let errorMessage = err.message || 'Internal server error.';

    if (isProduction) {
        errorMessage = 'An error occurred. Please try again later.';
    }

    res.status(statusCode).json({
        error: errorMessage,
        ...(isProduction ? {} : { stack: err.stack }) // Stacktrace only in development mode
    });
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
    console.log(`API is running securely on port ${PORT}`);
});