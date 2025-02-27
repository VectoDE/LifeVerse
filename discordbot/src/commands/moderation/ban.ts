import axios from 'axios';
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { Ban } from '../../models/Ban';
import { LogService } from '../../services/logService';
import { config } from '../../config/config';
import { Request } from '../../models/Request';

const apiRequestUrl = config.apiRequests.REQUEST_API_BASE_URL;

const BanCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Manage bans.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Ban a user.')
                .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),
        )
        .addSubcommand(subcommand => subcommand.setName('list').setDescription('Show all banned users.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Unban a user.')
                .addUserOption(option => option.setName('user').setDescription('The user to unban').setRequired(true))
                .addStringOption(
                    option => option.setName('identifier').setDescription('The identifier of the ban to remove').setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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

                await Ban.create({
                    userId: user.id,
                    username: user.username,
                    reason: reason,
                    timestamp: new Date(),
                    identifier,
                });

                try {
                    const res = await axios.patch(`${apiRequestUrl}/update-ip-ban-status`, {
                        userId: user.id,
                        isBanned: true,
                    });

                    await Request.create({
                        url: `${apiRequestUrl}/update-ip-ban-status`,
                        type: 'PATCH',
                        status: res.status === 200 ? 'success' : 'failed',
                        identifier: identifier,
                        timestamp: new Date(),
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('🚨 Ban Log')
                        .setDescription(`✅ **${user.tag}** has been banned.`)
                        .addFields(
                            { name: '📝 Reason', value: reason, inline: true },
                            {
                                name: '📅 Ban Date',
                                value: new Date().toLocaleString(),
                                inline: false,
                            },
                            {
                                name: '🆔 Ban ID',
                                value: `||${identifier}||`,
                                inline: true,
                            },
                        )
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });

                    LogService.info(`User ${user.tag} has been banned. Reason: ${reason}`);
                } catch (error) {
                    await Request.create({
                        url: `${apiRequestUrl}/update-ip-ban-status`,
                        type: 'PATCH',
                        status: 'failed',
                        identifier: identifier,
                        timestamp: new Date(),
                    });

                    LogService.error('Error while making the API request for ban:', error);
                    interaction.editReply({
                        content: '❌ An error occurred while banning the user. Please try again later.',
                    });
                }
            } else if (subcommand === 'list') {
                const bans = await Ban.find().sort({ timestamp: -1 }).limit(10);

                if (bans.length === 0) {
                    interaction.editReply({
                        content: 'ℹ️ No banned users found.',
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('📋 Last 10 Bans')
                    .setDescription(
                        bans
                            .map(
                                ban =>
                                    `👤 **User:** ${ban.username}\n📝 **Reason:** ${ban.reason}\n📅 **Time:** ${ban.timestamp.toLocaleString()}\n🆔 **Ban ID:** ${ban.identifier}\n—`, // Zeigt den Identifier in der Liste
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

                const ban = await Ban.findOneAndDelete({
                    userId: user.id,
                    identifier,
                });

                if (!ban) {
                    interaction.editReply({
                        content: `ℹ️ The user **${user.tag}** is not banned with the specified identifier.`,
                    });
                    return;
                }

                try {
                    const res = await axios.patch(`${apiRequestUrl}/update-ip-ban-status`, {
                        userId: user.id,
                        isBanned: false,
                    });

                    await Request.create({
                        url: `${apiRequestUrl}/update-ip-ban-status`,
                        type: 'PATCH',
                        status: res.status === 200 ? 'success' : 'failed',
                        identifier: identifier,
                        timestamp: new Date(),
                    });

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('✅ Ban Removed')
                        .setDescription(`The ban for **${user.tag}** has been removed.`)
                        .addFields(
                            { name: '📝 Reason', value: ban.reason, inline: true },
                            {
                                name: '📅 Ban Date',
                                value: ban.timestamp.toLocaleString(),
                                inline: false,
                            },
                            {
                                name: '🆔 Ban ID',
                                value: ban.identifier,
                                inline: true,
                            },
                        )
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });

                    LogService.info(`User ${user.tag} has been unbanned.`);
                } catch (error) {
                    await Request.create({
                        url: `${apiRequestUrl}/update-ip-ban-status`,
                        type: 'PATCH',
                        status: 'failed',
                        identifier: identifier,
                        timestamp: new Date(),
                    });

                    LogService.error('Error while making the API request for unban:', error);
                    interaction.editReply({
                        content: '❌ An error occurred while removing the ban. Please try again later.',
                    });
                }
            }
        } catch (error) {
            LogService.error('Error with ban command:', error);
            await interaction.editReply({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default BanCommand;
