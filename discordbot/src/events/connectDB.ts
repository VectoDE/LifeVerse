import mongoose from 'mongoose';
import { config } from '../config/config';
import { LogService } from '../services/logService';

export const connectDB = async () => {
    try {
        const mongoURI = config.database.MONGO_URI;

        if (!mongoURI) {
            LogService.error('MongoDB URI is not defined in environment variables.');
            throw new Error('MongoDB URI is missing');
        }

        const conn = await mongoose.connect(mongoURI);

        if (conn) {
            LogService.info(`Database Connected`);
        } else {
            LogService.error('Connection object is undefined.');
        }
    } catch (error) {
        if (error instanceof Error) {
            LogService.error(`Error: ${error.message}`);
        } else {
            LogService.error('An unknown error occurred');
        }
        process.exit(1);
    }
};
