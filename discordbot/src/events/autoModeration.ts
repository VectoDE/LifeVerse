import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { AutoModerationRule } from '../models/AutoModerationRule';
import { LogService } from '../services/logService';
import { Warn } from '../models/Warn';

export const handleAutoMessageRule = (client: Client) => {
    client.on('messageCreate', async message => {
        try {
            if (message.author.bot || !message.guild) return;

            const rules = await AutoModerationRule.find({ guildId: message.guild.id, enabled: true });

            for (const rule of rules) {
                if (rule.ruleType === 'badWords' && Array.isArray(rule.data)) {
                    if (rule.data.some(word => message.content.toLowerCase().includes(word))) {
                        await message.delete().catch(() => null);

                        const identifier = Math.random().toString(36).substring(2, 15);
                        const embed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('🚨 Auto-Moderation: Bad Word Detected')
                            .setDescription(`⚠️ ${message.author}, your message was removed due to inappropriate language.\n\nIf you have any questions, please contact support with the identifier **${identifier}**.`)
                            .setTimestamp();

                        const channel = message.channel instanceof TextChannel ? message.channel : null;
                        if (channel) {
                            await channel.send({ embeds: [embed] });
                        }

                        const warn = new Warn({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            reason: 'Bad Word',
                            moderatorId: client.user?.id || 'LifeVerse - Bot',
                            identifier,
                            timestamp: new Date(),
                        });
                        await warn.save();

                        LogService.info(
                            `Deleted a message from ${message.author.tag} in ${message.guild.name} due to bad word.`
                        );
                    }
                }

                if (rule.ruleType === 'spam' && typeof rule.data === 'number') {
                    const messages = (await message.channel.messages.fetch({ limit: rule.data })).filter(m => m.author.id === message.author.id);
                    if (messages.size >= rule.data) {
                        const identifier = Math.random().toString(36).substring(2, 15);
                        const embed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('🚨 Auto-Moderation: Spam Detection')
                            .setDescription(`⚠️ ${message.author}, please slow down. You sent too many messages.\n\nIf you have any questions, please contact support with the identifier **${identifier}**.`)
                            .setTimestamp();

                        const channel = message.channel instanceof TextChannel ? message.channel : null;
                        if (channel) {
                            await channel.send({ embeds: [embed] });
                        }

                        const warn = new Warn({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            reason: 'Spam',
                            moderatorId: client.user?.id || 'LifeVerse - Bot',
                            identifier,
                            timestamp: new Date(),
                        });
                        await warn.save();

                        LogService.info(
                            `Detected potential spam from ${message.author.tag} in ${message.guild.name}.`
                        );
                    }
                }

                if (rule.ruleType === 'massMentions' && typeof rule.data === 'number') {
                    if (message.mentions.users.size + message.mentions.roles.size >= rule.data) {
                        await message.delete().catch(() => null);

                        const identifier = Math.random().toString(36).substring(2, 15);
                        const embed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('🚨 Auto-Moderation: Mass Mentions')
                            .setDescription(`⚠️ ${message.author}, excessive mentions are not allowed.\n\nIf you have any questions, please contact support with the identifier **${identifier}**.`)
                            .setTimestamp();

                        const channel = message.channel instanceof TextChannel ? message.channel : null;
                        if (channel) {
                            await channel.send({ embeds: [embed] });
                        }

                        const warn = new Warn({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            reason: 'Mass Mentions',
                            moderatorId: client.user?.id || 'LifeVerse - Bot',
                            identifier,
                            timestamp: new Date(),
                        });
                        await warn.save();

                        LogService.info(
                            `Deleted a message from ${message.author.tag} in ${message.guild.name} due to mass mentions.`
                        );
                    }
                }

                if (rule.ruleType === 'capsLock' && typeof rule.data === 'number') {
                    const capsRatio = (message.content.replace(/[^A-Z]/g, '').length / message.content.length) * 100;
                    if (capsRatio >= rule.data) {
                        await message.delete().catch(() => null);

                        const identifier = Math.random().toString(36).substring(2, 15);
                        const embed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('🚨 Auto-Moderation: Caps Lock')
                            .setDescription(`⚠️ ${message.author}, please avoid excessive capital letters.\n\nIf you have any questions, please contact support with the identifier **${identifier}**.`)
                            .setTimestamp();

                        const channel = message.channel instanceof TextChannel ? message.channel : null;
                        if (channel) {
                            await channel.send({ embeds: [embed] });
                        }

                        const warn = new Warn({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            reason: 'Excessive Caps Lock',
                            moderatorId: client.user?.id || 'LifeVerse - Bot',
                            identifier,
                            timestamp: new Date(),
                        });
                        await warn.save();

                        LogService.info(
                            `Deleted a message from ${message.author.tag} in ${message.guild.name} due to excessive caps lock.`
                        );
                    }
                }
            }
        } catch (error) {
            LogService.error(
                `❌ Error in auto-moderation event: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    });
};
