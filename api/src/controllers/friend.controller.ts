import { Request, Response, RequestHandler } from "express";
import { Friend } from "../models/Friend";
import { logger } from "../services/logger.service";

export const sendFriendRequest: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, friendId, guildId, buttonIds, buttonLabels } = req.body;

        if (!userId || !friendId) {
            logger.warn("Friend request failed: Missing required fields.");
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const existingRequest = await Friend.findOne({ userId, friendId });
        if (existingRequest) {
            logger.warn(`Friend request failed: Request between ${userId} and ${friendId} already exists.`);
            res.status(400).json({ message: "Friend request already exists" });
            return;
        }

        const friendRequest = new Friend({
            identifier: Math.random().toString(36).substring(2, 15),
            userId,
            friendId,
            guildId,
            status: "pending",
            buttonIds,
            buttonLabels,
        });

        await friendRequest.save();
        logger.info(`Friend request sent from ${userId} to ${friendId}.`);
        res.status(201).json({ message: "Friend request sent", friendRequest });
    } catch (error: any) {
        logger.error(`Friend request failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const respondToFriendRequest: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, friendId, status } = req.body;

        if (!userId || !friendId || !status) {
            logger.warn("Friend request response failed: Missing required fields.");
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        if (!["accepted", "rejected"].includes(status)) {
            logger.warn("Friend request response failed: Invalid status.");
            res.status(400).json({ message: "Invalid status" });
            return;
        }

        const friendRequest = await Friend.findOne({ userId: friendId, friendId: userId, status: "pending" });

        if (!friendRequest) {
            logger.warn(`Friend request response failed: No pending request from ${friendId} to ${userId}.`);
            res.status(404).json({ message: "No pending friend request found" });
            return;
        }

        friendRequest.status = status;
        await friendRequest.save();

        logger.info(`Friend request ${status} by ${userId} from ${friendId}.`);
        res.status(200).json({ message: `Friend request ${status}`, friendRequest });
    } catch (error: any) {
        logger.error(`Friend request response failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFriends: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const friends = await Friend.find({
            $or: [{ userId, status: "accepted" }, { friendId: userId, status: "accepted" }],
        });

        logger.info(`Fetched friends for user ${userId}.`);
        res.status(200).json(friends);
    } catch (error: any) {
        logger.error(`Fetching friends failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Internal server error" });
    }
};