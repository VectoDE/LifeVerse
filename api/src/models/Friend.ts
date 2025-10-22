import { Schema, model, Document } from 'mongoose';

export interface IFriend extends Document {
    identifier: string;
    userId: string;
    friendId: string;
    guildId?: string;
    status: 'pending' | 'accepted' | 'rejected';
    buttonIds?: string[];
    buttonLabels?: string[];
    timestamp: Date;
}

const FriendSchema = new Schema<IFriend>({
    identifier: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    friendId: { type: String, required: true },
    guildId: { type: String, required: false, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    buttonIds: { type: [String], default: [] },
    buttonLabels: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
});

FriendSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Friend = model<IFriend>('Friend', FriendSchema);
