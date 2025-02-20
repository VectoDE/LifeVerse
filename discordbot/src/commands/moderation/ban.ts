import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../functions/handleCommands";
import { Ban } from "../../models/Ban";
import { LogService } from "../../services/logService";

const BanCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Verwalte Bans.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Banne einen Benutzer.")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der zu bannende Benutzer").setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("reason").setDescription("Der Grund für den Bann").setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Zeige alle gebannten Benutzer.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Entferne einen Bann.")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der zu entbannende Benutzer").setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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
                const reason = interaction.options.getString("reason") || "Kein Grund angegeben";

                if (!user) {
                    interaction.editReply({ content: "❌ Kein Benutzer angegeben!" });
                    return;
                }

                const banEntry = new Ban({
                    userId: user.id,
                    username: user.username,
                    reason: reason,
                    timestamp: new Date(),
                });

                await banEntry.save();

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🚨 Ban-Log")
                    .setDescription(`✅ **${user.tag}** wurde gebannt.`)
                    .addFields(
                        { name: "📝 Grund", value: reason, inline: true },
                        { name: "📅 Bannzeit", value: new Date().toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been banned. Reason: ${reason}`);

            } else if (subcommand === "list") {
                const bans = await Ban.find().sort({ timestamp: -1 }).limit(10);

                if (bans.length === 0) {
                    interaction.editReply({ content: "ℹ️ Es wurden keine gebannten Benutzer gefunden." });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("📋 Letzte 10 Banns")
                    .setDescription(bans.map(ban =>
                        `👤 **Benutzer:** ${ban.username}\n📝 **Grund:** ${ban.reason}\n📅 **Zeit:** ${ban.timestamp.toLocaleString()}\n—`
                    ).join("\n"))
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "remove") {
                const user = interaction.options.getUser("user");

                if (!user) {
                    interaction.editReply({ content: "❌ Kein Benutzer angegeben!" });
                    return;
                }

                const ban = await Ban.findOneAndDelete({ userId: user.id });

                if (!ban) {
                    interaction.editReply({ content: `ℹ️ Der Benutzer **${user.tag}** ist nicht gebannt.` });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Ban entfernt")
                    .setDescription(`Der Bann für **${user.tag}** wurde entfernt.`)
                    .addFields(
                        { name: "📝 Grund", value: ban.reason, inline: true },
                        { name: "📅 Bannzeit", value: ban.timestamp.toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been unbanned.`);
            }
        } catch (error) {
            LogService.error("Fehler beim Ban-Befehl:", error);
            await interaction.editReply({
                content: "❌ Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
            });
        }
    },
};

export default BanCommand;
