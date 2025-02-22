import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { performance } from 'perf_hooks';
import { Command } from '../../functions/handleCommands';
import { config } from '../../config/config';
import { LogService } from '../../services/logService';
import { ArrayUtil } from '../../utils/arrayUtil';
import { makeRequest } from '../../utils/requestUtil';

const services = [
    { name: '🌍 Website', url: config.apiRequests.WEBSITE },
    { name: '🛠️ API', url: config.apiRequests.API },
];

const PingCommand: Command = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Shows the ping of the Discord bot, server, and LifeVerse services.'),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: '⚠️ This command can only be used in a server.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: false });

        try {
            const botLatency = interaction.client.ws.ping;
            const botStatus =
                botLatency < 200 ? `🟢 Online (${botLatency}ms)` : botLatency < 500 ? `🟠 Maintenance (${botLatency}ms)` : '🔴 Offline';

            const start = performance.now();
            await interaction.guild.members.fetch();
            const end = performance.now();
            const serverLatency = Math.round(end - start);
            const serverStatus =
                serverLatency < 200
                    ? `🟢 Online (${serverLatency}ms)`
                    : serverLatency < 500
                      ? `🟠 Maintenance (${serverLatency}ms)`
                      : '🔴 Offline';

            const serviceStatuses = await Promise.all(
                services.map(async service => {
                    try {
                        const serviceStart = performance.now();
                        const response = await makeRequest('service', service.url);
                        const serviceEnd = performance.now();
                        const latency = Math.round(serviceEnd - serviceStart);

                        if (response && response.status === 200) {
                            return {
                                name: service.name,
                                status: `🟢 Online (${latency}ms)`,
                            };
                        } else if (response && response.status === 503) {
                            return {
                                name: service.name,
                                status: `🟠 Maintenance (${latency}ms)`,
                            };
                        } else {
                            return { name: service.name, status: `🔴 Offline` };
                        }
                    } catch (error) {
                        return { name: service.name, status: '🔴 Offline' };
                    }
                }),
            );

            const gameServers = config.apiRequests.GAME_SERVERS_LIST;
            const gameServerStatuses = await Promise.all(
                gameServers.map(async server => {
                    try {
                        const response = await makeRequest('game_server', server.url);

                        let status = '🔴 Offline';
                        if (response && response.status === 200) {
                            status = '🟢 Online';
                        } else if (response && response.status === 503) {
                            status = '🟠 Maintenance';
                        }

                        return { name: server.name, status };
                    } catch (error) {
                        return { name: server.name, status: '🔴 Offline' };
                    }
                }),
            );

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('🌐 LifeVerse Service Status & Ping')
                .setDescription('Here are the current ping values and service statuses:')
                .addFields(
                    { name: '🤖 Discord Bot', value: botStatus, inline: true },
                    {
                        name: '🖥️ Server Latency',
                        value: serverStatus,
                        inline: true,
                    },
                    ...serviceStatuses.map(s => ({
                        name: s.name,
                        value: s.status,
                        inline: true,
                    })),
                );

            const chunkedGameServers = ArrayUtil.chunkArray(gameServerStatuses, 5);
            chunkedGameServers.forEach((chunk, _index) => {
                const serverFields = chunk.map(s => ({
                    name: s.name,
                    value: s.status,
                    inline: true,
                }));
                embed.addFields(...serverFields);
            });

            embed
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            LogService.error('Error fetching latencies or services:', error);
            await interaction.editReply({
                content: '❌ Could not retrieve latency or service statuses. Please try again later.',
            });
        }
    },
};

export default PingCommand;
