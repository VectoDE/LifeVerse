import mongoose, { Schema, Document } from 'mongoose';

export interface IApiKey extends Document {
    name: string;
    key: string;
    user: mongoose.Types.ObjectId;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deactivate: () => Promise<void>;
    isExpired: () => boolean;
}

const apiKeySchema = new Schema<IApiKey>({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

apiKeySchema.methods.deactivate = async function () {
    this.isActive = false;
    await this.save();
};

apiKeySchema.methods.isExpired = function (): boolean {
    return new Date() > this.expiresAt;
};

export const ApiKey = mongoose.model<IApiKey>('ApiKey', apiKeySchema);
