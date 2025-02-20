import { Schema, model, Document } from "mongoose";

interface IIPTrackingDocument extends Document {
    userId: string;
    ip: string;
    timestamp: Date;
}

const ipTrackingSchema = new Schema<IIPTrackingDocument>({
    userId: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const IPTracking = model<IIPTrackingDocument>("IPTracking", ipTrackingSchema);
