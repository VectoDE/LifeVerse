import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { AntiLink } from '../../models/AntiLink';
import { LogService } from '../../services/logService';
import { Command } from '../../functions/handleCommands';

const AntiLinkCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('antilink')
        .setDescription('Manage the Anti-Link system')
        .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable the Anti-Link system'))
        .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable the Anti-Link system'))
        .addSubcommand(subcommand => subcommand.setName('status').setDescription('Check the status of the Anti-Link system'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add-channel')
                .setDescription('Add a channel where links are allowed')
                .addChannelOption(option =>
                    option.setName('channel').setDescription('The channel where links will be allowed').setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-channel')
                .setDescription('Remove a channel from the allowed list')
                .addChannelOption(option =>
                    option.setName('channel').setDescription('The channel to remove from allowed channels').setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: '⚠️ This command can only be used in a server.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: false });

        try {
            const subcommand = interaction.options.getSubcommand();
            const guildId = interaction.guild.id;
            const channelId = interaction.options.getChannel('channel')?.id;
            const identifier = Math.random().toString(36).substring(2, 15);

            if (subcommand === 'enable') {
                await AntiLink.findOneAndUpdate({ guildId }, { enabled: true, identifier }, { upsert: true });

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('✅ Anti-Link Enabled')
                    .setDescription('The Anti-Link system has been successfully enabled!')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                LogService.info(`Anti-Link system enabled in guild: ${interaction.guild.name} with identifier ${identifier}`);
                return;
            }

            if (subcommand === 'disable') {
                await AntiLink.findOneAndUpdate({ guildId }, { enabled: false, identifier }, { upsert: true });

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Anti-Link Disabled')
                    .setDescription('The Anti-Link system has been successfully disabled.')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                LogService.info(`Anti-Link system disabled in guild: ${interaction.guild.name} with identifier ${identifier}`);
                return;
            }

            if (subcommand === 'status') {
                const settings = await AntiLink.findOne({
                    guildId,
                    identifier,
                });
                const status = settings?.enabled ? '✅ Active' : '❌ Disabled';

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('🔍 Anti-Link Status')
                    .setDescription(`Anti-Link system is currently: ${status}\n\nIdentifier: ||${identifier}||`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                return;
            }

            if (subcommand === 'add-channel') {
                if (!channelId) {
                    await interaction.editReply({
                        content: '⚠️ You must specify a valid channel to add.',
                    });
                    return;
                }

                const settings = await AntiLink.findOne({ guildId });
                if (settings) {
                    const allowedChannels = settings.allowedChannels;

                    if (allowedChannels.includes(channelId)) {
                        await interaction.editReply({
                            content: `⚠️ This channel is already in the allowed list.`,
                        });
                        return;
                    }

                    allowedChannels.push(channelId);
                    await settings.save();

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('✅ Channel Added')
                        .setDescription(`The channel <#${channelId}> has been successfully added to the allowed list.`)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });
                    LogService.info(
                        `Added channel <#${channelId}> to allowed channels in guild: ${interaction.guild.name} with identifier ${identifier}`,
                    );
                }
                return;
            }

            if (subcommand === 'remove-channel') {
                if (!channelId) {
                    await interaction.editReply({
                        content: '⚠️ You must specify a valid channel to remove.',
                    });
                    return;
                }

                const settings = await AntiLink.findOne({ guildId });
                if (settings) {
                    const allowedChannels = settings.allowedChannels;

                    if (!allowedChannels.includes(channelId)) {
                        await interaction.editReply({
                            content: `⚠️ This channel is not in the allowed list.`,
                        });
                        return;
                    }

                    const index = allowedChannels.indexOf(channelId);
                    if (index > -1) {
                        allowedChannels.splice(index, 1);
                    }

                    await settings.save();

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('✅ Channel Removed')
                        .setDescription(`The channel <#${channelId}> has been successfully removed from the allowed list.`)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });
                    LogService.info(
                        `Removed channel <#${channelId}> from allowed channels in guild: ${interaction.guild.name} with identifier ${identifier}`,
                    );
                }
                return;
            }
        } catch (error) {
            LogService.error('Error with anti-link command:', error);
            await interaction.editReply({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default AntiLinkCommand;
