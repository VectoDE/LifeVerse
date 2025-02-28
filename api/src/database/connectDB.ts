import mongoose from 'mongoose';
import { config } from '../configs/config';
import { logger } from '../services/logger.service';

const mongoUri = config.database.mongoUri;

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {} as mongoose.ConnectOptions);
        logger.info('MongoDB connected');

        mongoose.connection.on('connected', () => {
            logger.info('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

    } catch (err: any) {
        logger.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
