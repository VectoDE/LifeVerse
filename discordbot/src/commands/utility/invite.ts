import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';

const InviteCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get an invite link to add the bot to your server.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.CreateInstantInvite),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const botInviteLink = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user?.id}&scope=bot&permissions=8`;

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📩 Bot Invite Link')
                .setDescription(`Click the link below to invite me to your server!`)
                .addFields({
                    name: 'Invite Link',
                    value: botInviteLink,
                    inline: true,
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            LogService.error('Error with invite command:', error);
            await interaction.reply({
                content: '❌ An error occurred while generating the invite link. Please try again later.',
                ephemeral: true,
            });
        }
    },
};

export default InviteCommand;
