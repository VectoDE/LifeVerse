import axios from 'axios';
import { config } from '../configs/config';

const DISCORD_WEBHOOK_URL = config.discord.webhook.logUrl;

export const sendToDiscord = async (message: string, level: string) => {
    try {
        const embed = {
            username: 'Logger',
            avatar_url: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [
                {
                    title: `${level.toUpperCase()} - Log Message`,
                    description: message,
                    color: level === 'error' ? 0xff0000 : level === 'warn' ? 0xffff00 : 0x00ff00,
                    timestamp: new Date().toISOString(),
                }
            ]
        };

        await axios.post(DISCORD_WEBHOOK_URL, embed);
    } catch (err) {
        console.error('Error sending log to Discord:', err);
    }
};
