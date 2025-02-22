import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    Role,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
} from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';

const RoleCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage server roles.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('assign')
                .setDescription('Assign a role to a user.')
                .addUserOption(option => option.setName('user').setDescription('User to assign the role to.').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('Role to assign.').setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unassign')
                .setDescription('Unassign a role from a user.')
                .addUserOption(option => option.setName('user').setDescription('User to unassign the role from.').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('Role to unassign.').setRequired(true)),
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const member = interaction.member as GuildMember;

        if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to manage roles. You need the `MANAGE_ROLES` permission.')
                .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (subcommand === 'assign') {
            const user = interaction.options.getUser('user')!;
            const role = interaction.options.getRole('role')!;

            try {
                if (role instanceof Role) {
                    const member = await interaction.guild!.members.fetch(user.id);
                    await member.roles.add(role, `Role assigned by ${interaction.user.tag}`);

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('Role Assigned')
                        .setDescription(`The role **${role.name}** has been successfully assigned to **${user.username}**.`)
                        .setTimestamp();
                    interaction.reply({ embeds: [embed] });
                    return;
                } else {
                    interaction.reply({
                        embeds: [new EmbedBuilder().setColor('Red').setTitle('Error').setDescription('The specified role is not valid.')],
                        ephemeral: true,
                    });
                    return;
                }
            } catch (error) {
                LogService.error(`Error assigning role: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error')
                            .setDescription('An error occurred while assigning the role.')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
                return;
            }
        }

        if (subcommand === 'unassign') {
            const user = interaction.options.getUser('user')!;
            const role = interaction.options.getRole('role')!;

            try {
                if (role instanceof Role) {
                    const member = await interaction.guild!.members.fetch(user.id);
                    await member.roles.remove(role, `Role removed by ${interaction.user.tag}`);

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Role Removed')
                        .setDescription(`The role **${role.name}** has been successfully removed from **${user.username}**.`)
                        .setTimestamp();
                    interaction.reply({ embeds: [embed] });
                    return;
                } else {
                    interaction.reply({
                        embeds: [new EmbedBuilder().setColor('Red').setTitle('Error').setDescription('The specified role is not valid.')],
                        ephemeral: true,
                    });
                    return;
                }
            } catch (error) {
                LogService.error(`Error removing role: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error')
                            .setDescription('An error occurred while removing the role.')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
                return;
            }
        }
        return;
    },
};

export default RoleCommand;
