import { Schema, model, Document } from 'mongoose';

export interface ICommandUsage extends Document {
    commandName: string;
    userId: string;
    username: string;
    channelId: string;
    identifier: string;
    timestamp: Date;
}

const commandUsageSchema = new Schema<ICommandUsage>({
    commandName: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    channelId: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

commandUsageSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const CommandUsage = model<ICommandUsage>('CommandUsage', commandUsageSchema);
