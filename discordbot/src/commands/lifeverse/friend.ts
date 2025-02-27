import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Friend } from '../../models/Friend';
import { LogService } from '../../services/logService';
import { Command } from '../../functions/handleCommands';
import { Verification } from '../../models/Verification';

const FriendCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('friend')
        .setDescription('Manage friend requests and friendships')
        .addSubcommand(subcommand => subcommand.setName('send').setDescription('Send a friend request').addUserOption(option => option.setName('user').setDescription('The user to send a friend request to').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('accept').setDescription('Accept a friend request').addUserOption(option => option.setName('user').setDescription('The user to accept a friend request from').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('reject').setDescription('Reject a friend request').addUserOption(option => option.setName('user').setDescription('The user to reject a friend request from').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('list').setDescription('List your friends'))
        .addSubcommand(subcommand => subcommand.setName('requests').setDescription('List your friend requests.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({ content: '⚠️ This command can only be used in a server.', ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: false });

        try {
            const subcommand = interaction.options.getSubcommand();
            const userId = interaction.user.id;
            const friendUserId = interaction.options.getUser('user')?.id;
            const guildId = interaction.guild.id;

            const verification = await Verification.findOne({ userId, guildId });

            if (subcommand !== 'list' && subcommand !== 'requests' && (!verification || !verification.verified === true)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Verification Required')
                    .setDescription('You need to verify yourself before using the friend system. Please complete the verification process first.')
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed] });
                return;
            }

            if (!friendUserId && subcommand !== 'list' && subcommand !== 'requests') {
                await interaction.editReply({ content: '⚠️ Please specify a valid user.' });
                return;
            }

            if (subcommand === 'send') {
                const friendUserId = interaction.options.getUser('user', true).id;
                const existingRequest = await Friend.findOne({ userId, friendId: friendUserId, guildId, status: 'pending' });
            
                if (existingRequest) {
                    await interaction.editReply({ content: '⚠️ You already have a pending friend request with this user.' });
                    return;
                }
            
                const identifier = Math.random().toString(36).substring(2, 15);
            
                const newRequest = new Friend({
                    identifier,
                    userId,
                    friendId: friendUserId,
                    guildId,
                    status: 'pending',
                    buttonIds: ['friend_accept', 'friend_reject'],
                    buttonLabel: ['Accept', 'Reject'],
                });
                await newRequest.save();
            
                const buttons = [
                    { id: 'friend_accept', label: 'Accept', style: ButtonStyle.Success },
                    { id: 'friend_reject', label: 'Reject', style: ButtonStyle.Danger },
                ].map(btn =>
                    new ButtonBuilder()
                        .setCustomId(btn.id)
                        .setLabel(btn.label)
                        .setStyle(btn.style),
                );
            
                const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
            
                const embedForSender = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('✅ Friend Request Sent')
                    .setDescription(`You have successfully sent a friend request to <@${friendUserId}>.`)
                    .setTimestamp();
            
                const embedForRecipient = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('📩 You Have a Friend Request!')
                    .setDescription(`<@${userId}> has sent you a friend request!`)
                    .setTimestamp();
            
                await interaction.editReply({ embeds: [embedForSender] });
            
                try {
                    const recipient = await interaction.client.users.fetch(friendUserId);
                    await recipient.send({ embeds: [embedForRecipient], components: [actionRow] });
                    LogService.info(`Friend request sent from ${interaction.user.tag} to <@${friendUserId}> in guild: ${interaction.guild?.name} with identifier ${identifier}`);
                } catch (error) {
                    console.error('Failed to send friend request DM:', error);
                    await interaction.followUp({ content: '⚠️ Could not send a DM to the user.', ephemeral: true });
                }
            }

            if (subcommand === 'accept') {
                const request = await Friend.findOne({ userId: friendUserId, friendId: userId, guildId, status: 'pending' });

                if (!request) {
                    interaction.editReply({ content: '⚠️ No pending friend request found.' });
                    return;
                }

                request.status = 'accepted';
                await request.save();

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('✅ Friend Request Accepted')
                    .setDescription(`You are now friends with <@${friendUserId}>!`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                LogService.info(`Friend request accepted between ${interaction.user.tag} and <@${friendUserId}> in guild: ${interaction.guild.name}`);
            }

            if (subcommand === 'reject') {
                const request = await Friend.findOne({ userId: friendUserId, friendId: userId, guildId, status: 'pending' });

                if (!request) {
                    interaction.editReply({ content: '⚠️ No pending friend request found.' });
                    return;
                }

                await Friend.deleteOne({ _id: request.id });

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Friend Request Rejected')
                    .setDescription(`You rejected the friend request from <@${friendUserId}>.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                LogService.info(`Friend request rejected between ${interaction.user.tag} and <@${friendUserId}> in guild: ${interaction.guild.name}`);
            }

            if (subcommand === 'list') {
                const friends = await Friend.find({
                    $or: [
                        { userId, status: 'accepted' },
                        { friendId: userId, status: 'accepted' }
                    ]
                });
            
                if (friends.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor('Yellow')
                        .setTitle('⚠️ No Friends Found')
                        .setDescription('You have no friends yet. Send friend requests to others to start building your friend list!')
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }
            
                const friendList = friends.map(friend => {
                    return friend.userId === userId ? `<@${friend.friendId}>` : `<@${friend.userId}>`;
                }).join('\n');
            
                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('🧑‍🤝‍🧑 Your Friends')
                    .setDescription(friendList || 'No friends found.')
                    .setTimestamp();
            
                await interaction.editReply({ embeds: [embed] });
                LogService.info(`Friend list retrieved for ${interaction.user.tag}`);
            }

            if (subcommand === 'requests') {
                const requests = await Friend.find({
                    $or: [
                        { userId, status: 'pending' },
                        { friendId: userId, status: 'pending' }
                    ]
                });
            
                if (requests.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor('Yellow')
                        .setTitle('⚠️ No Pending Requests')
                        .setDescription('You have no pending friend requests. You can send friend requests to others!')
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }
            
                const requestList = requests.map(request => {
                    const requester = request.userId === userId ? request.friendId : request.userId;
                    return `<@${requester}>`;
                }).join('\n');
            
                const embed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('📝 Pending Friend Requests')
                    .setDescription(requestList || 'No pending friend requests.')
                    .setTimestamp();
            
                await interaction.editReply({ embeds: [embed] });
                LogService.info(`Pending friend requests retrieved for ${interaction.user.tag}`);
            }
        } catch (error) {
            LogService.error('Error handling friend command:', error);
            await interaction.editReply({ content: '❌ An error occurred. Please try again later.' });
        }
    },
};

export default FriendCommand;
