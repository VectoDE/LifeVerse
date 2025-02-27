import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';

const UserInfoCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Show detailed information about a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to get information about').setRequired(false)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild?.members.fetch(user.id);

            if (!member) {
                await interaction.reply({
                    content: "❌ Couldn't fetch member information.",
                    ephemeral: true,
                });
                return;
            }

            const joinedAt = member.joinedAt ? member.joinedAt.toLocaleString() : 'Not available';
            const createdAt = user.createdAt.toLocaleString();
            const roles =
                member.roles.cache
                    .filter(role => role.id !== interaction.guild?.id)
                    .map(role => role.name)
                    .join(', ') || 'No roles';
            const status = member.presence?.status ?? 'Offline';

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${user.tag}'s Information`)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: '👤 Username', value: user.tag, inline: true },
                    { name: '💬 ID', value: `||${user.id}||`, inline: true },
                    {
                        name: '🗓️ Account Created',
                        value: createdAt,
                        inline: false,
                    },
                    {
                        name: '🕰️ Joined Server',
                        value: joinedAt,
                        inline: false,
                    },
                    { name: '💻 Status', value: status, inline: true },
                    { name: '🔰 Roles', value: roles, inline: false },
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            LogService.error('Error with userinfo command:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching user information.',
                ephemeral: true,
            });
        }
    },
};

export default UserInfoCommand;
