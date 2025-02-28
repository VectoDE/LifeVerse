import { Request, Response, RequestHandler } from "express";
import { sendEmail, getEmails, fetchAndStoreEmails } from "../services/email.service";
import { logger } from "../services/logger.service";

export const sendEmailController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { to, subject, text, html } = req.body;

    try {
        if (!to || !subject || !text || !html) {
            res.status(400).json({ message: 'To, subject, text, and html are required' });
            return;
        }

        const email = await sendEmail(to, subject, text, html);
        logger.info("Email sent successfully", { to, subject });
        res.status(200).json({ success: true, email });
    } catch (error: any) {
        logger.error("Error sending email", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getEmailsController: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const emails = await getEmails();
        logger.info("Fetched all emails", { count: emails.length });
        res.status(200).json({ success: true, emails });
    } catch (error: any) {
        logger.error("Error fetching emails", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const fetchAndStoreEmailsController: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const emails = await fetchAndStoreEmails();
        logger.info("Fetched and stored emails", { count: emails.length });
        res.status(200).json({ success: true, emails });
    } catch (error: any) {
        logger.error("Error fetching and storing emails", { error: error.message, stack: error.stack });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
