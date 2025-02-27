import { Schema, model, Document } from 'mongoose';

interface ISms extends Document {
    phoneNumber: string;
    message: string;
    sentAt: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const SmsSchema = new Schema<ISms>({
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, required: true },
    status: { type: String, enum: ['sent', 'scheduled'], default: 'sent' },
}, { timestamps: true });

export const Sms = model<ISms>('Sms', SmsSchema);
