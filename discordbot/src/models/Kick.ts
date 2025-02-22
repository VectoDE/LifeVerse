import { Schema, model, Document } from 'mongoose';

export interface IKick extends Document {
    userId: string;
    moderatorId: string;
    reason: string;
    identifier: string;
    timestamp: Date;
}

const KickSchema = new Schema<IKick>({
    userId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

KickSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Kick = model<IKick>('Kick', KickSchema);
