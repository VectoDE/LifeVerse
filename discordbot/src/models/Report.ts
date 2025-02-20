import { Schema, model, Document } from 'mongoose';

interface IReport extends Document {
    userId: string;
    username: string;
    reportedUser: string;
    reason: 'Abuse' | 'Spam' | 'Cheating' | 'Toxicity' | string;
    description: string;
    mediaUrl?: string;
    timestamp: Date;
    reporter: string;
}

const reportSchema = new Schema<IReport>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reportedUser: { type: String, required: true },
    reason: { 
        type: String, 
        enum: ['Abuse', 'Spam', 'Cheating', 'Toxicity'], 
        required: true 
    },
    description: { type: String, required: true },
    mediaUrl: { type: String, required: false },
    timestamp: { type: Date, default: Date.now },
    reporter: { type: String, required: true },
});

export const Report = model<IReport>('Report', reportSchema);
