//import { WebhookClient, EmbedBuilder } from 'discord.js';
//import { config } from '../config/config';

//const webhookClient = new WebhookClient({
//    id: config.webhooks.logWebhook.id,
//    token: config.webhooks.logWebhook.token
//});

export class LogService {
    //private static async sendToDiscord(message: string, type: string) {
    //    const embed = new EmbedBuilder()
    //        .setColor(
    //            type === 'ERROR' ? 0xFF0000 :  // Red
    //            type === 'WARN' ? 0xFFFF00 :   // Yellow
    //            type === 'INFO' ? 0x00FF00 :   // Green
    //            type === 'DEBUG' ? 0xFFA500 :  // Orange
    //            0x808080                      // Grey
    //        )
    //        .setTitle(`${type} Log`)
    //        .setDescription(message)
    //        .setTimestamp()
    //        .setFooter({ text: 'Log Service' });

    //    try {
    //        await webhookClient.send({ embeds: [embed] });
    //    } catch (err) {
    //        console.error(`Failed to send log to Discord: ${err}`);
    //    }
    //}

    public static info(message: string, ...optionalParams: any[]) {
        console.info(message, ...optionalParams);
        //LogService.sendToDiscord(message, 'INFO');
    }

    public static warn(message: string, ...optionalParams: any[]) {
        console.warn(message, ...optionalParams);
        //LogService.sendToDiscord(message, 'WARN');
    }

    public static error(message: string, ...optionalParams: any[]) {
        console.error(message, ...optionalParams);
        //LogService.sendToDiscord(message, 'ERROR');
    }

    public static debug(message: string, ...optionalParams: any[]) {
        console.debug(message, ...optionalParams);
        //LogService.sendToDiscord(message, 'DEBUG');
    }
}
