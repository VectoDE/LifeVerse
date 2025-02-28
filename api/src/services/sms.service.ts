import { Twilio } from 'twilio';
import { config } from '../configs/config';
import { logger } from '../services/logger.service';

const twilioClient = new Twilio(config.gateways.sms.accountSid, config.gateways.sms.authToken);

export class SmsService {
    static async sendSms(to: string, message: string) {
        try {
            const messageResponse = await twilioClient.messages.create({
                body: message,
                from: config.gateways.sms.phoneNumber,
                to,
            });

            return { success: true, messageSid: messageResponse.sid };
        } catch (error: any) {
            logger.error('Error sending SMS:', { error: error.message, stack: error.stack });
            return { success: false, message: 'Error sending SMS', error: error.message };
        }
    }

    static async sendReminder(to: string, reminderMessage: string, sendAt: Date) {
        try {
            const messageResponse = await twilioClient.messages.create({
                body: reminderMessage,
                from: config.gateways.sms.phoneNumber,
                to,
                sendAt: sendAt,
            });

            return { success: true, messageSid: messageResponse.sid };
        } catch (error: any) {
            logger.error('Error sending reminder SMS:', { error: error.message, stack: error.stack });
            return { success: false, message: 'Error sending reminder SMS', error: error.message };
        }
    }
}
