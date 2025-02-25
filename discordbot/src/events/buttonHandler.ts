import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { Poll } from '../models/Poll';
import { Friend } from '../models/Friend';
import { Verification } from '../models/Verification';

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

    if (interaction.customId === 'friend_accept') {
        const userId = interaction.user.id;
    
        console.log(`Processing accept for userId: ${userId}`);

        const verification = await Verification.findOne({ userId });
    
        if (!verification || !verification.verified) {
            console.log(`User ${userId} is not verified.`);
            await interaction.reply({
                content: '❌ You must be verified on our Discord server before you can accept friend requests. Please verify yourself first.',
                ephemeral: true,
            });
            return;
        }
    
        const request = await Friend.findOne({ status: 'pending' });
    
        if (!request) {
            console.log(`No pending friend request found for userId: ${userId}`);
            await interaction.reply({
                content: '❌ No pending friend request found.',
                ephemeral: true,
            });
            return;
        }
    
        if (![request.userId, request.friendId].includes(userId)) {
            console.log(`Unauthorized action by user ${userId} for friend request.`);
            await interaction.reply({
                content: '❌ You are not authorized to interact with this friend request.',
                ephemeral: true,
            });
            return;
        }
    
        request.status = 'accepted';
        await request.save();
    
        const friendUserId = request.userId === userId ? request.friendId : request.userId;
    
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Friend Request Accepted')
            .setDescription(`You are now friend with <@${friendUserId}>!`)
            .setTimestamp();
    
        console.log(`Friend request accepted for user ${userId}`);
    
        await interaction.update({ content: '✅ Friend request accepted.', embeds: [embed], components: [] });
    }

    if (interaction.customId === 'friend_reject') {
        const userId = interaction.user.id;
    
        console.log(`Processing reject for userId: ${userId}`);

        const verification = await Verification.findOne({ userId });
    
        if (!verification || !verification.verified) {
            console.log(`User ${userId} is not verified.`);
            await interaction.reply({
                content: '❌ You must be verified on our Discord server before you can reject friend requests. Please verify yourself first.',
                ephemeral: true,
            });
            return;
        }
    
        const request = await Friend.findOne({ status: 'pending' });
    
        if (!request) {
            console.log(`No pending friend request found for userId: ${userId}`);
            await interaction.reply({
                content: '❌ No pending friend request found.',
                ephemeral: true,
            });
            return;
        }
    
        if (![request.userId, request.friendId].includes(userId)) {
            console.log(`Unauthorized action by user ${userId} for friend request.`);
            await interaction.reply({
                content: '❌ You are not authorized to interact with this friend request.',
                ephemeral: true,
            });
            return;
        }
    
        await Friend.deleteOne({ status: 'pending' });
    
        const friendUserId = request.userId === userId ? request.friendId : request.userId;
    
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Friend Request Rejected')
            .setDescription(`You rejected the friend request from <@${friendUserId}>.`)
            .setTimestamp();
    
        console.log(`Friend request rejected for user ${userId}`);
    
        await interaction.update({ content: '❌ Friend request rejected.', embeds: [embed], components: [] });
    }
};
