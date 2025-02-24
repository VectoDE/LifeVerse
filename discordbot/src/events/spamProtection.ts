import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { LogService } from '../services/logService';
import { config } from '../config/config';
import { Kick } from '../models/Kick';
import { Ban } from '../models/Ban';

const messageCounts = new Map<string, { count: number; lastReset: number }>();
const MAX_MESSAGES = 20;
const INTERVAL = 5000;
const KICK_THRESHOLD = 50;
const MAX_KICKS = 3;

export const handleSpamProtection = (client: Client) => {
    client.on('messageCreate', async (message) => {
        if (!message.guild || message.author.bot) return;

        const userId = message.author.id;
        const now = Date.now();

        if (!messageCounts.has(userId)) {
            messageCounts.set(userId, { count: 1, lastReset: now });
        } else {
            const userData = messageCounts.get(userId)!;
            if (now - userData.lastReset > INTERVAL) {
                userData.count = 1;
                userData.lastReset = now;
            } else {
                userData.count++;
            }

            if (userData.count > MAX_MESSAGES) {
                LogService.warn(`Spam suspicion: ${message.author.tag} is sending too many messages!`);
                const warnEmbed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('⚠️ Possible spam detected')
                    .setDescription(`${message.author.tag} is sending unusually many messages in a short period.`)
                    .setTimestamp();

                const logChannel = client.channels.cache.get(config.channels.START_MESSAGE_CHANNEL_ID);
                if (logChannel && logChannel instanceof TextChannel) {
                    await logChannel.send({ embeds: [warnEmbed] });
                }
            }

            if (userData.count >= KICK_THRESHOLD) {
                LogService.error(`Kicking ${message.author.tag} due to spam behavior.`);
                const member = await message.guild.members.fetch(userId).catch(() => null);
                if (member) {
                    const kickCount = await Kick.countDocuments({ userId });
                    if (kickCount >= MAX_KICKS - 1) {
                        LogService.error(`Banning ${message.author.tag} after ${MAX_KICKS} kicks.`);
                        const banEmbed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('🚫 You have been banned')
                            .setDescription('You have been permanently banned from the server due to repeated spam violations.')
                            .setTimestamp();

                        await member.send({ embeds: [banEmbed] }).catch(() => {
                            LogService.warn(`Could not send DM to ${message.author.tag}.`);
                        });
                        await member.ban({ reason: 'Repeated spam behavior' }).catch(() => {
                            LogService.error(`Error banning ${message.author.tag}`);
                        });
                        await new Ban({
                            userId,
                            username: message.author.tag,
                            reason: 'Repeated spam behavior',
                            identifier: Math.random().toString(36).substring(2, 15),
                            timestamp: new Date(),
                        }).save();
                    } else {
                        const kickEmbed = new EmbedBuilder()
                            .setColor('Orange')
                            .setTitle('⚠️ You have been kicked')
                            .setDescription('You have been kicked from the server due to repeated spam. Please follow the rules to rejoin.')
                            .setTimestamp();

                        await member.send({ embeds: [kickEmbed] }).catch(() => {
                            LogService.warn(`Could not send DM to ${message.author.tag}.`);
                        });
                        await member.kick('Spam behavior').catch(() => {
                            LogService.error(`Error kicking ${message.author.tag}`);
                        });
                        await new Kick({
                            userId,
                            moderatorId: client.user?.id || 'System',
                            reason: 'Spam behavior',
                            identifier: Math.random().toString(36).substring(2, 15),
                            timestamp: new Date(),
                        }).save();
                    }
                }
            }
        }
    });
};
