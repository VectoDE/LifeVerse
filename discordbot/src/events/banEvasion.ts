import axios from 'axios';
import { Client, GuildMember, EmbedBuilder } from 'discord.js';
import { IPTracking } from '../models/IP';
import { LogService } from '../services/logService';
import { config } from '../config/config';
import { Request } from '../models/Request';

const apiRequestUrl = config.apiRequests.REQUEST_API_BASE_URL;

export const handleBanEvasionEvent = (client: Client) => {
    client.on('guildMemberAdd', async (member: GuildMember) => {
        try {
            if (member.user.bot) return;

            const ip = await saveUserIp(member.id);

            if (!ip) {
                LogService.error(`Failed to fetch IP for user ${member.user.tag}`);
                return;
            }

            const isBanned = await IPTracking.exists({
                $or: [{ ip: ip }, { userId: member.id }],
                isBanned: true,
            });

            if (isBanned) {
                await member.ban({ reason: 'Ban evasion detected.' });
                LogService.info(`Banned ${member.user.tag} for ban evasion with IP: ${ip}`);

                try {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Ban Notification')
                        .setDescription(
                            `You have been banned from the server for attempting to evade a previous ban. If you believe this is a mistake, please contact the server administration.`,
                        )
                        .addFields(
                            {
                                name: 'Reason:',
                                value: 'Ban evasion attempt detected.',
                            },
                            {
                                name: 'Action Taken By:',
                                value: `${client.user?.tag} (Bot)`,
                            },
                            {
                                name: 'Unban Request:',
                                value: `If you believe this ban was a mistake, you can submit an unban request by typing \`/unban request\` in the bot chat. We will review your case, and you will receive updates on the status of your request.`,
                            },
                        )
                        .setFooter({ text: 'Ban evasion is not tolerated.' })
                        .setTimestamp();

                    await member.user.send({ embeds: [embed] });
                } catch (error: any) {
                    LogService.error(`Failed to send DM to ${member.user.tag}: ${error.message}`);
                }

                return;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error handling ban evasion: ${errorMessage}`);
        }
    });
};

const saveUserIp = async (userId: string): Promise<string | null> => {
    try {
        const response = await axios.post(`${apiRequestUrl}/save-ip`, {
            userId: userId,
        });

        await Request.create({
            url: `${apiRequestUrl}/save-ip`,
            type: 'POST',
            status: response.status === 200 ? 'success' : 'failed',
            identifier: Math.random().toString(36).substring(2, 15),
            timestamp: new Date(),
        });

        return response.data.ip;
    } catch (error) {
        LogService.error(`Error fetching IP for ${userId}:`, error);

        await Request.create({
            url: `${apiRequestUrl}/save-ip`,
            type: 'POST',
            status: 'failed',
            identifier: Math.random().toString(36).substring(2, 15),
            timestamp: new Date(),
        });

        return null;
    }
};
