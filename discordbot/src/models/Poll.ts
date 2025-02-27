import { Schema, model, Document } from 'mongoose';

interface PollOption {
    id: number;
    text: string;
    votes: number;
    customId: string;
}

interface IPoll extends Document {
    identifier: string;
    guildId: string;
    question: string;
    description: string;
    options: PollOption[];
    voters: string[];
    active: boolean;
    createdBy: string;
    endsAt: Date;
    createdAt: Date;
}

const PollSchema = new Schema<IPoll>({
    identifier: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    question: { type: String, required: true },
    description: { type: String, required: true },
    options: [{
        id: { type: Number, required: true },
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
        customId: { type: String, required: true },
    }],
    voters: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    endsAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

PollSchema.pre('save', function (next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Poll = model<IPoll>('Poll', PollSchema);
