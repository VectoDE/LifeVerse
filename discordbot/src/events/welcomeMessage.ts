import { Client, EmbedBuilder, GuildMember } from 'discord.js';
import { LogService } from '../services/logService';
import { Welcome } from '../models/Welcome';

export const handleWelcomeEvent = (client: Client) => {
    client.on('guildMemberAdd', async (member: GuildMember) => {
        try {
            const welcomeChannel = await Welcome.findOne({ guildId: member.guild.id });

            if (!welcomeChannel) {
                LogService.warn(`No welcome channel set for ${member.guild.name}.`);
                return;
            }

            const welcomeEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Welcome to the server, ${member.user.username}! 🎉`)
                .setDescription(`We're happy to see you at **${member.guild.name}**! 😄\n`
                    + `Take a look around, and don't forget to read the rules! 📜`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: '👋 Say Hello!', value: 'Come in and greet everyone!', inline: true },
                    { name: '📚 Read the Rules', value: 'The **[rules](https://discord.com/channels/${member.guild.id}/1341925164392124509)** are in the information section.', inline: true },
                    { name: '🔔 Getting Active?', value: 'Active members get great perks!', inline: true },
                    { name: '🛡️ Verification Required', value: 'Please complete the **[verification](https://discord.com/channels/${member.guild.id}/1342297124750102558)** process to get your roles.', inline: true },
                    { name: '✅ Verified?', value: 'Once verified, you will be granted your roles in the **[Get Roles Channel](https://discord.com/channels/${member.guild.id}/1341925450531737690)**.', inline: true },
                )
                .setFooter({ text: 'Welcome and have fun!' })
                .setTimestamp();

            const channel = member.guild.channels.cache.get(welcomeChannel.channelId);

            if (channel && channel.isTextBased()) {
                await channel.send({ embeds: [welcomeEmbed] });
                LogService.info(`Welcome message sent to ${member.user.tag}`);
            } else {
                LogService.error('No text channel found or the channel is invalid.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in welcome message: ${errorMessage}`);
        }
    });
};
