import { Schema, model, Document } from 'mongoose';

export interface IReport extends Document {
    userId: string;
    username: string;
    reportedUser: string;
    reason: 'Abuse' | 'Spam' | 'Cheating' | 'Toxicity' | string;
    description: string;
    mediaUrl?: string;
    reporter: string;
    identifier: string;
    timestamp: Date;
}

const reportSchema = new Schema<IReport>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reportedUser: { type: String, required: true },
    reason: {
        type: String,
        enum: ['Abuse', 'Spam', 'Cheating', 'Toxicity'],
        required: true,
    },
    description: { type: String, required: true },
    mediaUrl: { type: String, required: false },
    reporter: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

reportSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Report = model<IReport>('Report', reportSchema);
