import { Schema, model, Document } from "mongoose";

export interface ICommandUsage extends Document {
    commandName: string;
    userId: string;
    username: string;
    channelId: string;
    timestamp: Date;
}

const commandUsageSchema = new Schema<ICommandUsage>({
    commandName: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    channelId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const CommandUsage = model<ICommandUsage>("CommandUsage", commandUsageSchema);
