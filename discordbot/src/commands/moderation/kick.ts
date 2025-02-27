import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { Kick } from '../../models/Kick';
import { LogService } from '../../services/logService';

const KickCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Manage kicks')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a kick')
                .addUserOption(option => option.setName('user').setDescription('The kicked user').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('Reason for the kick').setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('list').setDescription('List the last 10 kicks'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

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
                const reason = interaction.options.getString('reason');

                if (!user || !reason) {
                    interaction.editReply({ content: '❌ Missing arguments!' });
                    return;
                }

                const identifier = Math.random().toString(36).substring(2, 15);

                const kickEntry = new Kick({
                    userId: user.id,
                    moderatorId: interaction.user.id,
                    reason: reason,
                    identifier: identifier,
                    timestamp: new Date(),
                });

                await kickEntry.save();

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🚨 Kick Log')
                    .setDescription(`✅ **${user.username}** has been kicked.`)
                    .addFields(
                        {
                            name: '👮 Moderator',
                            value: `<@${interaction.user.id}>`,
                            inline: true,
                        },
                        { name: '📝 Reason', value: reason, inline: true },
                        {
                            name: '📅 Time',
                            value: new Date().toLocaleString(),
                            inline: false,
                        },
                        {
                            name: '🔑 Identifier',
                            value: `||${identifier}||`,
                            inline: true,
                        },
                    )
                    .setTimestamp();

                LogService.info(`${user.username} has been kicked from ${interaction.user.username}`);

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'list') {
                const kicks = await Kick.find().sort({ timestamp: -1 }).limit(10);

                if (kicks.length === 0) {
                    interaction.editReply({ content: 'ℹ️ No kicks found.' });
                    return;
                }

                const embeds = [];

                for (const kick of kicks) {
                    const user = await interaction.client.users.fetch(kick.userId);
                    embeds.push(
                        new EmbedBuilder()
                            .setColor('Orange')
                            .setTitle('📋 Last 10 Kicks')
                            .setDescription(
                                `👤 **User:** ${user.username}\n👮 **Moderator:** <@${kick.moderatorId}>\n📝 **Reason:** ${kick.reason}\n📅 **Time:** ${kick.timestamp.toLocaleString()}\n🔑 **Identifier:** ||${kick.identifier}||\n—`, // Identifier anzeigen
                            )
                            .setTimestamp(),
                    );
                }

                await interaction.editReply({ embeds });
            }
        } catch (error) {
            LogService.error('Error with kick command:', error);
            await interaction.editReply({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default KickCommand;
