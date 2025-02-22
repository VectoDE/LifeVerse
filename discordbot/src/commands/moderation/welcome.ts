import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder, GuildMember } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { Welcome } from '../../models/Welcome';
import { LogService } from '../../services/logService';

const WelcomeCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Welcome system commands')
        .addSubcommand(subcommand =>
            subcommand.setName('set-channel')
                .setDescription('Set the channel where the welcome message will be sent.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel where the welcome message will be sent.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('simulate-join')
                .setDescription('Simulate a new member joining the server.')
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (!interaction.guild) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error!')
                .setDescription('Guild not found.')
                .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (subcommand === 'set-channel') {
            const channel = interaction.options.getChannel('channel');

            if (!(channel instanceof TextChannel)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Error!')
                    .setDescription('Please select a valid text channel.')
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try {
                await Welcome.findOneAndUpdate(
                    { guildId: interaction.guildId },
                    {
                        guildId: interaction.guildId,
                        guildName: interaction.guild.name,
                        channelId: channel.id,
                        channelName: channel.name,
                        userId: interaction.user.id,
                        username: interaction.user.username,
                    },
                    { upsert: true }
                );

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Success!')
                    .setDescription(`The welcome channel has been successfully set to <#${channel.id}>.`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                LogService.error(`Error setting the welcome channel: ${error}`);
                interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('Error!').setDescription('An error occurred while setting the welcome channel.').setTimestamp()], ephemeral: true });
            }
        }

        if (subcommand === 'simulate-join') {
            try {
                const member = interaction.member as GuildMember;
                
                interaction.client.emit('guildMemberAdd', member);
        
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Success!')
                    .setDescription(`Simulated a new member joining the server: **${member.user.username}**.`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                LogService.error(`Error simulating join: ${error}`);
                interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('Error!').setDescription('An error occurred while simulating a new member joining.').setTimestamp()], ephemeral: true });
            }
        }
    }
};

export default WelcomeCommand;
