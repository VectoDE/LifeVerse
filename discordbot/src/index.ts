import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { config } from './config/config';
import { LogService } from './services/logService';

import { Command } from './functions/handleCommands';
import { connectDB } from './events/connectDB';
import { handleReadyEvent } from './events/ready';
import { handleIpTrackingEvent } from './events/ipTracker';

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
    ]
}) as ExtendedClient;

client.commands = new Collection<string, Command>();

const commandFolders = readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const { default: command } = require(path.join(__dirname, 'commands', folder, file));

        LogService.info(`Loading Command: ${file}`);

        if (!command?.data?.name) {
            LogService.error(`Command in file ${file} is missing a 'data.name' property.`);
            continue;
        }

        client.commands.set(command.data.name, command);
    }
}

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error executing command: ${errorMessage}`);
        }
    }
});

// Connect to MongoDB
connectDB();

// Handle bot events
handleReadyEvent(client);
handleIpTrackingEvent(client);

client.login(config.application.TOKEN);

export default client;