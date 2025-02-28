import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import { logger } from '../services/logger.service';

export const createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            username,
            userId,
            socketId,
            accessToken,
            refreshToken,
            firstName,
            middleName,
            lastName,
            address,
        } = req.body;

        const userExists = await User.findOne({ userId });
        if (userExists) {
            logger.warn(`User creation failed: User with ID ${userId} already exists.`);
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const newUser = new User({
            username,
            userId,
            socketId,
            accessToken,
            refreshToken,
            firstName,
            middleName,
            lastName,
            address,
            chats: [],
            groups: [],
            apiKeys: [],
            payments: [],
        });

        await newUser.save();
        logger.info(`User created successfully: ${userId}`);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error: any) {
        logger.error(`User creation failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        logger.info('Fetched all users successfully.');
        res.status(200).json(users);
    } catch (error: any) {
        logger.error(`Fetching all users failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ userId });

        if (!user) {
            logger.warn(`User fetch failed: User with ID ${userId} not found.`);
            res.status(404).json({ message: 'User not found' });
            return;
        }

        logger.info(`Fetched user successfully: ${userId}`);
        res.status(200).json(user);
    } catch (error: any) {
        logger.error(`Fetching user by ID ${userId} failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const {
        username,
        socketId,
        accessToken,
        refreshToken,
        firstName,
        middleName,
        lastName,
        address,
    } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId },
            {
                username,
                socketId,
                accessToken,
                refreshToken,
                firstName,
                middleName,
                lastName,
                address,
            },
            { new: true }
        );

        if (!updatedUser) {
            logger.warn(`User update failed: User with ID ${userId} not found.`);
            res.status(404).json({ message: 'User not found' });
            return;
        }

        logger.info(`User updated successfully: ${userId}`);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error: any) {
        logger.error(`Updating user ${userId} failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findOneAndDelete({ userId });

        if (!deletedUser) {
            logger.warn(`User deletion failed: User with ID ${userId} not found.`);
            res.status(404).json({ message: 'User not found' });
            return;
        }

        logger.info(`User deleted successfully: ${userId}`);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        logger.error(`Deleting user ${userId} failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};
