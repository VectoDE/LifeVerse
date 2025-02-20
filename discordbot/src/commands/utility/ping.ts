import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { performance } from "perf_hooks";
import axios from "axios";
import { Command } from "../../functions/handleCommands";
import { config } from "../../config/config";
import { LogService } from "../../services/logService";

const services = [
    { name: "🌍 Website", url: config.apiRequests.WEBSITE },
    { name: "🛠️ API", url: config.apiRequests.API },
    { name: "🎮 Game Servers", url: config.apiRequests.GAME_SERVERS },
];

const PingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the ping of the Discord bot, server, and LifeVerse services."),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "⚠️ This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const botLatency = interaction.client.ws.ping;

            const start = performance.now();
            await interaction.guild.members.fetch();
            const end = performance.now();
            const serverLatency = Math.round(end - start);

            const serviceStatuses = await Promise.all(
                services.map(async (service) => {
                    try {
                        const response = await axios.get(service.url, { timeout: 5000 });
                        return { name: service.name, status: `🟢 Online (${response.status} OK)` };
                    } catch (error) {
                        return { name: service.name, status: "🔴 Offline" };
                    }
                })
            );

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("🌐 LifeVerse Service Status & Ping")
                .setDescription("Here are the current ping values and service statuses:")
                .addFields(
                    { name: "🤖 Discord Bot", value: `${botLatency}ms`, inline: true },
                    { name: "🖥️ Server Latency", value: `${serverLatency}ms`, inline: true },
                    ...serviceStatuses.map((s) => ({ name: s.name, value: s.status, inline: false }))
                )
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            LogService.error("Error fetching latencies or services:", error);
            await interaction.editReply({
                content: "❌ Could not retrieve latency or service statuses. Please try again later.",
            });
        }
    },
};

export default PingCommand;
