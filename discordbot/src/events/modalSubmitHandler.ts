import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
import { Verification } from '../models/Verification';
import { LogService } from '../services/logService';
import { generateVerificationCode, formatCode } from '../utils/verificationCode';

export const modalSubmitHandler = async (interaction: ModalSubmitInteraction) => {
    if (interaction.customId === 'verify_modal') {
        const lifeVerseUrl = interaction.fields.getTextInputValue('lifeVerseUrl').trim();
        const lifeVerseUsername = interaction.fields.getTextInputValue('lifeVerseUsername').trim();
        const user = interaction.user;
        const guildId = interaction.guildId;

        const urlRegex = /^https:\/\/www\.lifeversegame\.com\/profile\/([a-zA-Z0-9_-]+)$/;
        const match = lifeVerseUrl.match(urlRegex);
        
        if (!match) {
            await interaction.reply({
                content: '❌ **Invalid URL!** Please enter a valid LifeVerse profile URL (https://www.lifeversegame.com/profile/<username>).',
                ephemeral: true
            });
            return;
        }
        
        const usernameFromUrl = match[1];

        const usernameRegex = /^[a-zA-Z0-9_-]{4,}$/;
        if (!usernameRegex.test(lifeVerseUsername)) {
            await interaction.reply({
                content: '❌ **Invalid Username!** Your username must be at least 4 characters long and can only contain letters, numbers, underscores (_) and hyphens (-).',
                ephemeral: true
            });
            return;
        }

        if (lifeVerseUsername !== usernameFromUrl) {
            await interaction.reply({
                content: `❌ **Username Mismatch!** The username in your URL (**${usernameFromUrl}**) does not match the entered username (**${lifeVerseUsername}**).`,
                ephemeral: true
            });
            return;
        }

        const existingVerification = await Verification.findOne({ userId: user.id });

        if (existingVerification) {
            await interaction.reply({ content: `${user.username} is already verified!`, ephemeral: true });
            return;
        }

        const code = generateVerificationCode();

        const newVerification = new Verification({
            identifier: Math.random().toString(36).substring(2, 15),
            userId: user.id,
            guildId: guildId,
            lifeVerseUrl: lifeVerseUrl,
            lifeVerseUsername: lifeVerseUsername,
            verified: false,
            code: code,
            timestamp: new Date(),
        });

        await newVerification.save();

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Verification Pending!')
            .setDescription(
                `**${user.username}**, follow these steps to complete your verification:\n\n` +
                `1️⃣ **Go to [LifeVerse Website](https://lifeverse.com) and log in.**\n` +
                `2️⃣ **Navigate to your profile.**\n` +
                `3️⃣ **Go to the "Verification" section.**\n` +
                `4️⃣ **Select "Discord" verification.**\n` +
                `5️⃣ **Enter the following verification code:**\n\n` +
                `||\`${formatCode(code)}\`||\n\n` +
                `🔄 After entering the code, your verification will be processed automatically.`
            )
            .addFields(
                { name: 'LifeVerse Profile URL', value: lifeVerseUrl },
                { name: 'LifeVerse Username', value: lifeVerseUsername, inline: true },
                { name: 'Discord Username', value: interaction.user.username, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        LogService.info(`${user.username} started the verification process with code: ${code}, LifeVerse URL: ${lifeVerseUrl}, Username: ${lifeVerseUsername}`);
    }
};
