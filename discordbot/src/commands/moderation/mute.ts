import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../functions/handleCommands";
import { Mute } from "../../models/Mute";
import { LogService } from "../../services/logService";

const MuteCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Verwalte Mutes.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Mute einen Benutzer.")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der zu stummgeschaltete Benutzer").setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("reason").setDescription("Der Grund für das Muten").setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Zeige alle stummgeschalteten Benutzer.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Entferne das Muten von einem Benutzer.")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der zu entmuttende Benutzer").setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

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

                const muteEntry = new Mute({
                    userId: user.id,
                    username: user.username,
                    reason: reason,
                    timestamp: new Date(),
                });

                await muteEntry.save();

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🚨 Mute-Log")
                    .setDescription(`✅ **${user.tag}** wurde stummgeschaltet.`)
                    .addFields(
                        { name: "📝 Grund", value: reason, inline: true },
                        { name: "📅 Mute-Zeit", value: new Date().toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been muted. Reason: ${reason}`);

            } else if (subcommand === "list") {
                const mutes = await Mute.find().sort({ timestamp: -1 }).limit(10);

                if (mutes.length === 0) {
                    interaction.editReply({ content: "ℹ️ Es wurden keine stummgeschalteten Benutzer gefunden." });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("📋 Letzte 10 Mutes")
                    .setDescription(mutes.map(mute =>
                        `👤 **Benutzer:** ${mute.username}\n📝 **Grund:** ${mute.reason}\n📅 **Zeit:** ${mute.timestamp.toLocaleString()}\n—`
                    ).join("\n"))
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "remove") {
                const user = interaction.options.getUser("user");

                if (!user) {
                    interaction.editReply({ content: "❌ Kein Benutzer angegeben!" });
                    return;
                }

                const mute = await Mute.findOneAndDelete({ userId: user.id });

                if (!mute) {
                    interaction.editReply({ content: `ℹ️ Der Benutzer **${user.tag}** ist nicht stummgeschaltet.` });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Mute entfernt")
                    .setDescription(`Das Muten für **${user.tag}** wurde entfernt.`)
                    .addFields(
                        { name: "📝 Grund", value: mute.reason, inline: true },
                        { name: "📅 Mute-Zeit", value: mute.timestamp.toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been unmuted.`);
            }
        } catch (error) {
            LogService.error("Fehler beim Mute-Befehl:", error);
            await interaction.editReply({
                content: "❌ Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
            });
        }
    },
};

export default MuteCommand;
