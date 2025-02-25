import mongoose, { Schema, Document } from 'mongoose';

interface IVerification extends Document {
    identifier: string;
    userId: string;
    guildId: string;
    lifeVerseUrl: string;
    lifeVerseUsername: string;
    code: string;
    verified: boolean;
    timestamp: Date;
}

const verificationSchema = new Schema<IVerification>({
    identifier: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    lifeVerseUrl: { type: String, required: false },
    lifeVerseUsername: { type: String, required: false },
    code: { type: String, required: true },
    verified: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

verificationSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Verification = mongoose.model<IVerification>('Verification', verificationSchema);
