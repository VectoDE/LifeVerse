import { Request, Response, RequestHandler } from "express";
import { Verification } from "../models/Verification";
import { logger } from "../services/logger.service";

export const createVerification: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, guildId, lifeVerseUrl, lifeVerseUsername, code } = req.body;

        if (!userId || !code || !lifeVerseUrl || !lifeVerseUsername) {
            logger.warn("Verification creation failed: Missing required fields.");
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const existingVerification = await Verification.findOne({ userId });

        if (existingVerification) {
            logger.warn(`Verification creation failed: User with ID ${userId} already has a pending verification.`);
            res.status(400).json({ message: "User already has a pending verification" });
            return;
        }

        const verification = new Verification({
            identifier: Math.random().toString(36).substring(2, 15),
            userId,
            guildId,
            lifeVerseUrl,
            lifeVerseUsername,
            code,
        });

        await verification.save();
        logger.info(`Verification created successfully for user ${userId}`);
        res.status(201).json({ message: "Verification created", verification });
    } catch (error: any) {
        logger.error(`Verification creation failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, code } = req.body;

        if (!userId || !code) {
            logger.warn("Verification failed: Missing required fields.");
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const verification = await Verification.findOne({ userId, code });

        if (!verification) {
            logger.warn(`Verification failed: Invalid verification code for user ${userId}.`);
            res.status(400).json({ message: "Invalid verification code" });
            return;
        }

        if (verification.verified) {
            logger.warn(`Verification failed: User ${userId} is already verified.`);
            res.status(400).json({ message: "User is already verified" });
            return;
        }

        verification.verified = true;
        await verification.save();

        logger.info(`User ${userId} successfully verified.`);
        res.status(200).json({ message: "Verification successful", verification });
    } catch (error: any) {
        logger.error(`User verification failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getVerificationStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const verification = await Verification.findOne({ userId });

        if (!verification) {
            logger.warn(`Fetching verification status failed: No verification found for user ${userId}.`);
            res.status(404).json({ message: "Verification not found" });
            return;
        }

        logger.info(`Fetched verification status successfully for user ${userId}.`);
        res.status(200).json({ verified: verification.verified });
    } catch (error: any) {
        logger.error(`Fetching verification status failed: ${error.message}`, { stack: error.stack });
        res.status(500).json({ message: "Internal server error" });
    }
};
