import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../functions/handleCommands';

const ClearCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages or commands.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('messages')
                .setDescription('Delete messages.')
                .addStringOption(option =>
                    option
                        .setName('amount')
                        .setDescription('Number of messages to delete')
                        .setRequired(true)
                        .addChoices(
                            { name: 'All', value: 'all' },
                            ...Array.from({ length: 24 }, (_, i) => ({
                                name: `${i + 1}`,
                                value: `${i + 1}`,
                            })),
                        ),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('commands')
                .setDescription('Delete commands.')
                .addStringOption(option =>
                    option
                        .setName('amount')
                        .setDescription('Number of commands to delete')
                        .setRequired(true)
                        .addChoices(
                            { name: 'All', value: 'all' },
                            ...Array.from({ length: 24 }, (_, i) => ({
                                name: `${i + 1}`,
                                value: `${i + 1}`,
                            })),
                        ),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: '⚠️ This command can only be used on a server.',
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            content: 'Processing your request...',
            ephemeral: true,
        });

        try {
            const subcommand = interaction.options.getSubcommand();
            const amountOption = interaction.options.getString('amount');

            if (!amountOption) {
                await interaction.followUp({
                    content: '❌ The amount must be specified.',
                });
                return;
            }

            const customAmount = parseInt(amountOption);
            if (customAmount && customAmount >= 1 && customAmount <= 100) {
                if (subcommand === 'messages') {
                    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) return;
                    const messages = await interaction.channel.messages.fetch({
                        limit: customAmount,
                    });
                    await interaction.channel.bulkDelete(messages);

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🧹 Messages deleted')
                        .setDescription(`${customAmount} messages have been deleted.`)
                        .setTimestamp();

                    await interaction.followUp({ embeds: [embed] });
                } else if (subcommand === 'commands') {
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🧹 Commands deleted')
                        .setDescription(`${customAmount} commands have been deleted (this is a placeholder).`)
                        .setTimestamp();

                    await interaction.followUp({ embeds: [embed] });
                }
            } else if (amountOption === 'all') {
                if (subcommand === 'messages') {
                    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) return;
                    const messages = await interaction.channel.messages.fetch();
                    await interaction.channel.bulkDelete(messages);

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🧹 All messages deleted')
                        .setDescription('All messages have been deleted.')
                        .setTimestamp();

                    await interaction.followUp({ embeds: [embed] });
                } else if (subcommand === 'commands') {
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🧹 All commands deleted')
                        .setDescription('All commands have been deleted (this is a placeholder).')
                        .setTimestamp();

                    await interaction.followUp({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.error('Error with clear command:', error);
            await interaction.followUp({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default ClearCommand;
