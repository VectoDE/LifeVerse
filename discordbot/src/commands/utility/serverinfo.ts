import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';

const ServerInfoCommand: Command = {
    data: new SlashCommandBuilder().setName('serverinfo').setDescription('Show detailed information about the server.'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const guild = interaction.guild;

            if (!guild) {
                await interaction.reply({
                    content: "❌ Couldn't fetch server information.",
                    ephemeral: true,
                });
                return;
            }

            const createdAt = guild.createdAt.toLocaleString();
            const owner = await guild.fetchOwner();
            const memberCount = guild.memberCount;
            const textChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
            const voiceChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
            const roles = guild.roles.cache.size;
            const boostCount = guild.premiumSubscriptionCount;
            const region = guild.preferredLocale;
            const verificationLevel = guild.verificationLevel;
            const emojisCount = guild.emojis.cache.size;
            const iconURL = guild.iconURL() || 'https://via.placeholder.com/512';

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${guild.name} Server Information`)
                .setThumbnail(iconURL)
                .addFields(
                    {
                        name: '👑 Server Owner',
                        value: owner.user.tag,
                        inline: true,
                    },
                    {
                        name: '🗓️ Server Created',
                        value: createdAt,
                        inline: true,
                    },
                    {
                        name: '👥 Member Count',
                        value: `${memberCount} members`,
                        inline: true,
                    },
                    {
                        name: '💬 Text Channels',
                        value: `${textChannels}`,
                        inline: true,
                    },
                    {
                        name: '🎙️ Voice Channels',
                        value: `${voiceChannels}`,
                        inline: true,
                    },
                    { name: '🛠️ Total Roles', value: `${roles}`, inline: true },
                    {
                        name: '🎉 Boost Count',
                        value: `${boostCount}`,
                        inline: true,
                    },
                    { name: '🌍 Region', value: region, inline: true },
                    {
                        name: '🔒 Verification Level',
                        value: verificationLevel.toString(),
                        inline: true,
                    },
                    {
                        name: '😀 Emojis Count',
                        value: `${emojisCount}`,
                        inline: true,
                    },
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            LogService.error('Error with serverinfo command:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching server information.',
                ephemeral: true,
            });
        }
    },
};

export default ServerInfoCommand;
