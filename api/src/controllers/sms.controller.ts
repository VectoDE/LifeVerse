import { Request, Response, RequestHandler } from 'express';
import { SmsService } from '../services/sms.service';
import { Sms } from '../models/Sms';
import { logger } from '../services/logger.service';

export const sendSms: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        logger.warn('Missing phone number or message', { phoneNumber, message });
        res.status(400).json({ message: 'Phone number and message are required' });
        return;
    }

    try {
        logger.info('Sending SMS', { phoneNumber, message });
        const response = await SmsService.sendSms(phoneNumber, message);

        if (response.success) {
            const sms = new Sms({
                phoneNumber,
                message,
                sentAt: new Date(),
                status: 'sent',
            });

            await sms.save();
            logger.info('SMS sent successfully', { phoneNumber, messageSid: response.messageSid });

            res.status(200).json({ message: 'SMS sent successfully', messageSid: response.messageSid });
        } else {
            logger.error('Failed to send SMS', { error: response.error });
            res.status(500).json({ message: 'Failed to send SMS', error: response.error });
        }
    } catch (error: any) {
        logger.error('Error sending SMS', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error sending SMS', error: error.message });
    }
};

export const sendReminder: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, reminderMessage, sendAt } = req.body;

    if (!phoneNumber || !reminderMessage || !sendAt) {
        logger.warn('Missing phone number, reminder message, or send time', { phoneNumber, reminderMessage, sendAt });
        res.status(400).json({ message: 'Phone number, reminder message, and send time are required' });
        return;
    }

    try {
        const reminderDate = new Date(sendAt);
        logger.info('Scheduling reminder SMS', { phoneNumber, reminderMessage, sendAt: reminderDate });

        const response = await SmsService.sendReminder(phoneNumber, reminderMessage, reminderDate);

        if (response.success) {
            const sms = new Sms({
                phoneNumber,
                message: reminderMessage,
                sentAt: reminderDate,
                status: 'scheduled',
            });

            await sms.save();
            logger.info('Reminder SMS scheduled successfully', { phoneNumber, messageSid: response.messageSid });

            res.status(200).json({ message: 'Reminder SMS scheduled successfully', messageSid: response.messageSid });
        } else {
            logger.error('Failed to send reminder SMS', { error: response.error });
            res.status(500).json({ message: 'Failed to send reminder SMS', error: response.error });
        }
    } catch (error: any) {
        logger.error('Error scheduling reminder SMS', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error scheduling reminder SMS', error: error.message });
    }
};

export const getAllSms: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        logger.info('Fetching all SMS records');
        const smsRecords = await Sms.find();
        res.status(200).json(smsRecords);
    } catch (error: any) {
        logger.error('Error fetching SMS records', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching SMS records', error: error.message });
    }
};

export const getSmsById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { smsId } = req.params;

    try {
        logger.info('Fetching SMS record by ID', { smsId });
        const sms = await Sms.findById(smsId);
        if (!sms) {
            logger.warn('SMS record not found', { smsId });
            res.status(404).json({ message: 'SMS record not found' });
            return;
        }

        res.status(200).json(sms);
    } catch (error: any) {
        logger.error('Error fetching SMS record', { smsId, error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching SMS record', error: error.message });
    }
};

export const getAllReminders: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        logger.info('Fetching all scheduled reminders');
        const reminders = await Sms.find({ status: 'scheduled' });
        res.status(200).json(reminders);
    } catch (error: any) {
        logger.error('Error fetching reminders', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching reminders', error: error.message });
    }
};

export const getReminderById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { reminderId } = req.params;

    try {
        logger.info('Fetching reminder by ID', { reminderId });
        const reminder = await Sms.findOne({ _id: reminderId, status: 'scheduled' });
        if (!reminder) {
            logger.warn('Reminder not found', { reminderId });
            res.status(404).json({ message: 'Reminder not found' });
            return;
        }

        res.status(200).json(reminder);
    } catch (error: any) {
        logger.error('Error fetching reminder', { reminderId, error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching reminder', error: error.message });
    }
};
