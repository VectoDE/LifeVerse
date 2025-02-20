import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../functions/handleCommands";
import { Timeout } from "../../models/Timeout";
import { LogService } from "../../services/logService";

const TimeoutCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Verwalte Timeouts.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Setze einen Timeout für einen Benutzer.")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der Benutzer, der einen Timeout erhält").setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("reason").setDescription("Der Grund für den Timeout").setRequired(false)
                )
                .addIntegerOption(option =>
                    option.setName("duration").setDescription("Die Dauer des Timeouts in Minuten").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Zeige alle aktuellen Timeouts.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Entferne einen Timeout von einem Benutzer.")
                .addUserOption(option =>
                    option.setName("user").setDescription("Der Benutzer, von dem der Timeout entfernt werden soll").setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

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
                const duration = interaction.options.getInteger("duration");

                if (!user || !duration) {
                    interaction.editReply({ content: "❌ Benutzer oder Dauer fehlt!" });
                    return;
                }

                const durationInMs = duration * 60 * 1000;

                const timeoutEntry = new Timeout({
                    userId: user.id,
                    username: user.username,
                    reason: reason,
                    duration: durationInMs,
                    timestamp: new Date(),
                });

                await timeoutEntry.save();

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🚨 Timeout-Log")
                    .setDescription(`✅ **${user.tag}** wurde für ${duration} Minuten in den Timeout versetzt.`)
                    .addFields(
                        { name: "📝 Grund", value: reason, inline: true },
                        { name: "📅 Timeout-Zeit", value: new Date().toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been timed out for ${duration} minutes. Reason: ${reason}`);

                const member = await interaction.guild.members.fetch(user.id);
                await member.timeout(durationInMs, reason);

            } else if (subcommand === "list") {
                const timeouts = await Timeout.find().sort({ timestamp: -1 }).limit(10);

                if (timeouts.length === 0) {
                    interaction.editReply({ content: "ℹ️ Es gibt keine aktiven Timeouts." });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("📋 Aktive Timeouts")
                    .setDescription(timeouts.map(timeout =>
                        `👤 **Benutzer:** ${timeout.username}\n📝 **Grund:** ${timeout.reason}\n⏳ **Dauer:** ${timeout.duration / 60000} Minuten\n📅 **Zeit:** ${timeout.timestamp.toLocaleString()}\n—`
                    ).join("\n"))
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

            } else if (subcommand === "remove") {
                const user = interaction.options.getUser("user");

                if (!user) {
                    interaction.editReply({ content: "❌ Kein Benutzer angegeben!" });
                    return;
                }

                const timeout = await Timeout.findOneAndDelete({ userId: user.id });

                if (!timeout) {
                    interaction.editReply({ content: `ℹ️ Der Benutzer **${user.tag}** hat keinen aktiven Timeout.` });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Timeout entfernt")
                    .setDescription(`Der Timeout für **${user.tag}** wurde entfernt.`)
                    .addFields(
                        { name: "📝 Grund", value: timeout.reason, inline: true },
                        { name: "📅 Timeout-Zeit", value: timeout.timestamp.toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been removed from timeout.`);
            }
        } catch (error) {
            LogService.error("Fehler beim Timeout-Befehl:", error);
            await interaction.editReply({
                content: "❌ Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
            });
        }
    },
};

export default TimeoutCommand;
