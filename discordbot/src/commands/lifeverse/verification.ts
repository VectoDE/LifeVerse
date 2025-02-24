import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder, 
    PermissionsBitField 
} from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';
import { Verification } from '../../models/Verification';

const VerificationCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('verification')
        .setDescription('✅ Manage verifications')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('🚀 Start a verification'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('🔍 Check the verification status of a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('👤 The user you want to check.')
                        .setRequired(true),
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: '⚠️ This command can only be used in a server.',
                ephemeral: true,
            });
            return;
        }

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'start') {
                const modal = new ModalBuilder()
                    .setCustomId('verify_modal')
                    .setTitle('🔒 LifeVerse Verification')
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(
                            new TextInputBuilder()
                                .setCustomId('lifeVerseUrl')
                                .setLabel('🔗 LifeVerse Profile URL')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                                .setPlaceholder('🌐 Enter your LifeVerse profile URL'),
                        ),
                        new ActionRowBuilder<TextInputBuilder>().addComponents(
                            new TextInputBuilder()
                                .setCustomId('lifeVerseUsername')
                                .setLabel('📛 LifeVerse Username')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                                .setPlaceholder('✏️ Enter your LifeVerse username'),
                        ),
                    );

                await interaction.showModal(modal);
            } else if (subcommand === 'check') {
                await interaction.deferReply({ ephemeral: false });

                const user = interaction.options.getUser('user') || interaction.user;
                const isSelf = user.id === interaction.user.id;
                const hasPermission = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages);
            
                if (!isSelf && !hasPermission) {
                    await interaction.editReply({ content: '❌ You do not have permission to check other users!' });
                    return;
                }
            
                const verification = await Verification.findOne({ userId: user.id });
            
                if (!verification) {
                    await interaction.editReply({ content: `❌ ${user.username} is not verified!` });
                    return;
                }
            
                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle(`🔎 ${user.username}'s Verification Status`)
                    .setDescription(`📌 **Status:** ${verification.verified ? '✅ Verified' : '❌ Not Verified Yet'}`)
                    .addFields(
                        { name: '🛡️ Verified', value: verification.verified ? '✅ Yes' : '❌ No', inline: true },
                        { name: '🔑 Verification Code', value: `||\`${verification.code}\`||`, inline: true },
                        { name: '📅 Verification Timestamp', value: `🕒 ${verification.timestamp.toString()}`, inline: false },
                        { name: '🌐 LifeVerse Profile URL', value: `[🔗 Click here](${verification.lifeVerseUrl})`, inline: true },
                    )
                    .setFooter({ text: '🔄 Use /verification start to begin your verification!' })
                    .setTimestamp();
            
                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            LogService.error('❌ Error with verification command:', error);
            await interaction.reply({
                content: '🚨 An error occurred. Please try again later.',
                ephemeral: true,
            });
        }
    },
};

export default VerificationCommand;
