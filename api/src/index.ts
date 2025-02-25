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

// Initialise Express
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

// Security header with helmet
app.use(helmet());

// CORS with save configuration
app.use(cors({
    origin: ['https://www.lifeversegame.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Rate Limiting to save for attacks
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Zu viele Anfragen. Bitte warte einen Moment.',
}));

// Slow Down for Spam-Protection
app.use(slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: 500,
}));

// Protection
app.use(hpp());
app.use(xss());
app.use(mongoSanitize());

// Compression
app.use(compression());

// CSRF-Protection (need Cookie-Parser)
app.use(cookieParser());
app.use(csurf({ cookie: true }));

// Logging requests with Morgan & Winston
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// JSON-Parsing Middleware
app.use(express.json());

// Session saving
app.use(session({
    secret: 'super-sicheres-geheimes-passwort',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: 'strict' },
}));

// Middleware for maintenance
const maintenanceMode = false;
app.use((req, res, next) => {
    if (maintenanceMode) {
        return res.status(503).json({ message: 'Die API ist derzeit im Wartungsmodus.' });
    }
    next();
});

// Sample route
app.get('/', (req, res) => {
    res.json({ message: 'API läuft sicher!' });
});

// ========================
// EXPANDED ERROR HANDLING
// ========================

// Error for not valid json requests (Syntax error)
app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        logger.error(`JSON-Fehler: ${err.message}`);
        return res.status(400).json({ error: 'Ungültiges JSON-Format.' });
    }
    next(err);
});

// 404 error handling (Route not found)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Route nicht gefunden.' });
});

// Globale error handling for API- any Server erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Fehler: ${err.message}`, { stack: err.stack });

    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.status || 500;
    let errorMessage = err.message || 'Interner Serverfehler.';

    if (isProduction) {
        errorMessage = 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
    }

    res.status(statusCode).json({
        error: errorMessage,
        ...(isProduction ? {} : { stack: err.stack }) // Stacktrace nur in Entwicklung
    });
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
    console.log(`API läuft sicher auf Port ${PORT}`);
});