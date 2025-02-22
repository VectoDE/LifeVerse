import axios from 'axios';
import {
    Client,
    VoiceState,
    Message,
    GuildMember,
    PartialGuildMember,
    Interaction,
    MessageReaction,
    User,
    PartialMessageReaction,
    PartialUser,
} from 'discord.js';
import { LogService } from '../services/logService';
import { config } from '../config/config';
import { Request } from '../models/Request';

const apiRequestUrl = config.apiRequests.REQUEST_API_BASE_URL;

export const handleIpTrackingEvent = (client: Client) => {
    client.on('messageCreate', async (message: Message) => {
        try {
            if (message.author.bot) return;

            const ip = await saveUserIp(message.author.id);

            if (!ip) {
                LogService.error(`Failed to save IP for user ${message.author.tag}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in IP tracking: ${errorMessage}`);
        }
    });

    client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
        try {
            const member = newState.member;
            if (!member || member.user.bot) return;

            if (newState.channelId && !oldState.channelId) {
                const ip = await saveUserIp(member.id);

                if (!ip) {
                    LogService.error(`Failed to save IP for user ${member.user.tag} who joined the voice channel`);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in voice state update: ${errorMessage}`);
        }
    });

    client.on('interactionCreate', async (interaction: Interaction) => {
        try {
            if (interaction.isCommand()) {
                const ip = await saveUserIp(interaction.user.id);

                if (!ip) {
                    LogService.error(`Failed to save IP for user ${interaction.user.tag} who executed a command`);
                }
            }

            if (interaction.isModalSubmit()) {
                const ip = await saveUserIp(interaction.user.id);

                if (!ip) {
                    LogService.error(`Failed to save IP for user ${interaction.user.tag} who submitted a modal`);
                }
            }

            if (interaction.isButton()) {
                const ip = await saveUserIp(interaction.user.id);

                if (!ip) {
                    LogService.error(`Failed to save IP for user ${interaction.user.tag} who interacted with a button`);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in interaction tracking: ${errorMessage}`);
        }
    });

    client.on('guildMemberAdd', async (member: GuildMember) => {
        try {
            if (member.user.bot) return;

            const ip = await saveUserIp(member.id);

            if (!ip) {
                LogService.error(`Failed to save IP for user ${member.user.tag} who joined the guild`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in guild member add tracking: ${errorMessage}`);
        }
    });

    client.on('guildMemberUpdate', async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
        try {
            if (oldMember.user.bot || newMember.user.bot) return;

            function isGuildMember(member: GuildMember | PartialGuildMember): member is GuildMember {
                return (member as GuildMember).roles !== undefined;
            }

            if (isGuildMember(oldMember)) {
                const ip = await saveUserIp(newMember.id);

                if (!ip) {
                    LogService.error(`Failed to save IP for user ${newMember.user.tag} who updated their profile`);
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in guild member update tracking: ${errorMessage}`);
        }
    });

    client.on('messageReactionAdd', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
        try {
            if (user.bot) return;

            if (!(reaction instanceof MessageReaction)) return;

            const ip = await saveUserIp(user.id);

            if (!ip) {
                LogService.error(`Failed to save IP for user ${user.tag} who reacted to a message`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in message reaction add tracking: ${errorMessage}`);
        }
    });

    client.on('messageCreate', async (message: Message) => {
        try {
            if (message.author.bot) return;

            if (message.mentions.users.size > 0) {
                message.mentions.users.forEach(async user => {
                    const ip = await saveUserIp(user.id);

                    if (!ip) {
                        LogService.error(`Failed to save IP for user ${user.tag} who was mentioned in a message`);
                    }
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in message create tracking: ${errorMessage}`);
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
