import { Schema, model, Document } from "mongoose";

interface IKick extends Document {
    userId: string;
    moderatorId: string;
    reason: string;
    timestamp: Date;
}

const KickSchema = new Schema<IKick>({
    userId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Kick = model<IKick>("Kick", KickSchema);
