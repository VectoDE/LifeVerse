import { Client, EmbedBuilder, PermissionsBitField, TextChannel, OAuth2Scopes } from 'discord.js';
import { registerCommands } from '../functions/register';
import { LogService } from '../services/logService';
import { config } from '../config/config';

let startMessage: any;

export const handleReadyEvent = (client: Client) => {
    client.on('ready', async () => {
        try {
            LogService.info(`${client.user?.tag} is ready and online!`);

            const inviteLink = client.generateInvite({
                permissions: [PermissionsBitField.Flags.Administrator],
                scopes: [OAuth2Scopes.Bot],
            });
            LogService.info(`Invite Link: ${inviteLink}`);

            const activities = [
                {
                    name: 'LifeVerse',
                    type: 0,
                    url: 'https://download.lifeverse.com',
                }, // Playing
                {
                    name: 'to Members',
                    type: 3,
                    url: 'https://open.spotify.com',
                }, // Listening
                {
                    name: 'on Twitch',
                    type: 1,
                    url: 'https://www.twitch.tv/lifeverse',
                }, // Streaming
                {
                    name: 'at Population',
                    type: 2,
                    url: 'https://www.lifeverse.com/population/cameras',
                }, // Watching
            ];

            let currentActivityIndex = 0;

            const updatePresence = () => {
                const activity = activities[currentActivityIndex];
                client.user?.setPresence({
                    activities: [
                        {
                            name: activity.name,
                            type: activity.type,
                            url: activity.url,
                        },
                    ],
                    status: 'online',
                });

                currentActivityIndex = (currentActivityIndex + 1) % activities.length;
            };

            setInterval(updatePresence, 20000);

            updatePresence();

            await registerCommands();

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Bot is ready! 🚀')
                .setDescription('The bot is now online and ready to use!')
                .setFooter({ text: 'Thanks for using our bot! 😊' })
                .setTimestamp();

            const channel = client.channels.cache.get(config.channels.START_MESSAGE_CHANNEL_ID);

            if (channel && channel instanceof TextChannel) {
                if (startMessage) {
                    try {
                        await startMessage.delete();
                    } catch (error) {
                        LogService.error('Failed to delete previous start message.');
                    }
                }

                startMessage = await channel.send({ embeds: [embed] });
            } else {
                LogService.error('The channel is not a TextChannel or could not be found.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error: ${errorMessage}`);
        }
    });
};
