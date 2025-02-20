import { Schema, model, Document } from 'mongoose';

interface IRequest extends Document {
    url: string;
    type: string;
    status: string;
    timestamp: Date;
}

const requestSchema = new Schema<IRequest>({
    url: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Request = model<IRequest>('Request', requestSchema);
