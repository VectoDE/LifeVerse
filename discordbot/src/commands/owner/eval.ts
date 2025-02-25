import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';
import { config } from '../../config/config';
import { inspect } from 'util';

const EvalCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates JavaScript code (Bot Owner Only)')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The JavaScript code to evaluate')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== config.application.OWNER_ID) {
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Access Denied')
                    .setDescription('You are not authorized to use this command.')
                ], 
                ephemeral: true 
            });
            return;
        }

        const code = interaction.options.getString('code', true);
        
        await interaction.reply({ 
            embeds: [new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('⏳ Processing...')
                .setDescription('Evaluating your JavaScript code...')
                .setTimestamp()
            ] 
        });

        try {
            let evaled = eval(code);
            if (evaled instanceof Promise) evaled = await evaled;
            const output = inspect(evaled, { depth: 2 });

            const successEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('✅ Evaluation Successful')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\n\`\`\`` },
                    { name: '📤 Output', value: output.length > 4000 ? 'Output too long. Check console.' : `\`\`\`js\n${output}\n\`\`\`` }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            LogService.error('Eval command error:', error);

            const errorString = error instanceof Error ? error.stack || error.message : String(error);
            const formattedError = errorString.length > 4000 ? 'Error too long. Check console.' : `\`\`\`js\n${errorString}\n\`\`\``;

            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Evaluation Failed')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\n\`\`\`` },
                    { name: '❌ Error', value: formattedError }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};

export default EvalCommand;
