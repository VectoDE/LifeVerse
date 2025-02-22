import axios from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../functions/handleCommands";
import { Ban } from "../../models/Ban";
import { LogService } from "../../services/logService";
import { config } from "../../config/config";

const apiRequestUrl = config.apiRequests.REQUEST_API_BASE_URL;

const BanCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Manage bans.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Ban a user.")
                .addUserOption(option =>
                    option.setName("user").setDescription("The user to ban").setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("reason").setDescription("The reason for the ban").setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("Show all banned users.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Unban a user.")
                .addUserOption(option =>
                    option.setName("user").setDescription("The user to unban").setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "⚠️ This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: false });

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === "add") {
                const user = interaction.options.getUser("user");
                const reason = interaction.options.getString("reason") || "No reason provided";

                if (!user) {
                    interaction.editReply({ content: "❌ No user specified!" });
                    return;
                }

                await Ban.create({
                    userId: user.id,
                    username: user.username,
                    reason: reason,
                    timestamp: new Date(),
                });

                await axios.patch(`${apiRequestUrl}/update-ip-ban-status`, {
                    userId: user.id,
                    isBanned: true,
                });

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🚨 Ban Log")
                    .setDescription(`✅ **${user.tag}** has been banned.`)
                    .addFields(
                        { name: "📝 Reason", value: reason, inline: true },
                        { name: "📅 Ban Date", value: new Date().toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been banned. Reason: ${reason}`);
            } else if (subcommand === "list") {
                const bans = await Ban.find().sort({ timestamp: -1 }).limit(10);

                if (bans.length === 0) {
                    interaction.editReply({ content: "ℹ️ No banned users found." });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("📋 Last 10 Bans")
                    .setDescription(bans.map(ban =>
                        `👤 **User:** ${ban.username}\n📝 **Reason:** ${ban.reason}\n📅 **Time:** ${ban.timestamp.toLocaleString()}\n—`
                    ).join("\n"))
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === "remove") {
                const user = interaction.options.getUser("user");

                if (!user) {
                    interaction.editReply({ content: "❌ No user specified!" });
                    return;
                }

                const ban = await Ban.findOneAndDelete({ userId: user.id });

                if (!ban) {
                    interaction.editReply({ content: `ℹ️ The user **${user.tag}** is not banned.` });
                    return;
                }

                await axios.patch(`${apiRequestUrl}/update-ip-ban-status`, {
                    userId: user.id,
                    isBanned: false,
                });

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Ban Removed")
                    .setDescription(`The ban for **${user.tag}** has been removed.`)
                    .addFields(
                        { name: "📝 Reason", value: ban.reason, inline: true },
                        { name: "📅 Ban Date", value: ban.timestamp.toLocaleString(), inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });

                LogService.info(`User ${user.tag} has been unbanned.`);
            }
        } catch (error) {
            LogService.error("Error with ban command:", error);
            await interaction.editReply({
                content: "❌ An error occurred. Please try again later.",
            });
        }
    },
};

export default BanCommand;
