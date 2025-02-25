import { ButtonInteraction } from 'discord.js';
import { Poll } from '../models/Poll';

export const handleButtonIneraction = async (interaction: ButtonInteraction) => {
    if (interaction.customId.startsWith('poll-')) {
        const [_, pollIdentifier, _optionId] = interaction.customId.split('-');
        const guildId = interaction.guildId;
        const userId = interaction.user.id;

        const poll = await Poll.findOne({ guildId, identifier: pollIdentifier, active: true });

        if (!poll) {
            await interaction.reply({
                content: '❌ Poll not found or has already ended.',
                ephemeral: true,
            });
            return;
        }

        if (poll.voters.includes(userId)) {
            await interaction.reply({
                content: '❌ You have already voted in this poll.',
                ephemeral: true,
            });
            return;
        }

        const option = poll.options.find(opt => opt.customId === interaction.customId);

        if (!option) {
            await interaction.reply({
                content: '❌ Invalid option selected.',
                ephemeral: true,
            });
            return;
        }

        option.votes += 1;
        poll.voters.push(userId);
        await poll.save();

        await interaction.reply({
            content: `✅ Your vote has been counted for option: **${option.text}**.`,
            ephemeral: true,
        });
    }
};
