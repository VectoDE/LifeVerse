import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import { config } from "../config/config";
import { LogService } from "../services/logService";

import PingCommand from '../commands/utility/ping';
import KickCommand from '../commands/moderation/kick';

dotenv.config();

const token: string = config.application.TOKEN;
const clientId = config.application.CLIENT_ID;
const guildId = config.application.TEST_GUILD_ID;

const commandFiles = [
    PingCommand,
    KickCommand
];

const commands: any[] = [];

for (const command of commandFiles) {
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        LogService.info(`The command is missing a required 'data' or 'execute' property.`);
    }
}

const rest = new REST({ version: "9" }).setToken(token);

export const registerCommands = async () => {
    try {
        LogService.info(`Started refreshing ${commands.length} application (/) commands.`);

        const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        LogService.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        LogService.error(`${error}`);
    }
};
