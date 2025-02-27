import { Schema, model, Document } from 'mongoose';

export interface ICommandUsage extends Document {
    userId: string;
    username: string;
    channelId: string;
    commands: {
        commandName: string;
        timestamp: Date;
        identifier: string;
    }[];
}

const commandUsageSchema = new Schema<ICommandUsage>({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    channelId: { type: String, required: true },
    commands: [{
        commandName: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        identifier: { type: String, required: true, unique: true }
    }],
});

commandUsageSchema.pre('save', function (next) {
    this.commands.forEach((command) => {
        if (!command.identifier) {
            command.identifier = Math.random().toString(36).substring(2, 15);
        }
    });
    next();
});

export const CommandUsage = model<ICommandUsage>('CommandUsage', commandUsageSchema);
