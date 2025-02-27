import mongoose from 'mongoose';
import { config } from '../configs/config';
import { logger } from '../services/logger.service';

const mongoUri = config.database.mongoUri;

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {} as mongoose.ConnectOptions);
        console.log('MongoDB connected');

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
