import { Schema, model, Document } from 'mongoose';

interface ITimeout extends Document {
    userId: string;
    username: string;
    reason: string;
    duration: number;
    timestamp: Date;
}

const timeoutSchema = new Schema<ITimeout>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reason: { type: String, required: true },
    duration: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Timeout = model<ITimeout>('Timeout', timeoutSchema);
