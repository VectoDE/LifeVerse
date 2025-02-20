import { Client, EmbedBuilder, TextChannel } from "discord.js";

export const handleReadyEvent = (client: Client) => {
    client.on("ready", async () => {
        try {
            console.info(`${client.user?.tag} is ready and online!`);

            await client.user?.setPresence({
                activities: [
                    { name: "LifeVerse", type: 0 },
                    { name: "Players", type: 3 },
                ],
                status: "online",
            });

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Bot is ready! 🚀")
                .setDescription("The bot is now online and ready to use!")
                .setFooter({ text: "Thanks for using our bot! 😊" })
                .setTimestamp();

            const channel = client.channels.cache.get(process.env.START_MESSAGE_CHANNEL_ID || '');

            if (channel && channel instanceof TextChannel) {
                await channel.send({ embeds: [embed] });
            } else {
                console.error("The channel is not a TextChannel or could not be found.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error: ${errorMessage}`);
        }
    });
};
