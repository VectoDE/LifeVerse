import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { Welcome } from '../../models/Welcome';
import { LogService } from '../../services/logService';

const WelcomeCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Welcome system commands')
        .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable the welcome system. 🌟'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set-channel')
                .setDescription('Set the channel where the welcome message will be sent. 📨')
                .addChannelOption(option =>
                    option.setName('channel').setDescription('The channel where the welcome message will be sent. 🏢').setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the complete welcome system with embed configuration. ⚙️')
                .addChannelOption(option =>
                    option.setName('channel').setDescription('The channel where the welcome message will be sent. 🏢').setRequired(true),
                )
                .addStringOption(option =>
                    option.setName('title').setDescription('Title for the welcome message embed. 📝').setRequired(true),
                )
                .addStringOption(option =>
                    option.setName('description').setDescription('Description for the welcome message embed. 📖').setRequired(true),
                )
                .addStringOption(option =>
                    option.setName('footer').setDescription('Footer text for the welcome message embed. 👣').setRequired(true),
                )
                .addStringOption(option => option.setName('thumbnail').setDescription('URL for the thumbnail image (optional). 🖼️'))
                .addStringOption(option => option.setName('image').setDescription('URL for the main image (optional). 🌅'))
                .addStringOption(option =>
                    option
                        .setName('fields')
                        .setDescription('A list of fields for the embed, format as "fieldName|fieldValue;fieldName2|fieldValue2" 🧠'),
                ),
        )
        .addSubcommand(subcommand => subcommand.setName('details').setDescription('View the current welcome system configuration. 📊'))
        .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable the welcome system. ❌'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove the welcome system using the identifier. 🗑️')
                .addStringOption(option =>
                    option.setName('identifier').setDescription('The identifier of the welcome system to remove. 🔑').setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (!interaction.guild) {
            const embed = new EmbedBuilder().setColor('Red').setTitle('Error! ❌').setDescription('Guild not found. 🛑').setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        if (subcommand === 'enable') {
            try {
                const identifier = Math.random().toString(36).substring(2, 15);

                const existingWelcome = await Welcome.findOne({
                    guildId: interaction.guildId,
                });
                if (existingWelcome && existingWelcome.isEnabled === true) {
                    const embed = new EmbedBuilder()
                        .setColor('Yellow')
                        .setTitle('Already Enabled 🟡')
                        .setDescription('The welcome system is already enabled for this server. 🎉')
                        .setTimestamp();
                    interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }

                await Welcome.findOneAndUpdate(
                    { guildId: interaction.guildId },
                    { $set: { isEnabled: true, identifier } },
                    { upsert: true },
                );

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Welcome System Enabled! ✅')
                    .setDescription(`The welcome system has been successfully enabled for this server. 🥳\nIdentifier: ||${identifier}||`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                LogService.error(`Error enabling the welcome system: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error! ❌')
                            .setDescription('An error occurred while enabling the welcome system. ⚠️')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
            }
        }

        if (subcommand === 'set-channel') {
            const channel = interaction.options.getChannel('channel');

            if (!(channel instanceof TextChannel)) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Error! ❌')
                    .setDescription('Please select a valid text channel. 📴')
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const existingWelcome = await Welcome.findOne({
                guildId: interaction.guildId,
            });
            if (existingWelcome && existingWelcome.channelId === channel.id) {
                const embed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('Info ℹ️')
                    .setDescription(`The welcome channel is already set to <#${channel.id}>. 🎯`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try {
                await Welcome.findOneAndUpdate(
                    { guildId: interaction.guildId },
                    {
                        guildId: interaction.guildId,
                        guildName: interaction.guild.name,
                        channelId: channel.id,
                        channelName: channel.name,
                        userId: interaction.user.id,
                        username: interaction.user.username,
                    },
                    { upsert: true },
                );

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Success! ✅')
                    .setDescription(`The welcome channel has been successfully set to <#${channel.id}>. 🥳`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                LogService.error(`Error setting the welcome channel: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error! ❌')
                            .setDescription('An error occurred while setting the welcome channel. ⚠️')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
            }
        }

        if (subcommand === 'setup') {
            const channel = interaction.options.getChannel('channel') as TextChannel;
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const footer = interaction.options.getString('footer');
            const thumbnail = interaction.options.getString('thumbnail');
            const image = interaction.options.getString('image');
            const fieldsOption = interaction.options.getString('fields');

            const fields: { name: string; value: string }[] = [];

            if (fieldsOption) {
                const fieldPairs = fieldsOption.split(';');
                for (const pair of fieldPairs) {
                    const [fieldName, fieldValue] = pair.split('|');
                    if (fieldName && fieldValue) {
                        fields.push({ name: fieldName, value: fieldValue });
                    }
                }
            }

            const embedData = {
                title,
                description,
                footer,
                thumbnail,
                image,
                fields: fields,
            };

            try {
                await Welcome.findOneAndUpdate(
                    { guildId: interaction.guildId },
                    {
                        guildId: interaction.guildId,
                        guildName: interaction.guild.name,
                        channelId: channel.id,
                        channelName: channel.name,
                        userId: interaction.user.id,
                        username: interaction.user.username,
                        embed: embedData,
                    },
                    { upsert: true },
                );

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Setup Complete! ✅')
                    .setDescription(`The welcome system has been fully configured for this server. 🎉`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                LogService.error(`Error during setup: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error! ❌')
                            .setDescription('An error occurred while setting up the welcome system. ⚠️')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
            }
        }

        if (subcommand === 'details') {
            const welcomeConfig = await Welcome.findOne({
                guildId: interaction.guildId,
            });

            if (!welcomeConfig) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('No Welcome System Configured ❌')
                    .setDescription('The welcome system has not been configured for this server. ⚠️')
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Welcome System Configuration 🔧')
                .setDescription(
                    `**Identifier:** ||${welcomeConfig.identifier}||\n**Channel:** <#${welcomeConfig.channelId}>\n**Enabled:** ${welcomeConfig.isEnabled ? 'Yes ✅' : 'No ❌'}`,
                )
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'disable') {
            try {
                const existingWelcome = await Welcome.findOne({
                    guildId: interaction.guildId,
                });
                if (existingWelcome && existingWelcome.isEnabled === false) {
                    const embed = new EmbedBuilder()
                        .setColor('Yellow')
                        .setTitle('Already Disabled 🟡')
                        .setDescription('The welcome system is already disabled for this server. ❌')
                        .setTimestamp();
                    interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }

                await Welcome.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { isEnabled: false } }, { upsert: true });

                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Welcome System Disabled! ❌')
                    .setDescription('The welcome system has been successfully disabled for this server. ⚠️')
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                LogService.error(`Error disabling the welcome system: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error! ❌')
                            .setDescription('An error occurred while disabling the welcome system. ⚠️')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
            }
        }

        if (subcommand === 'remove') {
            const identifier = interaction.options.getString('identifier');

            if (!identifier) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Error! ❌')
                    .setDescription('Please provide a valid identifier to remove the welcome system. 🔑')
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const welcomeConfig = await Welcome.findOne({ identifier });

            if (!welcomeConfig) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('No Welcome System Found ❌')
                    .setDescription(`No welcome system found with identifier ||${identifier}||. ⚠️`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try {
                await Welcome.deleteOne({ identifier });

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Success! ✅')
                    .setDescription(`The welcome system with identifier ||${identifier}|| has been removed. 🗑️`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            } catch (error) {
                LogService.error(`Error removing the welcome system: ${error}`);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Error! ❌')
                            .setDescription('An error occurred while removing the welcome system. ⚠️')
                            .setTimestamp(),
                    ],
                    ephemeral: true,
                });
            }
        }
    },
};

export default WelcomeCommand;
