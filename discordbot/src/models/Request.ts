import { Schema, model, Document } from 'mongoose';

export interface IRequest extends Document {
    url: string;
    type: string;
    status: string;
    identifier: string;
    timestamp: Date;
}

const requestSchema = new Schema<IRequest>({
    url: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
});

requestSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Request = model<IRequest>('Request', requestSchema);
