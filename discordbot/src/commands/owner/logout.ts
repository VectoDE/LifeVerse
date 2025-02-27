import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { config } from '../../config/config';
import { LogService } from '../../services/logService';

const LogoutCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('logout')
        .setDescription('Shuts down the bot (Bot Owner Only)'),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== config.application.OWNER_ID) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Unauthorized')
                .setDescription('You are not authorized to use this command.');
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const loadingEmbed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('🔄 Shutting Down...')
            .setDescription('The bot is shutting down. Please wait...');
        
        await interaction.reply({ embeds: [loadingEmbed] });

        setTimeout(async () => {
            const successEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Successfully Logged Out')
                .setDescription('The bot has been successfully logged out and shut down.');
            
            await interaction.editReply({ embeds: [successEmbed] });
            LogService.info('Bot is shutting down via command.');
            process.exit(0);
        }, 3000);
    }
};

export default LogoutCommand;
