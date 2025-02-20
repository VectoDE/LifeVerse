import { Client } from "discord.js";
import { IPTracking } from "../models/IP"; // Dein Modell importieren

export const handleIpTrackingEvent = (client: Client) => {
    client.on("messageCreate", async (message) => {
        try {
            if (message.author.bot) return;

            const ip = message.client.ip;

            if (ip) {
                const ipTracking = new IPTracking({
                    userId: message.author.id,
                    ip: ip,
                    timestamp: new Date(),
                });

                await ipTracking.save();
                console.log(`IP gespeichert: ${ip} für Benutzer ${message.author.tag}`);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error in IP tracking: ${errorMessage}`);
        }
    });
};
