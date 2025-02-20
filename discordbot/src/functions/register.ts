import dotenv from "dotenv";
import { REST, Routes } from "discord.js";

import { PingCommand } from '../commands/ping';
import { config } from "../config/config";

dotenv.config();

function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing variable: ${name}`);
    }
    return value;
}

const token: string = config.application.TOKEN;
const clientId: string = config.application.CLIENT_ID;
const guildId: string = config.application.TEST_GUILD_ID;

const commandFiles = [
    PingCommand
];

const commands: any[] = [];

for (const command of commandFiles) {
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        console.info(`The command is missing a required 'data' or 'execute' property.`);
    }
}

const rest = new REST({ version: "9" }).setToken(token);

export const registerCommands = async () => {
    try {
        console.info(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};
