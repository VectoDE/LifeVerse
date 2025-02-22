import { Schema, model, Document } from 'mongoose';

export interface IMute extends Document {
    userId: string;
    username: string;
    reason: string;
    identifier: string;
    timestamp: Date;
}

const muteSchema = new Schema<IMute>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reason: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

muteSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Mute = model<IMute>('Mute', muteSchema);
