import { Schema, model, Document } from 'mongoose';

interface IBlog extends Document {
    image?: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
    image: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
    author: { type: String, required: true },
}, { timestamps: true });

export const Blog = model<IBlog>('Blog', blogSchema);
