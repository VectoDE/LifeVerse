import { Schema, model, Document } from 'mongoose';

interface IMute extends Document {
    userId: string;
    username: string;
    reason: string;
    timestamp: Date;
}

const muteSchema = new Schema<IMute>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Mute = model<IMute>('Mute', muteSchema);
