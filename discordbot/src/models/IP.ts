import { Schema, model, Document } from "mongoose";

interface IIPTrackingDocument extends Document {
    userId: string;
    ip: string;
    isBanned: Boolean;
    timestamps: Date[];
}

const ipTrackingSchema = new Schema<IIPTrackingDocument>({
    userId: { type: String, required: true },
    ip: { type: String, required: true },
    isBanned: { type: Boolean, required: false },
    timestamps: { type: [Date], default: [] },
});

ipTrackingSchema.index({ userId: 1, ip: 1 }, { unique: true });

export const IPTracking = model<IIPTrackingDocument>("IPTracking", ipTrackingSchema);
