import { Schema, model, Document } from 'mongoose';

export interface IWelcomeEmbed {
    title: string;
    description: string;
    fields?: { name: string; value: string }[];
    footer: string;
    thumbnail?: string;
    image?: string;
}

export interface IWelcome extends Document {
    guildId: string;
    guildName: string;
    channelId: string;
    channelName: string;
    userId: string;
    username: string;
    embed: IWelcomeEmbed;
    isEnabled: boolean;
    timestamp: Date;
}

const welcomeSchema = new Schema<IWelcome>({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    embed: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        fields: [
            {
                name: { type: String },
                value: { type: String },
            },
        ],
        footer: { type: String, required: true },
        thumbnail: { type: String },
        image: { type: String },
    },
    isEnabled: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export const Welcome = model<IWelcome>('Welcome', welcomeSchema);
