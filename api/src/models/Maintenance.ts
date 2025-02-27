import { Schema, model, Document } from 'mongoose';

interface IMaintenance extends Document {
    isActive: boolean;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenance>({
    isActive: { type: Boolean, default: false },
    title: { type: String, default: 'Under Maintenance' },
    message: { type: String, default: 'The API is currently under maintenance. Please try again later.' },
}, { timestamps: true });

export const Maintenance = model<IMaintenance>('Maintenance', maintenanceSchema);
