import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { Poll } from '../../models/Poll';
import { LogService } from '../../services/logService';
import { Command } from '../../functions/handleCommands';
import { scheduleJob } from 'node-schedule';

const PollCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('📊 Create and manage polls.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('➕ Create a new poll')
                .addStringOption(option => option.setName('question').setDescription('❓ The poll question').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('📝 The poll description').setRequired(true)) // Beschreibung hinzufügen
                .addStringOption(option => option.setName('options').setDescription('📝 Comma-separated options (at least 2)').setRequired(true))
                .addIntegerOption(option => option.setName('duration').setDescription('⏳ Duration in minutes (required)').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('🛑 End an active poll')
                .addStringOption(option => option.setName('identifier').setDescription('🔢 The ID of the poll to end').setRequired(true)),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: '⚠️ This command can only be used in a server.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply();

        try {
            const subcommand = interaction.options.getSubcommand();
            const guildId = interaction.guild.id;

            if (subcommand === 'create') {
                const question = interaction.options.getString('question', true);
                const description = interaction.options.getString('description', true);
                const optionsInput = interaction.options.getString('options', true);
                const options = optionsInput.split(',').map(opt => opt.trim()).slice(0, 5);
                const duration = interaction.options.getInteger('duration', true);

                if (options.length < 2) {
                    await interaction.editReply('⚠️ Please provide at least two options.');
                    return;
                }

                const endsAt = new Date(Date.now() + duration * 60000);
                const identifier = Math.random().toString(36).substring(2, 15);

                const poll = new Poll({
                    identifier,
                    guildId,
                    question,
                    description,
                    options: options.map((option, index) => ({
                        id: index + 1,
                        text: option,
                        votes: 0,
                        customId: `poll-${identifier}-option-${index + 1}`,
                    })),
                    voters: [],
                    active: true,
                    createdBy: interaction.user.id,
                    endsAt,
                    createdAt: new Date(),
                });
                await poll.save();

                const actionRows: ActionRowBuilder<ButtonBuilder>[] = [];
                const chunkedOptions = [];
                while (options.length) {
                    chunkedOptions.push(options.splice(0, 5));
                }

                chunkedOptions.forEach(chunk => {
                    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        chunk.map((option, index) =>
                            new ButtonBuilder()
                                .setCustomId(`poll-${identifier}-option-${index + 1}`)
                                .setLabel(option)
                                .setStyle(ButtonStyle.Primary),
                        ),
                    );
                    actionRows.push(actionRow);
                });

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle(`📊 New Poll: ${question}`)
                    .setDescription(description)
                    .addFields(options.map((option, index) => ({ name: `🔹 Option ${index + 1}`, value: option })))
                    .setFooter({ text: `Poll ID: ${identifier}` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed], components: actionRows });
                LogService.info(`📊 Created poll in ${interaction.guild.name}: ${question}`);

                scheduleJob(endsAt, async () => {
                    if (!interaction.guild) return;

                    const poll = await Poll.findOne({ guildId, identifier, active: true });
                    if (!poll) return;

                    poll.active = false;
                    await poll.save();

                    const results = poll.options.map(opt => `🔹 **${opt.text}**: ${opt.votes} votes`).join('\n');
                    const resultEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('📊 Poll Ended')
                        .setDescription(`**${poll.question}**`)
                        .addFields({ name: '📜 Results', value: results || 'No votes recorded.' })
                        .setTimestamp();

                    if (interaction.channel && interaction.channel instanceof TextChannel) {
                        await interaction.channel.send({ embeds: [resultEmbed] });
                    }

                    LogService.info(`🛑 Automatically ended poll ${identifier} in ${(interaction.guild as { name: string }).name}`);
                });
            }

            if (subcommand === 'end') {
                const identifier = interaction.options.getString('identifier', true);
                const poll = await Poll.findOne({ guildId, identifier, active: true });
                if (!poll) {
                    await interaction.editReply('❌ Poll not found or already ended.');
                    return;
                }

                poll.active = false;
                await poll.save();

                const results = poll.options.map(opt => `🔹 **${opt.text}**: ${opt.votes} votes`).join('\n');
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('📊 Poll Ended')
                    .setDescription(`**${poll.question}**`)
                    .addFields({ name: '📜 Results', value: results || 'No votes recorded.' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                LogService.info(`🛑 Ended poll ${identifier} in ${interaction.guild.name}`);
            }
        } catch (error) {
            LogService.error('❌ Error with poll command:', error);
            await interaction.editReply('❌ An error occurred. Please try again later.');
        }
    },
};

export default PollCommand;
