import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../functions/handleCommands";
import { Kick } from "../../models/Kick";
import { LogService } from "../../services/logService";

const KickCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Verwalte Kicks")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Fügt einen Kick hinzu")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der gekickte Benutzer").setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("reason").setDescription("Grund des Kicks").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("list").setDescription("Listet die letzten 10 Kicks auf")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "⚠️ Dieser Befehl kann nur in einem Server genutzt werden.",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: false });

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "add") {
                const user = interaction.options.getUser("user");
                const reason = interaction.options.getString("reason");

                if (!user || !reason) {
                    interaction.editReply({ content: "❌ Fehlende Argumente!" });
                    return;
                }

                const kickEntry = new Kick({
                    userId: user.id,
                    moderatorId: interaction.user.id,
                    reason: reason,
                    timestamp: new Date(),
                });

                await kickEntry.save();

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🚨 Kick-Log")
                    .setDescription(`✅ **${user.tag}** wurde gekickt.`)
                    .addFields(
                        { name: "👮 Moderator", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "📝 Grund", value: reason, inline: true },
                        { name: "📅 Zeitpunkt", value: new Date().toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "list") {
                const kicks = await Kick.find().sort({ timestamp: -1 }).limit(10);

                if (kicks.length === 0) {
                    interaction.editReply({ content: "ℹ️ Es wurden keine Kicks gefunden." });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("📋 Letzte 10 Kicks")
                    .setDescription(kicks.map(kick =>
                        `👤 **Benutzer:** <@${kick.userId}>\n👮 **Moderator:** <@${kick.moderatorId}>\n📝 **Grund:** ${kick.reason}\n📅 **Zeit:** ${kick.timestamp.toLocaleString()}\n—`
                    ).join("\n"))
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            LogService.error("Fehler beim Kick-Befehl:", error);
            await interaction.editReply({
                content: "❌ Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
            });
        }
    },
};

export default KickCommand;
