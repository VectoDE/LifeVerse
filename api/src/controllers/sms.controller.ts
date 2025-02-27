import { Request, Response, RequestHandler } from 'express';
import { SmsService } from '../services/sms.service';
import { Sms } from '../models/Sms';

export const sendSms: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        res.status(400).json({ message: 'Phone number and message are required' });
        return;
    }

    try {
        const response = await SmsService.sendSms(phoneNumber, message);

        if (response.success) {
            const sms = new Sms({
                phoneNumber,
                message,
                sentAt: new Date(),
                status: 'sent',
            });

            await sms.save();

            res.status(200).json({ message: 'SMS sent successfully', messageSid: response.messageSid });
        } else {
            res.status(500).json({ message: 'Failed to send SMS', error: response.error });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error sending SMS', error: error.message });
    }
};

export const sendReminder: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, reminderMessage, sendAt } = req.body;

    if (!phoneNumber || !reminderMessage || !sendAt) {
        res.status(400).json({ message: 'Phone number, reminder message, and send time are required' });
        return;
    }

    try {
        const reminderDate = new Date(sendAt);

        const response = await SmsService.sendReminder(phoneNumber, reminderMessage, reminderDate);

        if (response.success) {
            const sms = new Sms({
                phoneNumber,
                message: reminderMessage,
                sentAt: reminderDate,
                status: 'scheduled',
            });

            await sms.save();

            res.status(200).json({ message: 'Reminder SMS scheduled successfully', messageSid: response.messageSid });
        } else {
            res.status(500).json({ message: 'Failed to send reminder SMS', error: response.error });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error scheduling reminder SMS', error: error.message });
    }
};

export const getAllSms: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const smsRecords = await Sms.find();
        res.status(200).json(smsRecords);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching SMS records', error: error.message });
    }
};

export const getSmsById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { smsId } = req.params;

    try {
        const sms = await Sms.findById(smsId);
        if (!sms) {
            res.status(404).json({ message: 'SMS record not found' });
            return;
        }

        res.status(200).json(sms);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching SMS record', error: error.message });
    }
};
