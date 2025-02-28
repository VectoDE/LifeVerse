import nodemailer from "nodemailer";
import { Email } from "../models/Email";

const transporter = nodemailer.createTransport({
    host: "smtp.your-smtp-server.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);

        const email = new Email({ to, subject, text, html });
        await email.save();

        return email;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

export const getEmails = async () => {
    const emails = await Email.find();
    return emails;
};

export const fetchAndStoreEmails = async () => {
    const existingEmails = await getEmails();
    const missingEmails = await getNewEmails();

    const allEmails = [...existingEmails, ...missingEmails];

    for (const email of missingEmails) {
        const emailDoc = new Email(email);
        await emailDoc.save();
    }

    return allEmails;
};

const getNewEmails = async () => {
    return [];
};
