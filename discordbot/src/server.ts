import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { IPTracking } from "./models/IP";
import { config } from "./config/config";

const server = express();

mongoose.connect(config.database.MONGO_URI, { })

server.use(express.json());

server.get("/get-ip", async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    try {
        const ipTracking = await IPTracking.findOne({ userId: userId as string }).sort({ timestamps: -1 });

        if (ipTracking) {
            return res.status(200).json({ ip: ipTracking.ip, timestamps: ipTracking.timestamps });
        } else {
            return res.status(404).json({ error: "IP address not found for this user" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error fetching IP address" });
    }
});

server.post("/save-ip", async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
    }

    try {
        const ip = req.ip;

        if (!ip) {
            return res.status(400).json({ error: "Unable to fetch IP address" });
        }

        let ipTracking = await IPTracking.findOne({ userId, ip });

        if (ipTracking) {
            ipTracking.timestamps.push(new Date());
            await ipTracking.save();
            return res.status(200).json({ message: "IP address already exists, timestamp added", ip });
        } else {
            ipTracking = new IPTracking({
                userId,
                ip,
                timestamps: [new Date()],
            });
            await ipTracking.save();
            return res.status(201).json({ message: "IP address saved successfully!", ip });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error saving IP address" });
    }
});

export default server;
