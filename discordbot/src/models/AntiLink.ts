import { Schema, model, Document } from 'mongoose';

export interface IAntiLink extends Document {
    guildId: string;
    guildName: string;
    enabled: boolean;
    allowedChannels: string[];
    identifier: string;
    timestamp: Date;
    isAllowedInChannel(channelId: string): boolean;
}

const AntiLinkSchema = new Schema<IAntiLink>({
    guildId: { type: String, required: true, unique: true },
    guildName: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    allowedChannels: { type: [String], default: [] },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

AntiLinkSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

AntiLinkSchema.methods.isAllowedInChannel = function (channelId: string): boolean {
    return this.allowedChannels.includes(channelId);
};

export const AntiLink = model<IAntiLink>('AntiLink', AntiLinkSchema);
