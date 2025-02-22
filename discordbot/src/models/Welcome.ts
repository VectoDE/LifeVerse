import { Schema, model, Document } from 'mongoose';

export interface IWelcome extends Document {
    guildId: string;
    guildName: string;
    channelId: string;
    channelName: string;
    userId: string;
    username: string;
    timestamp: Date;
}

const welcomeSchema = new Schema<IWelcome>({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Welcome = model<IWelcome>('Welcome', welcomeSchema);
