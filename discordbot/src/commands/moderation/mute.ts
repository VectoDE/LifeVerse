import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { Mute } from '../../models/Mute';
import { LogService } from '../../services/logService';

const MuteCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Manage mutes.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Mute a user.')
                .addUserOption(option => option.setName('user').setDescription('The user to be muted').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason for muting').setRequired(false)),
        )
        .addSubcommand(subcommand => subcommand.setName('list').setDescription('Show all muted users.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove the mute from a user.')
                .addUserOption(option => option.setName('user').setDescription('The user to unmute').setRequired(true))
                .addStringOption(option =>
                    option.setName('identifier').setDescription('The identifier of the mute to remove').setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

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

            if (subcommand === 'add') {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason') || 'No reason provided';

                if (!user) {
                    interaction.editReply({ content: '❌ No user specified!' });
                    return;
                }

                const identifier = Math.random().toString(36).substring(2, 15);

                const muteEntry = new Mute({
                    userId: user.id,
                    username: user.username,
                    reason: reason,
                    identifier: identifier,
                    timestamp: new Date(),
                });

                await muteEntry.save();

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🚨 Mute Log')
                    .setDescription(`✅ **${user.tag}** has been muted.`)
                    .addFields(
                        { name: '📝 Reason', value: reason, inline: true },
                        {
                            name: '📅 Mute Time',
                            value: new Date().toLocaleString(),
                            inline: false,
                        },
                        {
                            name: '🔑 Identifier',
                            value: `${identifier}`,
                            inline: true,
                        },
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been muted. Reason: ${reason}`);
            } else if (subcommand === 'list') {
                const mutes = await Mute.find().sort({ timestamp: -1 }).limit(10);

                if (mutes.length === 0) {
                    interaction.editReply({
                        content: 'ℹ️ No muted users found.',
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('📋 Last 10 Mutes')
                    .setDescription(
                        mutes
                            .map(
                                mute =>
                                    `👤 **User:** ${mute.username}\n📝 **Reason:** ${mute.reason}\n📅 **Time:** ${mute.timestamp.toLocaleString()}\n🔑 **Identifier:** ||${mute.identifier}||\n—`,
                            )
                            .join('\n'),
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'remove') {
                const user = interaction.options.getUser('user');
                const identifier = interaction.options.getString('identifier');

                if (!user || !identifier) {
                    interaction.editReply({
                        content: '❌ No user or identifier specified!',
                    });
                    return;
                }

                const mute = await Mute.findOneAndDelete({
                    userId: user.id,
                    identifier,
                });

                if (!mute) {
                    interaction.editReply({
                        content: `ℹ️ No mute found for **${user.tag}** with the specified identifier.`,
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('✅ Mute Removed')
                    .setDescription(`The mute for **${user.tag}** has been removed.`)
                    .addFields(
                        { name: '📝 Reason', value: mute.reason, inline: true },
                        {
                            name: '📅 Mute Time',
                            value: mute.timestamp.toLocaleString(),
                            inline: false,
                        },
                        {
                            name: '🔑 Identifier',
                            value: `${mute.identifier}`,
                            inline: true,
                        },
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been unmuted. Mute ID: ${identifier}`);
            }
        } catch (error) {
            LogService.error('Error with mute command:', error);
            await interaction.editReply({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default MuteCommand;
