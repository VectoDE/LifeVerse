import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import { config } from "../config/config";
import { LogService } from "../services/logService";

import KickCommand from '../commands/moderation/kick';
import BanCommand from "../commands/moderation/ban";
import MuteCommand from "../commands/moderation/mute";
import ClearCommand from "../commands/moderation/clear";
import PingCommand from '../commands/utility/ping';
import InviteCommand from "../commands/utility/invite";
import ServerInfoCommand from "../commands/utility/serverinfo";
import UserInfoCommand from "../commands/utility/userinfo";
import LifeVerseInfoCommand from "../commands/utility/lifeverseinfo";
import TimeoutCommand from "../commands/moderation/timeout";

dotenv.config();

const token: string = config.application.TOKEN;
const clientId = config.application.CLIENT_ID;
const guildId = config.application.TEST_GUILD_ID;

const commandFiles = [
    // Moderation Commands
    KickCommand,
    BanCommand,
    MuteCommand,
    ClearCommand,
    TimeoutCommand,
    // Utility Commands
    PingCommand,
    InviteCommand,
    ServerInfoCommand,
    UserInfoCommand,
    LifeVerseInfoCommand
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
