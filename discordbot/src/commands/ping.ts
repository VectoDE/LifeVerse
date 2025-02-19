import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { performance } from "perf_hooks";
import { Command } from "../functions/handleCommands";

const PingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the ping of the Discord bot and server."),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: `⚠️ This command can only be used in one server.`,
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

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(`🌐 Ping from EzClap Gaming Services`)
                .setDescription(
                    `Here are the current ping values ​​of the Discord bot and the server:`,
                )
                .addFields(
                    { name: "🤖 Discord Bot", value: `${botLatency}ms`, inline: true },
                    {
                        name: "🖥️ Server latency",
                        value: `${serverLatency}ms`,
                        inline: true,
                    },
                )
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching latencies:", error);
            await interaction.editReply({
                content:
                    "❌ Latency could not be measured. Please try again later.",
            });
        }
    },
};

export default PingCommand;
