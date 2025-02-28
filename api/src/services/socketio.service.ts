import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import { User, IUser } from '../models/User';
import { Chat } from '../models/Chat';
import { logger } from '../services/logger.service';

export class SocketIOService {
    private io: Server;
    private users: Record<string, string> = {};
    private groups: Record<string, string[]> = {};

    constructor(io: Server) {
        this.io = io;
        this.setupListeners();
    }

    private setupListeners() {
        this.io.on('connection', (socket: Socket) => {
            logger.info(`User connected: ${socket.id}`);

            socket.on('join', this.handleJoin.bind(this, socket));
            socket.on('private-message', this.handlePrivateMessage.bind(this, socket));
            socket.on('create-group', this.handleCreateGroup.bind(this, socket));
            socket.on('join-group', this.handleJoinGroup.bind(this, socket));
            socket.on('group-message', this.handleGroupMessage.bind(this, socket));
            socket.on('disconnect', this.handleDisconnect.bind(this, socket));
        });
    }

    private async handleJoin(socket: Socket, username: string) {
        try {
            const user = new User({ username, socketId: socket.id });
            await user.save();
            this.users[socket.id] = username;
            logger.info(`User joined: ${username}`);
        } catch (error: any) {
            logger.error(`Error joining user:`, { error: error.message, stack: error.stack });
        }
    }

    private async handlePrivateMessage(socket: Socket, { to, message }: { to: string, message: string }) {
        try {
            const recipientSocketId = Object.keys(this.users).find(id => this.users[id] === to);
            if (recipientSocketId) {
                const sender = await User.findOne({ socketId: socket.id });
                const recipient = await User.findOne({ socketId: recipientSocketId });
    
                if (sender && recipient) {
                    let chat = await Chat.findOne({ participants: { $all: [sender._id, recipient._id] }, chatType: 'one-to-one' });
                    if (!chat) {
                        chat = new Chat({
                            participants: [sender._id, recipient._id],
                            chatType: 'one-to-one',
                            createdAt: new Date()
                        });
                        await chat.save();
                    }

                    const newMessage = {
                        sender: sender._id as mongoose.Types.ObjectId,
                        content: message,
                        timestamp: new Date()
                    };
                    chat.messages.push(newMessage);
                    await chat.save();
    
                    this.io.to(recipientSocketId).emit('private-message', {
                        from: sender.username,
                        message
                    });
                }
            }
        } catch (error: any) {
            logger.error(`Error handling private message:`, { error: error.message, stack: error.stack });
        }
    }

    private async handleCreateGroup(socket: Socket, groupName: string) {
        try {
            const groupChat = new Chat({
                participants: [socket.id],
                chatType: 'group',
                groupName,
                createdAt: new Date()
            });
            await groupChat.save();
            this.groups[groupName] = [socket.id];
            socket.join(groupName);
            logger.info(`Group created: ${groupName}`);
        } catch (error: any) {
            logger.error(`Error creating group:`, { error: error.message, stack: error.stack });
        }
    }

    private async handleJoinGroup(socket: Socket, groupName: string) {
        try {
            const group = await Chat.findOne({ groupName, chatType: 'group' });
            if (group) {
                const user = await User.findOne({ socketId: socket.id }) as IUser | null;
    
                if (user && user._id instanceof mongoose.Types.ObjectId) {
                    group.participants.push(user._id); 
                    await group.save();
                    socket.join(groupName);
                    logger.info(`${this.users[socket.id]} joined group: ${groupName}`);
                } else {
                    logger.info('User does not have a valid _id.');
                }
            }
        } catch (error: any) {
            logger.error(`Error joining group:`, { error: error.message, stack: error.stack });
        }
    }

    private async handleGroupMessage(socket: Socket, { groupName, message }: { groupName: string, message: string }) {
        try {
            const group = await Chat.findOne({ groupName, chatType: 'group' });
            if (group) {
                const sender = await User.findOne({ socketId: socket.id });
                if (sender) {
                    const newMessage = { sender: sender._id as mongoose.Types.ObjectId, content: message, timestamp: new Date() };
                    group.messages.push(newMessage);
                    await group.save();

                    this.io.to(groupName).emit('group-message', {
                        from: sender.username,
                        message
                    });
                }
            }
        } catch (error: any) {
            logger.error(`Error handling group message:`, { error: error.message, stack: error.stack });
        }
    }

    private async handleDisconnect(socket: Socket) {
        logger.info(`User disconnected: ${socket.id}`);
        await User.findOneAndDelete({ socketId: socket.id });
        delete this.users[socket.id];
    }
}
