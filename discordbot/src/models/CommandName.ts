import { Schema, model, Document } from 'mongoose';

export interface ICommandName extends Document {
    commandName: string;
    users: {
        userId: string;
        username: string;
        identifier: string;
        timestamp: Date;
    }[];
}

const commandNameSchema = new Schema<ICommandName>({
    commandName: { type: String, required: true, unique: true },
    users: [{
        userId: { type: String, required: true },
        username: { type: String, required: true },
        identifier: { type: String, required: true, unique: true },
        timestamp: { type: Date, default: Date.now }
    }],
});

commandNameSchema.pre('save', function (next) {
    this.users.forEach((user) => {
        if (!user.identifier) {
            user.identifier = Math.random().toString(36).substring(2, 15);
        }
    });

    const userIds = this.users.map(user => user.userId);
    this.users = this.users.filter((user, index) => userIds.indexOf(user.userId) === index);
    next();
});

export const CommandName = model<ICommandName>('CommandName', commandNameSchema);
