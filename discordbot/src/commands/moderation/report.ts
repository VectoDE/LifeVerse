import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { Report } from '../../models/Report';
import { LogService } from '../../services/logService';

const ReportCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Manage reports for users.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a report for a user.')
                .addUserOption(option => option.setName('reported-user').setDescription('The user being reported.').setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Reason for the report')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Abuse', value: 'Abuse' },
                            { name: 'Spam', value: 'Spam' },
                            { name: 'Cheating', value: 'Cheating' },
                            { name: 'Toxicity', value: 'Toxicity' },
                        ),
                )
                .addStringOption(option =>
                    option.setName('description').setDescription('Detailed description of the incident').setRequired(true),
                )
                .addStringOption(option =>
                    option.setName('media-url').setDescription('Optional URL for video or screenshot').setRequired(false),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all reports for a user.')
                .addUserOption(option => option.setName('user').setDescription('The user to list reports for.').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a report.')
                .addStringOption(option => option.setName('report-id').setDescription('The ID of the report to remove.').setRequired(true))
                .addStringOption(option =>
                    option.setName('identifier').setDescription('The identifier of the report to remove.').setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const reportedUser = interaction.options.getUser('reported-user');
            const reason = interaction.options.getString('reason');
            const description = interaction.options.getString('description');
            const mediaUrl = interaction.options.getString('media-url');

            if (!reportedUser || !reason || !description) {
                await interaction.reply({
                    content: '⚠️ Please provide valid arguments.',
                    ephemeral: true,
                });
                return;
            }

            const identifier = Math.random().toString(36).substring(2, 15);

            const newReport = new Report({
                userId: interaction.user.id,
                username: interaction.user.username,
                reportedUser: reportedUser.username,
                reason,
                description,
                mediaUrl,
                reporter: interaction.user.username,
                identifier,
                timestamp: new Date(),
            });

            await newReport.save();

            LogService.info(
                `Report added: ${interaction.user.username} reported ${reportedUser.username} for ${reason}. Description: ${description}. Media URL: ${mediaUrl || 'No media provided.'}`,
            );

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('🚨 Report Added')
                .setDescription(
                    `A report has been added for ${reportedUser.username}.\nReason: ${reason}\nDescription: ${description}\nMedia: ${mediaUrl || 'No media provided.'}`,
                )
                .addFields({
                    name: '🔑 Identifier',
                    value: `${identifier}`,
                    inline: true,
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'list') {
            const user = interaction.options.getUser('user');

            if (!PermissionsBitField.Flags.ManageMessages) {
                await interaction.reply({
                    content: `⚠️ You do not have the permissions to use this command.`,
                    ephemeral: true,
                });
            }

            if (!user) {
                await interaction.reply({
                    content: '⚠️ Please provide a valid user to list reports.',
                    ephemeral: true,
                });
                return;
            }

            const reports = await Report.find({ userId: user.id });

            if (reports.length === 0) {
                await interaction.reply({
                    content: `⚠️ No reports found for ${user.username}.`,
                    ephemeral: true,
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📋 Reports')
                .setDescription(
                    reports
                        .map(
                            report =>
                                `**Report ID:** ${report._id}\n**Reported User:** ${report.reportedUser}\n**Reason:** ${report.reason}\n**Time Added:** ${report.timestamp}\n**Description:** ${report.description}\n**Reporter:** ${report.reporter}\n**Media URL:** ${report.mediaUrl || 'No media provided.'}\n**Identifier:** ||${report.identifier}||\n`,
                        )
                        .join('\n'),
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'remove') {
            const reportId = interaction.options.getString('report-id');
            const identifier = interaction.options.getString('identifier');

            if (!reportId || !identifier) {
                await interaction.reply({
                    content: '⚠️ Please provide a valid report ID and identifier to remove.',
                    ephemeral: true,
                });
                return;
            }

            const report = await Report.findOneAndDelete({
                _id: reportId,
                identifier,
            });

            if (!report) {
                await interaction.reply({
                    content: `⚠️ No report found with ID ${reportId} and identifier ||${identifier}||.`,
                    ephemeral: true,
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Report Removed')
                .setDescription(`The report with ID ${reportId} and identifier ||${identifier}|| has been removed.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            LogService.info(`Report with ID ${reportId} and identifier ${identifier} removed`);
        }
    },
};

export default ReportCommand;
