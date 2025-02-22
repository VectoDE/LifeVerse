import { Schema, model, Document } from 'mongoose';

export interface IWarn extends Document {
    userId: string;
    guildId: string;
    reason: string;
    moderatorId: string;
    identifier: string;
    timestamp: Date;
}

const WarnSchema = new Schema<IWarn>({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, required: true },
    moderatorId: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

WarnSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Warn = model<IWarn>('Warn', WarnSchema);
