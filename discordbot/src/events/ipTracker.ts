import { Client } from "discord.js";
import axios from "axios";
import { IPTracking } from "../models/IP";
import { LogService } from "../services/logService";

export const handleIpTrackingEvent = (client: Client) => {
    client.on("messageCreate", async (message) => {
        try {
            if (message.author.bot) return;

            const ip = await getUserIp(message.author.id);

            if (ip) {
                const ipTracking = new IPTracking({
                    userId: message.author.id,
                    ip: ip,
                    timestamp: new Date(),
                });

                await ipTracking.save();
                LogService.info(`IP saved: ${ip} for user ${message.author.tag}`);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in IP tracking: ${errorMessage}`);
        }
    });
};

const getUserIp = async (userId: string): Promise<string | null> => {
    try {
        LogService.info(`Fetching IP for user: ${userId}`);
        const response = await axios.get(`https://api.lifeverse.com/get-ip?userId=${userId}`);
        return response.data.ip;
    } catch (error) {
        LogService.error(`Error fetching IP for ${userId}:`, error);
        return null;
    }
};
