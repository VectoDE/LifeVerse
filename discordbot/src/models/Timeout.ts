import { Schema, model, Document } from 'mongoose';

interface ITimeout extends Document {
    userId: string;
    username: string;
    reason: string;
    duration: number;
    identifier: number;
    timestamp: Date;
}

const timeoutSchema = new Schema<ITimeout>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reason: { type: String, required: true },
    duration: { type: Number, required: true },
    identifier: { type: Number, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

timeoutSchema.pre('save', function(next) {
    if (isNaN(this.identifier)) {
        this.identifier = 1;
    }
    next();
});

export const Timeout = model<ITimeout>('Timeout', timeoutSchema);
