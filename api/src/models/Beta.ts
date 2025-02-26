import { Schema, model, Document } from 'mongoose';

interface IBetaKey {
    _id: Schema.Types.ObjectId;
    name: string;
    key: string;
    isActive: boolean;
    isExpired: boolean;
    expireAt: Date;
    user?: string;
    checkExpiration(): boolean;
}

interface IBeta extends Document {
    isEnabled: boolean;
    keys: IBetaKey[];
    createdAt: Date;
    updatedAt: Date;
    toggleBetaSystem(): void;
}

const betaKeySchema = new Schema<IBetaKey>({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    isExpired: { type: Boolean, default: false },
    expireAt: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

betaKeySchema.methods.checkExpiration = function (): boolean {
    return new Date() > this.expireAt;
};

const betaSchema = new Schema<IBeta>({
    isEnabled: { type: Boolean, default: true },
    keys: { type: [betaKeySchema], default: [] },
}, { timestamps: true });

betaSchema.methods.toggleBetaSystem = function (): void {
    this.isEnabled = !this.isEnabled;
};

export const Beta = model<IBeta>('Beta', betaSchema);
export const BetaKey = model<IBetaKey>('BetaKey', betaKeySchema);
