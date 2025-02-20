import { Client, EmbedBuilder, PermissionsBitField, TextChannel, OAuth2Scopes } from "discord.js";
import { registerCommands } from "../functions/register";
import { LogService } from "../services/logService";
import { config } from "../config/config";

export const handleReadyEvent = (client: Client) => {
    client.on("ready", async () => {
        try {
            LogService.info(`${client.user?.tag} is ready and online!`);

            const inviteLink = client.generateInvite({
                permissions: [PermissionsBitField.Flags.Administrator],
                scopes: [OAuth2Scopes.Bot],
            });
            console.info(`Invite Link: ${inviteLink}`);

            await client.user?.setPresence({
                activities: [
                    { 
                        name: "LifeVerse",
                        type: 0, // Playing
                        url: "https://download.lifeverse.com"
                    },
                    { 
                        name: "to Members",
                        type: 3, // Listening
                        url: "https://open.spotify.com"
                    },
                    { 
                        name: "on Twitch",
                        type: 1, // Streaming
                        url: "https://www.twitch.tv/lifeverse"
                    },
                    { 
                        name: "at Population",
                        type: 2, // Watching
                        url: "https://www.lifeverse.com/population/cameras"
                    },
                ],
                status: "online",
            });

            await registerCommands();

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Bot is ready! 🚀")
                .setDescription("The bot is now online and ready to use!")
                .setFooter({ text: "Thanks for using our bot! 😊" })
                .setTimestamp();

            const channel = client.channels.cache.get(config.channels.START_MESSAGE_CHANNEL_ID);

            if (channel && channel instanceof TextChannel) {
                await channel.send({ embeds: [embed] });
            } else {
                LogService.error("The channel is not a TextChannel or could not be found.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error: ${errorMessage}`);
        }
    });
};
