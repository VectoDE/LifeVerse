import winston from "winston";
import path from "path";
import fs from "fs";

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, "errors.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(logDirectory, "combined.log") }),
        new winston.transports.Console({ format: winston.format.simple() })
    ],
});

export const log = {
    info: (message: string, meta?: any) => logger.info(message, meta),
    warn: (message: string, meta?: any) => logger.warn(message, meta),
    error: (message: string, meta?: any) => logger.error(message, meta),
    debug: (message: string, meta?: any) => logger.debug(message, meta),
};