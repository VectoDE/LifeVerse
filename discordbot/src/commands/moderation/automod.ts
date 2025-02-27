import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { AutoModerationRule } from '../../models/AutoModerationRule';
import { Command } from '../../functions/handleCommands';

const AutoModerationCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('🔧 Manage Auto-Moderation rules')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('➕ Add an auto-moderation rule')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('🛑 Rule type')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Bad Words (Letters)', value: 'badWords' },
                            { name: 'Spam Detection (Number)', value: 'spam' },
                            { name: 'Mass Mentions (Number)', value: 'massMentions' },
                            { name: 'Caps Lock (Number)', value: 'capsLock' },
                        ))
                .addStringOption(option =>
                    option.setName('data')
                        .setDescription('🔢 Rule data (comma-separated words or a number)')
                        .setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('🗑️ Remove an auto-moderation rule')
                .addStringOption(option =>
                    option.setName('identifier')
                        .setDescription('🔑 The unique identifier of the rule')
                        .setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('📜 List all auto-moderation rules'),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const guildId = interaction.guild?.id;
        if (!guildId) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const type = interaction.options.getString('type', true) as 'badWords' | 'spam' | 'massMentions' | 'capsLock';
            const dataInput = interaction.options.getString('data', true);
            const data = type === 'badWords' ? dataInput.split(',').map(w => w.trim().toLowerCase()) : parseInt(dataInput, 10);

            const rule = new AutoModerationRule({
                identifier: Math.random().toString(36).substring(2, 15),
                guildId,
                ruleType: type,
                data,
                enabled: true
            });
            await rule.save();

            await interaction.editReply(`✅ Auto-moderation rule for \`${type}\` added.`);
        } 
        else if (subcommand === 'remove') {
            const identifier = interaction.options.getString('identifier', true);
            const rule = await AutoModerationRule.findOneAndDelete({ guildId, identifier });

            if (!rule) {
                await interaction.editReply('⚠️ No rule found with the given identifier.');
                return;
            }

            await interaction.editReply(`🗑️ Auto-moderation rule with identifier \`${identifier}\` removed.`);
        } 
        else if (subcommand === 'list') {
            const rules = await AutoModerationRule.find({ guildId });

            if (!rules.length) {
                await interaction.editReply('⚠️ No auto-moderation rules set.');
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('🔧 Auto-Moderation Rules')
                .setColor('Blue')
                .setDescription(rules.map(r => `**${r.ruleType}**: ${Array.isArray(r.data) ? r.data.join(', ') : r.data} (ID: \`${r.identifier}\`)`).join('\n'))
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    },
};

export default AutoModerationCommand;
