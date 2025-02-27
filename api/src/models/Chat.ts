import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: IMessage[];
    chatType: 'group' | 'one-to-one';
    groupName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage {
    sender: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new Schema<IChat>({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messageSchema],
    chatType: { type: String, enum: ['group', 'one-to-one'], required: true },
    groupName: { type: String },
}, { timestamps: true });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
