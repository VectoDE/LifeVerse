import { Client, EmbedBuilder, GuildMember } from 'discord.js';
import { LogService } from '../services/logService';
import { Welcome } from '../models/Welcome';

export const handleWelcomeEvent = (client: Client) => {
    client.on('guildMemberAdd', async (member: GuildMember) => {
        try {
            const welcomeData = await Welcome.findOne({
                guildId: member.guild.id,
            });

            if (!welcomeData || !welcomeData.isEnabled) {
                return;
            }

            let embedData;

            if (welcomeData.embed && welcomeData.embed.title && welcomeData.embed.description) {
                embedData = welcomeData.embed;
            } else {
                embedData = {
                    title: `Welcome to the server, ${member.user.username}! 🎉`,
                    description:
                        `We're happy to see you at **${member.guild.name}**! 😄\n` +
                        `Take a look around, and don't forget to read the rules! 📜`,
                    fields: [
                        {
                            name: '👋 Say Hello!',
                            value: 'Come in and greet everyone!',
                            inline: true,
                        },
                        {
                            name: '📚 Read the Rules',
                            value: `The **[rules](https://discord.com/channels/${member.guild.id}/1341925164392124509)** are in the information section.`,
                            inline: true,
                        },
                        {
                            name: '🔔 Getting Active?',
                            value: 'Active members get great perks!',
                            inline: true,
                        },
                        {
                            name: '🛡️ Verification Required',
                            value: `Please complete the **[verification](https://discord.com/channels/${member.guild.id}/1342297124750102558)** process to get your roles.`,
                            inline: true,
                        },
                        {
                            name: '✅ Verified?',
                            value: `Once verified, you will be granted your roles in the **[Get Roles Channel](https://discord.com/channels/${member.guild.id}/1341925450531737690)**.`,
                            inline: true,
                        },
                    ],
                    footer: 'Welcome and have fun!',
                    timestamp: new Date(),
                };
            }

            const welcomeEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(embedData.title)
                .setDescription(embedData.description)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(embedData.fields || [])
                .setFooter({ text: embedData.footer })
                .setTimestamp(welcomeData.timestamp);

            const channel = member.guild.channels.cache.get(welcomeData.channelId);
            if (channel && channel.isTextBased()) {
                await channel.send({ embeds: [welcomeEmbed] });
            } else {
                LogService.error('No text channel found or the channel is invalid.');
            }

            const dmEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Welcome to LifeVerse!')
                .setDescription(
                    `Hey **${member.user.username}**! 🎉\n\n` +
                        `Welcome to **LifeVerse**, a world like no other! Here, you can experience life in a 1:1 scale with the real world.\n\n` +
                        `🔎 Explore our immersive environments and engage in endless activities.\n\n` +
                        `💡 Don’t forget to check the rules and start your journey in LifeVerse by visiting the [Rules](https://discord.com/channels/${member.guild.id}/1341925164392124509) and [Verification](https://discord.com/channels/${member.guild.id}/1342297124750102558) section!\n\n` +
                        `Feel free to reach out to any member if you need assistance!`,
                )
                .setFooter({
                    text: 'We hope you enjoy your stay in LifeVerse!',
                })
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] });
            LogService.info(`Sent DM to ${member.user.tag} with LifeVerse info.`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error in welcome message: ${errorMessage}`);
        }
    });
};
