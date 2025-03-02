import { Schema, model, Document } from 'mongoose';

interface IVerification extends Document {
    identifier: string;
    userId: string;
    guildId?: string;
    lifeVerseUrl: string;
    lifeVerseUsername: string;
    code: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const verificationSchema = new Schema<IVerification>({
    identifier: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: false, default: '' },
    lifeVerseUrl: { type: String, required: true },
    lifeVerseUsername: { type: String, required: true },
    code: { type: String, required: true },
    verified: { type: Boolean, default: false },
}, { timestamps: true });

verificationSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Verification = model<IVerification>('Verification', verificationSchema);
