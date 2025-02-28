import { Schema, model, Document } from 'mongoose';

interface IEmail extends Document {
    to: string;
    subject: string;
    text: string;
    html: string;
    sentAt: Date;
}

const emailSchema = new Schema<IEmail>({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    html: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

export const Email = model<IEmail>("Email", emailSchema);
