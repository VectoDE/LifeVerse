import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';

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

        res.status(201).json({ message: 'User created successfully', user: newUser });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getAllUsers: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(users);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ userId });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
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
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findOneAndDelete({ userId });

        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User deleted successfully' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
