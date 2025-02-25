import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import server from './server';
import { config } from './config/config';
import { LogService } from './services/logService';

import { Command } from './functions/handleCommands';
import { connectDB } from './events/connectDB';
import { handleReadyEvent } from './events/ready';
import { handleIpTrackingEvent } from './events/ipTracker';
import { handleBanEvasionEvent } from './events/banEvasion';
import { handleWelcomeEvent } from './events/welcomeMessage';
import { commandUsageEvent } from './events/commandUsage';
import { modalSubmitHandler } from './events/modalSubmitHandler';
import { handleButtonIneraction } from './events/buttonHandler';
import { handleAutoMessageRule } from './events/autoModeration';

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
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

function displayCommandsTable() {
    const maxCommandNameLength = Math.max(...[...client.commands.values()].map(command => command.data.name.length));
    const maxDescriptionLength = Math.max(...[...client.commands.values()].map(command => command.data.description.length));

    const commandColumnWidth = maxCommandNameLength + 2;
    const descriptionColumnWidth = maxDescriptionLength + 2;

    console.log(`| ${'Command Name'.padEnd(commandColumnWidth)} | ${'Description'.padEnd(descriptionColumnWidth)} |`);

    const separator = `|${'-'.repeat(commandColumnWidth + 2)}|${'-'.repeat(descriptionColumnWidth + 2)}|`;
    console.log(separator);

    client.commands.forEach(command => {
        console.log(`| ${command.data.name.padEnd(commandColumnWidth)} | ${command.data.description.padEnd(descriptionColumnWidth)} |`);
    });

    console.log(separator);
}

client.commands = new Collection<string, Command>();

const commandFolders = readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const { default: command } = require(path.join(__dirname, 'commands', folder, file));

        if (!command?.data?.name) {
            LogService.error(`Command in file ${file} is missing a 'data.name' property.`);
            continue;
        }

        client.commands.set(command.data.name, command);
    }
}

displayCommandsTable();

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);

            await commandUsageEvent(interaction);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            LogService.error(`Error executing command: ${errorMessage}`);
        }
    }

    if (interaction.isModalSubmit()) {
        await modalSubmitHandler(interaction);
    }

    if (interaction.isButton()) {
        await handleButtonIneraction(interaction);
    }
});

// Connect the database
connectDB();

// Handle bot events
handleReadyEvent(client);
handleIpTrackingEvent(client);
handleBanEvasionEvent(client);
handleWelcomeEvent(client);
handleAutoMessageRule(client);

// Start Express-Server
server.listen(config.server.PORT || 3000, () => {
    console.log(`API server is running on port ${config.server.PORT || 3000}`);
});

client.login(config.application.TOKEN);

export default client;
