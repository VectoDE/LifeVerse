import mongoose, { Document, Schema } from 'mongoose';

export interface IBan extends Document {
    userId: string;
    username: string;
    reason: string;
    timestamp: Date;
}

const BanSchema = new Schema<IBan>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Ban = mongoose.model<IBan>('Ban', BanSchema);
