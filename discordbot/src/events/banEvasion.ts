import axios from 'axios';
import { Client, GuildMember } from "discord.js";
import { IPTracking } from "../models/IP";
import { LogService } from "../services/logService";

export const handleBanEvasionEvent = (client: Client) => {
    client.on("guildMemberAdd", async (member: GuildMember) => {
        try {
            if (member.user.bot) return;

            const ip = await saveUserIp(member.id);

            if (!ip) {
                LogService.error(`Failed to fetch IP for user ${member.user.tag}`);
                return;
            }

            const ipRecord = await IPTracking.findOne({ ip: ip });

            if (ipRecord) {
                if (ipRecord.timestamps.length > 0) {
                    await member.ban({ reason: "Ban evasion detected." });

                    LogService.info(`Banned ${member.user.tag} for ban evasion with IP: ${ip}`);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Ban Error handling ban evasion: ${errorMessage}`);
        }
    });
};

const saveUserIp = async (userId: string): Promise<string | null> => {
    try {
        const response = await axios.post("http://localhost:3000/save-ip", {
            userId: userId,
        });

        return response.data.ip;
    } catch (error) {
        LogService.error(`Error fetching IP for ${userId}:`, error);
        return null;
    }
};
