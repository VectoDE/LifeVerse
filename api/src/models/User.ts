import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    userId: string;
    socketId: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address: {
        street: string;
        houseNumber: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    payments: mongoose.Types.ObjectId[];
    chats: mongoose.Types.ObjectId[];
    groups: mongoose.Types.ObjectId[];
    apiKeys: mongoose.Types.ObjectId[];
    betaKey: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    socketId: { type: String, default: '' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    role: { type: String, default: 'Member', required: true },
    email: { type: String, default: '' },
    firstName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    address: {
        street: { type: String, default: '' },
        houseNumber: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        postalCode: { type: String, default: '' },
    },
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    apiKeys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey' }],
    betaKey: { type: mongoose.Schema.Types.ObjectId, ref: 'BetaKey' },
}, { timestamps: true });

userSchema.pre<IUser>('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const User = mongoose.model<IUser>('User', userSchema);
