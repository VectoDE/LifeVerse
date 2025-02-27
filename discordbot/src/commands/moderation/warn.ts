import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Warn } from '../../models/Warn';
import { LogService } from '../../services/logService';
import { Command } from '../../functions/handleCommands';

const WarnCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('⚠️ Manage user warnings.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('➕ Warn a user')
                .addUserOption(option => option.setName('user').setDescription('👤 The user to warn').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('📝 The reason for the warning').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('📜 List all warnings for a user')
                .addUserOption(option => option.setName('user').setDescription('👤 The user to check warnings for').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('🗑️ Clear a specific warning or all warnings for a user')
                .addUserOption(option => option.setName('user').setDescription('👤 The user to clear warnings for').setRequired(true))
                .addStringOption(option =>
                    option.setName('identifier').setDescription('🔢 The identifier of the warning to clear (leave empty to clear all)'),
                ),
        ),

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
            const user = interaction.options.getUser('user');
            const guildId = interaction.guild.id;

            if (!user) {
                await interaction.editReply({
                    content: '⚠️ User not found.',
                });
                return;
            }

            if (subcommand === 'add') {
                const reason = interaction.options.getString('reason');
                if (!reason) {
                    await interaction.editReply({
                        content: '⚠️ Please provide a reason for the warning.',
                    });
                    return;
                }

                const warn = new Warn({
                    userId: user.id,
                    guildId,
                    reason,
                    moderatorId: interaction.user.id,
                    identifier: Math.random().toString(36).substring(2, 15),
                });

                await warn.save();

                const embed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('⚠️ User Warned')
                    .setDescription(`👤 **User:** ${user.tag}\n📝 **Reason:** ${reason}`)
                    .addFields(
                        {
                            name: '🔢 Warning ID',
                            value: `${warn.identifier}`,
                            inline: true,
                        },
                        {
                            name: '🛡️ Moderator',
                            value: `<@${warn.moderatorId}>`,
                            inline: true,
                        },
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                LogService.info(`⚠️ Warned user ${user.tag} in ${interaction.guild.name} for reason: ${reason}`);
            }

            if (subcommand === 'list') {
                const warns = await Warn.find({ userId: user.id, guildId });
                if (warns.length === 0) {
                    await interaction.editReply({
                        content: '✅ No warnings found for this user.',
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle(`📜 Warnings for ${user.tag}`)
                    .setDescription(
                        warns.map(warn => `• **📝 ${warn.reason}** (by <@${warn.moderatorId}>) - 🔢 ID: ||${warn.identifier}||`).join('\n'),
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

            if (subcommand === 'clear') {
                const identifier = interaction.options.getString('identifier');
                if (identifier) {
                    const result = await Warn.deleteOne({
                        userId: user.id,
                        guildId,
                        identifier,
                    });
                    if (result.deletedCount === 0) {
                        await interaction.editReply({
                            content: '❌ No warning found with the specified identifier.',
                        });
                        return;
                    }

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`🗑️ Warning Cleared`)
                        .setDescription(`🔢 **Warning ID:** ||${identifier}|| for 👤 **User:** ${user.tag} has been cleared.`)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });
                    LogService.info(`🗑️ Cleared warning ID ${identifier} for user ${user.tag} in ${interaction.guild.name}`);
                } else {
                    await Warn.deleteMany({ userId: user.id, guildId });
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`🗑️ Warnings Cleared`)
                        .setDescription(`✅ All warnings for 👤 **User:** ${user.tag} have been cleared.`)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });
                    LogService.info(`🗑️ Cleared all warnings for user ${user.tag} in ${interaction.guild.name}`);
                }
            }
        } catch (error) {
            LogService.error('❌ Error with warn command:', error);
            await interaction.editReply({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default WarnCommand;
