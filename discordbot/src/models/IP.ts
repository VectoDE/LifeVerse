import { Schema, model, Document } from "mongoose";

interface IPTrackingDocument extends Document {
    userId: string;
    ip: string;
    timestamp: Date;
}

const ipTrackingSchema = new Schema<IPTrackingDocument>({
    userId: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const IPTracking = model<IPTrackingDocument>("IPTracking", ipTrackingSchema);
