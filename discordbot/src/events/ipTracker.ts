import { Client, VoiceState } from "discord.js";
import axios from "axios";
import { LogService } from "../services/logService";

export const handleIpTrackingEvent = (client: Client) => {
    client.on("messageCreate", async (message) => {
        try {
            if (message.author.bot) return;

            const ip = await fetchUserIp(message.author.id);

            if (!ip) {
                LogService.error(`Failed to save IP for user ${message.author.tag}`);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in IP tracking: ${errorMessage}`);
        }
    });

    client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
        try {
            const member = newState.member;
            if (!member || member.user.bot) return;

            if (newState.channelId && !oldState.channelId) {
                const ip = await fetchUserIp(member.id);
                
                if (!ip) {
                    LogService.error(`Failed to save IP for user ${member.user.tag} who joined the voice channel`);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in voice state update: ${errorMessage}`);
        }
    });

    client.on("interactionCreate", async (interaction) => {
        try {
            if (!interaction.isButton()) return;

            const ip = await fetchUserIp(interaction.user.id);

            if (!ip) {
                LogService.error(`Failed to save IP for user ${interaction.user.tag} who interacted with a button`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in interaction tracking: ${errorMessage}`);
        }
    });
};

const fetchUserIp = async (userId: string): Promise<string | null> => {
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
