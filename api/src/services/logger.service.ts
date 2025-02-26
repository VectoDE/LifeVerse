import winston from "winston";
import path from "path";

const logDirectory = path.join(__dirname, "../logs");

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, "errors.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(logDirectory, "combined.log") }),
        new winston.transports.Console()
    ],
});