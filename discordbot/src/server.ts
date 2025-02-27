import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IPTracking } from './models/IP';
import { config } from './config/config';

const server = express();

mongoose.connect(config.database.MONGO_URI, {});

server.use(express.json());

server.post('/save-ip', async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }

    try {
        const ip = req.ip;

        if (!ip) {
            return res.status(400).json({ error: 'Unable to fetch IP address' });
        }

        let ipTracking = await IPTracking.findOne({ userId, ip });

        if (ipTracking) {
            ipTracking.timestamps.push(new Date());
            await ipTracking.save();
            return res.status(200).json({
                message: 'IP address already exists, timestamp added',
                ip,
                identifier: ipTracking.identifier,
            });
        } else {
            ipTracking = new IPTracking({
                userId,
                ip,
                isBanned: false,
                identifier: Math.random().toString(36).substring(2, 15),
                timestamps: [new Date()],
            });
            await ipTracking.save();
            return res.status(201).json({
                message: 'IP address saved successfully!',
                ip,
                identifier: ipTracking.identifier,
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error saving IP address' });
    }
});

server.patch('/update-ip-ban-status', async (req: Request, res: Response) => {
    const { userId, ip, isBanned } = req.body;

    if (typeof isBanned !== 'boolean') {
        return res.status(400).json({ error: 'isBanned must be a boolean (true/false)' });
    }

    if (!userId && !ip) {
        return res.status(400).json({ error: 'Either userId or IP is required' });
    }

    try {
        const filter = userId ? { userId } : { ip };
        const result = await IPTracking.updateMany(filter, { isBanned });

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'No matching records found' });
        }

        return res.status(200).json({
            message: `Updated ${result.modifiedCount} records`,
            isBanned,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating ban status' });
    }
});

server.get('/list-tracked-ips', async (_req: Request, res: Response) => {
    try {
        const ipRecords = await IPTracking.find({}, { _id: 0, __v: 0 });

        if (ipRecords.length === 0) {
            return res.status(404).json({ message: 'No IP tracking data found' });
        }

        return res.status(200).json(ipRecords);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving IP tracking data' });
    }
});

export default server;
