import { ChatInputCommandInteraction, TextChannel, DMChannel } from 'discord.js';
import { CommandUsage } from '../models/CommandUsage';
import { LogService } from '../services/logService';

export const commandUsageEvent = async (interaction: ChatInputCommandInteraction) => {
    try {
        const { commandName, user, channel } = interaction;

        if (!channel) {
            throw new Error('Channel is null');
        }

        let channelName: string;

        if (channel instanceof TextChannel) {
            channelName = channel.name;
        } else if (channel instanceof DMChannel) {
            channelName = `DM Channel (${channel.id})`;
        } else {
            channelName = `Unknown Channel (${channel.id})`;
        }

        const commandUsage = new CommandUsage({
            commandName: commandName,
            userId: user.id,
            username: user.username,
            channelId: channel.id,
            identifier: Math.random().toString(36).substring(2, 15),
            timestamp: new Date(),
        });

        await commandUsage.save();
        console.info(`Command '${commandName}' executed by ${user.username} in channel ${channelName} at ${new Date().toISOString()}.`);
    } catch (error) {
        LogService.error('Error logging command usage:', error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'There was an error executing the command.',
            });
        } else if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error executing the command.',
            });
        }
    }
};
