import axios from 'axios';
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';
import { Request } from '../../models/Request';
import { config } from '../../config/config';

async function checkURLStatus(_type: string, url?: string): Promise<boolean> {
    if (!url) {
        console.error('No URL provided.');
        return false;
    }

    let status: string;
    try {
        const response = await axios.get(url);
        status = response.status === 200 ? 'success' : 'failed';
    } catch (error) {
        status = 'failed';
    }

    const request = new Request({
        url,
        type: _type,
        status,
        identifier: Math.random().toString(36).substring(2, 15),
        timestamp: new Date(),
    });

    try {
        await request.save();
    } catch (error) {
        console.error('Error saving request to database:', error);
    }

    return status === 'success';
}

async function checkBotStatus(interaction: ChatInputCommandInteraction): Promise<boolean> {
    try {
        const bot = await interaction.client.user;
        if (bot && bot.presence && bot.presence.status === 'online') {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking bot status:', error);
        return false;
    }
}

async function getRequestStats(): Promise<{
    successCount: number;
    errorCount: number;
    totalRequests: number;
}> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const requests = await Request.find({ timestamp: { $gte: thirtyDaysAgo } });

    const successCount = requests.filter(req => req.status === 'success').length;
    const errorCount = requests.filter(req => req.status === 'failed').length;

    return { successCount, errorCount, totalRequests: requests.length };
}

function generateProgressBar(success: number, total: number): string {
    const length = 10;
    const filledBlocks = total > 0 ? Math.round((success / total) * length) : 0;
    const emptyBlocks = length - filledBlocks;
    return '🟩'.repeat(filledBlocks) + '⬜'.repeat(emptyBlocks);
}

const LifeVerseInfoCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('lifeverseinfo')
        .setDescription('Show info about LifeVerse, including Discord, Website, Game, App, and Software.'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const guild = interaction.guild;
            if (!guild) {
                await interaction.reply({
                    content: '❌ Unable to retrieve guild information.',
                    ephemeral: true,
                });
                return;
            }

            const botStatus = await checkBotStatus(interaction);
            const websiteStatus = await checkURLStatus('GET', config.apiRequests.WEBSITE);
            const apiStatus = await checkURLStatus('GET', 'https://api.lifeversegame.com/api/status');
            const appStatus = await checkURLStatus('GET', 'https://api.lifeversegame.com/mobile_app/status');
            const databaseStatus = await checkURLStatus('GET', 'https://api.lifeversegame.com/database/status');
            const authServiceStatus = await checkURLStatus('GET', 'https://api.lifeversegame.com/auth/status');

            const gameServerStatuses = await Promise.all(
                config.apiRequests.GAME_SERVERS_LIST.map(async server => {
                    const serverStatus = await checkURLStatus('GET', server.url);
                    return {
                        name: server.name,
                        status: serverStatus ? '✅ Operational' : '🛑 Offline',
                    };
                }),
            );

            const stats = await getRequestStats();
            const progressBar = generateProgressBar(stats.successCount, stats.totalRequests);

            const pages = [
                new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('🌐 LifeVerse Discord Info')
                    .setDescription('Welcome to the **LifeVerse** Discord server! Here you can find details about our community and rules.')
                    .addFields(
                        {
                            name: '💬 Server Name',
                            value: `${guild.name}`,
                            inline: true,
                        },
                        {
                            name: '🌍 Server Region',
                            value: `${guild.preferredLocale}`,
                            inline: true,
                        },
                        {
                            name: '👥 Member Count',
                            value: `${guild.memberCount}`,
                            inline: true,
                        },
                        {
                            name: '📜 Rules',
                            value: `[Rules Channel](https://discord.com/channels/${guild.id}/1341925164392124509)`,
                            inline: true,
                        },
                        {
                            name: '🎭 Get Roles',
                            value: `[Get Roles](https://discord.com/channels/${guild.id}/1341925450531737690)`,
                            inline: true,
                        },
                    )
                    .setTimestamp(),
                new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('🌐 LifeVerse Website Info')
                    .setDescription('Our website offers a wealth of information about LifeVerse, including news, updates, and more.')
                    .addFields(
                        {
                            name: '🌐 Website',
                            value: websiteStatus ? '[Visit LifeVerse Website](https://www.lifeversegame.com)' : 'Website is **Offline**',
                            inline: false,
                        },
                        {
                            name: '📰 Latest News',
                            value: 'Check out the [latest updates](https://www.lifeversegame.com/news) on the website!',
                            inline: false,
                        },
                        {
                            name: '🔑 Sign Up / Sign In',
                            value: 'To get started, create an account or sign in to your existing account! [Sign In / Sign Up here](https://www.lifeversegame.com/sign-up)',
                            inline: false,
                        },
                    )
                    .setTimestamp(),
                new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('🎮 LifeVerse Game Info')
                    .setDescription(
                        'LifeVerse is a realistic 1:1 replica of the real world. Immerse yourself in a world that mirrors real life with stunning detail.',
                    )
                    .addFields(
                        {
                            name: '🎮 Game Features',
                            value: 'Explore, socialize, and interact with others in a realistic setting.',
                            inline: false,
                        },
                        {
                            name: '🕹️ Platforms',
                            value: 'Available on **PC**, **Xbox One X**, and **PlayStation 5**.',
                            inline: true,
                        },
                        {
                            name: '📅 Release Date',
                            value: 'Coming soon in **2028**! [Download Here](https://download.lifeversegame.com)',
                            inline: true,
                        },
                    )
                    .setTimestamp(),
                new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('🌐 LifeVerse Website Info')
                    .addFields(
                        {
                            name: '🤖 Discord Bot',
                            value: botStatus ? '✅ Online' : '🛑 Offline',
                            inline: true,
                        },
                        {
                            name: '🌐 Website',
                            value: websiteStatus ? '✅ Operational' : '🛑 Offline',
                            inline: true,
                        },
                        {
                            name: '📱 App',
                            value: appStatus ? '✅ Operational' : '🛑 Offline',
                            inline: true,
                        },
                        {
                            name: '🛠️ API',
                            value: apiStatus ? '🟢 Fully Operational' : '🛑 Offline',
                            inline: true,
                        },
                        {
                            name: '🔗 Database',
                            value: databaseStatus ? '✅ Operational' : '🛑 Offline',
                            inline: true,
                        },
                        {
                            name: '🔐 Auth Service',
                            value: authServiceStatus ? '✅ Operational' : '🛑 Offline',
                            inline: true,
                        },
                        ...gameServerStatuses.map(server => ({
                            name: `🎮 ${server.name}`,
                            value: server.status,
                            inline: true,
                        })),
                    )
                    .setTimestamp(),
                new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('📊 LifeVerse Service Statistics')
                    .setDescription('Statistics of the last 30 days for LifeVerse service requests.')
                    .addFields(
                        {
                            name: '✅ Successful Requests',
                            value: `${stats.successCount}`,
                            inline: true,
                        },
                        {
                            name: '❌ Failed Requests',
                            value: `${stats.errorCount}`,
                            inline: true,
                        },
                        {
                            name: '📊 Total Requests',
                            value: `${stats.totalRequests}`,
                            inline: true,
                        },
                        {
                            name: '📈 Request Success Rate',
                            value: progressBar,
                            inline: false,
                        },
                    )
                    .setTimestamp(),
            ];

            let currentPage = 0;

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId('prev').setLabel('◀️ Previous').setStyle(ButtonStyle.Primary).setDisabled(true),
                new ButtonBuilder().setCustomId('next').setLabel('Next ▶️').setStyle(ButtonStyle.Primary),
            );

            const embed = pages[currentPage];

            let message;

            try {
                message = await interaction.reply({
                    embeds: [embed],
                    components: [row],
                });
            } catch (error) {
                LogService.error('Error replying with message:', error);
                await interaction.reply({
                    content: '❌ Failed to send initial message.',
                    ephemeral: true,
                });
                return;
            }

            if (!message) {
                return;
            }

            const filter = (interaction: any) => interaction.user.id === interaction.user.id;

            const collector = interaction.channel?.createMessageComponentCollector({
                filter,
                time: 60000,
            });

            collector?.on('collect', async buttonInteraction => {
                if (!message) return;

                try {
                    if (buttonInteraction.customId === 'next') {
                        currentPage++;
                        if (currentPage >= pages.length - 1) {
                            (row.components[1] as ButtonBuilder).setDisabled(true);
                        }
                        (row.components[0] as ButtonBuilder).setDisabled(false);
                    } else if (buttonInteraction.customId === 'prev') {
                        currentPage--;
                        if (currentPage <= 0) {
                            (row.components[0] as ButtonBuilder).setDisabled(true);
                        }
                        (row.components[1] as ButtonBuilder).setDisabled(false);
                    }

                    await buttonInteraction.update({
                        embeds: [pages[currentPage]],
                        components: [row],
                    });
                } catch (error) {
                    LogService.error('Error during button interaction:', error);
                }
            });

            collector?.on('end', async () => {
                if (!message) return;

                row.components.forEach(button => (button as ButtonBuilder).setDisabled(true));
                try {
                    await interaction.editReply({ components: [row] });
                } catch (error) {
                    LogService.error('Error editing reply:', error);
                }
            });
        } catch (error) {
            LogService.error('Error with lifeverseinfo command:', error);
            await interaction.reply({
                content: '❌ There was an error while executing this command.',
                ephemeral: true,
            });
        }
    },
};

export default LifeVerseInfoCommand;
