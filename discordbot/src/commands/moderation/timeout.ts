import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Timeout } from '../../models/Timeout';
import { LogService } from '../../services/logService';
import { Command } from '../../functions/handleCommands';

const TimeoutCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('⏳ Manage timeouts for users.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('➕ Add a timeout to a user.')
                .addUserOption(option => option.setName('user').setDescription('👤 The user to timeout.').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('📄 The reason for the timeout.').setRequired(true))
                .addIntegerOption(option =>
                    option.setName('duration').setDescription('⏱️ The duration of the timeout in minutes.').setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('📋 List all timeouts for a user.')
                .addUserOption(option => option.setName('user').setDescription('👤 The user to list timeouts for.').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('❌ Remove a timeout from a user.')
                .addStringOption(option =>
                    option.setName('identifier').setDescription('🔑 The identifier of the timeout to remove.').setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const duration = interaction.options.getInteger('duration');

            if (!user || !reason || !duration) {
                await interaction.reply({
                    content: '⚠️ Please provide valid arguments.',
                    ephemeral: true,
                });
                return;
            }

            const identifier = Math.random().toString(36).substring(2, 15);

            const newTimeout = new Timeout({
                userId: user.id,
                username: user.username,
                reason,
                duration,
                timestamp: new Date(),
                identifier,
            });

            await newTimeout.save();

            const timeoutRole = interaction.guild?.roles.cache.find(role => role.name === 'Timeout');
            if (timeoutRole) {
                const member = await interaction.guild?.members.fetch(user.id);
                if (member) {
                    await member.roles.add(timeoutRole);
                    LogService.info(`⏳ Timeout role added to ${user.username}`);
                }
            } else {
                await interaction.reply({
                    content: '⚠️ The "Timeout" role does not exist. Please create the role before using this command.',
                    ephemeral: true,
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('⏱️ Timeout Added')
                .setDescription(
                    `🚨 **${user.username}** has been timed out for **${duration} minutes**.\n📄 **Reason:** ${reason}\n🔑 **Identifier:** ||${identifier}||`,
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            setTimeout(
                async () => {
                    await Timeout.findOneAndDelete({ identifier });

                    const member = await interaction.guild?.members.fetch(user.id);
                    if (member && timeoutRole) {
                        await member.roles.remove(timeoutRole);
                        LogService.info(`✅ Timeout role removed from ${user.username} after timeout expired.`);
                    }
                },
                duration * 60 * 1000,
            );
        } else if (subcommand === 'list') {
            const user = interaction.options.getUser('user');
            let timeouts;

            if (!user) {
                await interaction.reply({
                    content: '⚠️ Please provide a valid user.',
                    ephemeral: true,
                });
                return;
            }

            timeouts = await Timeout.find({ userId: user.id });

            if (timeouts.length === 0) {
                await interaction.reply({
                    content: '⚠️ No timeouts found for this user.',
                    ephemeral: true,
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📋 Current Timeouts')
                .setDescription(
                    timeouts
                        .map(
                            timeout =>
                                `🔑 **Identifier:** ||${timeout.identifier}|| 
👤 **User:** ${timeout.username} 
📄 **Reason:** ${timeout.reason} 
⏱️ **Duration:** ${timeout.duration} minutes 
🕒 **Time Added:** ${timeout.timestamp}`,
                        )
                        .join('\n'),
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'remove') {
            const identifier = interaction.options.getString('identifier');

            if (!identifier) {
                await interaction.reply({
                    content: '⚠️ Please provide a valid identifier to remove timeout.',
                    ephemeral: true,
                });
                return;
            }

            const timeout = await Timeout.findOneAndDelete({ identifier });

            if (!timeout) {
                await interaction.reply({
                    content: `⚠️ No timeout found with identifier ${identifier}.`,
                    ephemeral: true,
                });
                return;
            }

            const timeoutRole = interaction.guild?.roles.cache.find(role => role.name === 'Timeout');
            if (timeoutRole) {
                const member = await interaction.guild?.members.fetch(timeout.userId);
                if (member) {
                    await member.roles.remove(timeoutRole);
                    LogService.info(`✅ Timeout role removed from ${timeout.username} using identifier ${identifier}`);
                }
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Timeout Removed')
                .setDescription(`🚀 Timeout for **${timeout.username}** has been removed.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
};

export default TimeoutCommand;
