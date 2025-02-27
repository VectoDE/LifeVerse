import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    paymentMethod: string;
    amount: number;
    currency: string;
    paymentDate: Date;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    transactionId: { type: String, default: '' }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
