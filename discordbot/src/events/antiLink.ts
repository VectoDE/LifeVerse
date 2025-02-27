import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { AntiLink } from '../models/AntiLink';
import { LogService } from '../services/logService';

export const handleMessageCreateEvent = (client: Client) => {
    client.on('messageCreate', async message => {
        try {
            if (message.author.bot || !message.guild) return;

            const settings = await AntiLink.findOne({ guildId: message.guild.id });
            if (!settings || !settings.enabled) return;

            if (!settings.isAllowedInChannel(message.channel.id)) {
                const linkRegex = /(https?:\/\/[^\s]+)/g;
                if (linkRegex.test(message.content)) {
                    await message.delete().catch(() => null);

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('🚫 Anti-Link System')
                        .setDescription(`⚠️ ${message.author}, links are not allowed in this channel!`)
                        .setTimestamp();

                    const channel = message.channel instanceof TextChannel ? message.channel : null;
                    if (channel) {
                        await channel.send({ embeds: [embed] });
                    }

                    LogService.info(
                        `Deleted a message with a link from ${message.author.tag} in ${message.guild.name}`
                    );
                }
            }
        } catch (error) {
            LogService.error(
                `❌ Error in anti-link event: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    });
};
