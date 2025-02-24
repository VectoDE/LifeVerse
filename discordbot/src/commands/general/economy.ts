import client from '../../index';
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, GuildMember, PermissionsBitField } from 'discord.js';
import { Command } from '../../functions/handleCommands';
import { LogService } from '../../services/logService';
import { Economy } from '../../models/Economy';

const EconomyCommand: Command = {
    data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('💰 Manage your economy.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('bank')
            .setDescription('🏦 View your bank balance.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('wallet')
            .setDescription('💳 View your wallet balance.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('pay')
            .setDescription('💸 Pay money to another user.')
            .addUserOption(option => option.setName('user').setDescription('👤 User to pay').setRequired(true))
            .addIntegerOption(option => option.setName('amount').setDescription('💵 Amount to pay').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('withdraw')
            .setDescription('🏧 Withdraw money from the bank to your wallet.')
            .addIntegerOption(option => option.setName('amount').setDescription('💵 Amount to withdraw').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('deposit')
            .setDescription('💰 Deposit money from your wallet to your bank.')
            .addIntegerOption(option => option.setName('amount').setDescription('💵 Amount to deposit').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('work')
            .setDescription('💼 Work to earn money.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('portfolio')
            .setDescription('📈 View your portfolio (crypto, stocks, NFTs).')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('shop')
            .setDescription('🛒 Shop to view available items for purchase in your economy.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('buy')
            .setDescription('🛍️ Purchase an item from the shop for your economy.')
            .addStringOption(option =>
                option.setName('category')
                    .setDescription('🛒 Select the category (crypto, stocks, cars, trucks, etc.)')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Crypto', value: 'crypto' },
                        { name: 'Stocks', value: 'stocks' },
                        { name: 'NFTs', value: 'nfts' },
                        { name: 'Cars', value: 'cars' },
                        { name: 'Trucks', value: 'trucks' },
                        { name: 'Groceries', value: 'groceries' },
                        { name: 'Properties', value: 'properties' },
                        { name: 'Computers', value: 'computers' }
                    )
            )
            .addStringOption(option =>
                option.setName('item')
                    .setDescription('🛒 Select the item to purchase')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('🔢 Amount of items to purchase')
                    .setRequired(true)
                    .setMinValue(1)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('leaderboard')
            .setDescription('🏆 View the top 10 users with the most earnings.')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('add-money')
            .setDescription('💰 Gives a user a certain amount of money into his bank')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('👤 The user you want to add money to')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('💵 The amount you want to add to the user')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('reset-money')
            .setDescription('🔄 Resets the money of a user or from everyone.')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('👤 Der Benutzer, dessen Geld zurückgesetzt werden soll')
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option.setName('all')
                    .setDescription('🔁 Reset every money from every user.')
                    .setRequired(false)
            )
    ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: '⚠️ This command can only be used in a server.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: false });

        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        const shopItems: { [key: string]: { [key: string]: number } } = {
            "crypto": {
                "Bitcoin": 50000,
                "Ethereum": 3000,
                "Binance Coin": 4000,
                "Ripple": 200,
                "Cardano": 200,
                "Solana": 200,
                "Polkadot": 200,
                "Dogecoin": 200,
                "Litecoin": 200,
                "Chainlink": 30,
                "Avalanche": 80,
                "Polygon": 1.5,
                "Shiba Inu": 0.00001,
                "Uniswap": 25,
                "Terra": 90,
                "Fantom": 3,
                "Aave": 350,
                "Tezos": 4,
                "Cosmos": 15,
                "VeChain": 0.1,
            },
            "stocks": {
                "Asus": 100,
                "Intel": 50,
                "Microsoft": 300,
                "Apple": 150,
                "Tesla": 700,
                "Amazon": 3300,
                "Google": 2800,
                "Facebook": 350,
                "NVIDIA": 600,
                "AMD": 100,
                "Netflix": 550,
                "Berkshire Hathaway": 400000,
                "Walmart": 140,
                "Coca-Cola": 55,
                "Disney": 170,
                "PepsiCo": 150,
                "McDonald's": 240,
                "Johnson & Johnson": 170,
                "ExxonMobil": 60,
                "Visa": 230,
            },
            "nfts": {
                "CryptoPunk #1": 500000,
                "Bored Ape #1": 1000000,
                "CryptoPunk #2": 450000,
                "Bored Ape #2": 950000,
                "Axie Infinity #1": 100000,
                "Meebits #1": 200000,
                "World of Women #1": 300000,
                "Cool Cats #1": 180000,
                "Doodles #1": 250000,
                "World of Women #2": 320000,
                "Rumble Kong League #1": 50000,
                "VeeFriends #1": 150000,
                "The Sandbox #1": 80000,
                "Zed Run #1": 100000,
                "Decentraland #1": 120000,
                "CryptoKitties #1": 50000,
                "Hashmasks #1": 400000,
                "Rumble Kong League #2": 75000,
                "Bored Ape Yacht Club #1": 850000,
                "Pudgy Penguins #1": 200000,
            },
            "cars": {
                "Sports Car": 500000,
                "SUV": 400000,
                "Sedan": 30000,
                "Truck": 35000,
                "Convertible": 60000,
                "Luxury Sedan": 100000,
                "Luxury SUV": 120000,
                "Hybrid Car": 35000,
                "Electric Car": 45000,
                "Muscle Car": 70000,
                "Pickup Truck": 35000,
                "Coupe": 40000,
                "Minivan": 30000,
                "Station Wagon": 25000,
                "Crossover": 50000,
                "Roadster": 120000,
                "Sports Coupe": 90000,
                "Luxury Sports Car": 250000,
                "Luxury Electric Car": 130000,
                "Classic Car": 75000,
            },
            "trucks": {
                "Pickup": 300000,
                "Freight Truck": 700000,
                "Cargo Truck": 400000,
                "Dump Truck": 600000,
                "Box Truck": 500000,
                "Tow Truck": 450000,
                "Flatbed Truck": 350000,
                "Refrigerated Truck": 650000,
                "Tanker Truck": 550000,
                "Concrete Mixer Truck": 700000,
                "Garbage Truck": 300000,
                "Logging Truck": 450000,
                "Heavy Duty Truck": 750000,
                "Tractor Truck": 400000,
                "Service Truck": 300000,
                "Mini Dump Truck": 350000,
                "Pickup with Trailer": 400000,
                "Logging Flatbed": 450000,
                "Utility Truck": 600000,
                "Fire Truck": 800000,
            },
            "groceries": {
                "Apple": 2,
                "Banana": 1,
                "Carrot": 3,
                "Tomato": 2,
                "Lettuce": 1.5,
                "Potato": 1,
                "Cucumber": 1.2,
                "Onion": 1.8,
                "Garlic": 0.5,
                "Bread": 2.5,
                "Milk": 1.8,
                "Cheese": 5,
                "Eggs": 3,
                "Chicken Breast": 10,
                "Beef": 12,
                "Pork Chops": 8,
                "Fish Fillets": 15,
                "Orange": 3,
                "Strawberries": 5,
                "Avocado": 2,
            },
            "properties": {
                "House": 2000000,
                "Apartment": 500000,
                "Mansion": 5000000,
                "Villa": 2500000,
                "Townhouse": 1000000,
                "Condo": 400000,
                "Loft": 600000,
                "Penthouse": 2000000,
                "Cottage": 300000,
                "Farmhouse": 350000,
                "Beachfront Property": 3000000,
                "Mountain Cabin": 1500000,
                "Suburban House": 600000,
                "City Apartment": 800000,
                "Luxury Villa": 4500000,
                "Castle": 10000000,
                "Rural Property": 200000,
                "Investment Property": 700000,
                "Renovation Property": 250000,
                "Eco-Friendly Home": 600000,
            },
            "computers": {
                "Laptop": 1500,
                "Desktop": 2000,
                "Gaming PC": 2500,
                "Business Laptop": 1000,
                "Workstation PC": 3500,
                "Mini PC": 500,
                "All-in-One PC": 1500,
                "Server": 5000,
                "MacBook Pro": 2500,
                "iMac": 2200,
                "Razer Blade": 3000,
                "Surface Laptop": 1200,
                "Chromebook": 400,
                "Ultrabook": 1800,
                "Custom PC": 2000,
                "Home Theater PC": 2000,
                "Laptop for Students": 800,
                "High-End Gaming Laptop": 3000,
                "Portable Gaming PC": 2500,
            }
        };

        const updateShopPrices = () => {
            for (const category in shopItems) {
                for (const item in shopItems[category]) {
                    let fluctuation = (Math.random() - 0.5) * 0.1; // +/- 10% Changes
                    let newPrice = shopItems[category][item] * (1 + fluctuation);
                    shopItems[category][item] = Math.max(0, newPrice);
                }
            }
        };

        updateShopPrices();

        try {
            if (subcommand === 'bank') {
                let userEconomy = await Economy.findOne({ userId });

                if (!userEconomy) {
                    userEconomy = new Economy({
                        identifier: Math.random().toString(36).substring(2, 15),
                        userId,
                        wallet: 0,
                        bank: 1000,
                        portfolio: { crypto: [], stocks: [], nfts: [] },
                    });

                    await userEconomy.initializePortfolio();

                    await userEconomy.save();
                    interaction.editReply({ content: 'Your account has been created with 1000 in your bank account and portfolio initialized.' });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('💳 Your Bank Balance')
                    .setDescription(`Your current bank balance is: **${userEconomy.bank}**.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'wallet') {
                const userEconomy = await Economy.findOne({ userId });
                if (!userEconomy) {
                    const newEconomy = new Economy({
                        identifier: Math.random().toString(36).substring(2, 15),
                        userId,
                        wallet: 0,
                        bank: 1000,
                    });
                    await newEconomy.save();
                    interaction.editReply({ content: 'Your account has been created with 1000 in your bank account.' });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('💰 Your Wallet Balance')
                    .setDescription(`Your current wallet balance is: **${userEconomy.wallet}**.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'pay') {
                const targetUser = interaction.options.getUser('user');
                const amount = interaction.options.getInteger('amount');

                if (!targetUser || !amount || amount <= 0) {
                    interaction.editReply({
                        content: '❌ Please specify a valid user and amount to pay.',
                    });
                    return;
                }

                const senderEconomy = await Economy.findOne({ userId });
                if (!senderEconomy || senderEconomy.bank < amount) {
                    interaction.editReply({
                        content: '❌ You do not have enough money in your bank account.',
                    });
                    return;
                }

                senderEconomy.bank -= amount;
                await senderEconomy.save();

                const recipientEconomy = await Economy.findOne({ userId: targetUser.id });
                if (!recipientEconomy) {
                    const newRecipientEconomy = new Economy({
                        identifier: Math.random().toString(36).substring(2, 15),
                        userId: targetUser.id,
                        wallet: 0,
                        bank: amount,
                    });
                    await newRecipientEconomy.save();
                } else {
                    recipientEconomy.bank += amount;
                    await recipientEconomy.save();
                }

                const embed = new EmbedBuilder()
                    .setColor('Purple')
                    .setTitle('💸 Payment Made')
                    .setDescription(`You have paid **${amount}** to **${targetUser.tag}**.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'withdraw' || subcommand === 'deposit') {
                const amount = interaction.options.getInteger('amount');

                if (!amount || amount <= 0) {
                    interaction.editReply({
                        content: '❌ Please specify a valid amount to process.',
                    });
                    return;
                }

                const userEconomy = await Economy.findOne({ userId });
                if (!userEconomy) {
                    interaction.editReply({
                        content: '❌ You don\'t have an economy account yet. Please create one first.',
                    });
                    return;
                }

                let embed = new EmbedBuilder().setTimestamp();

                if (subcommand === 'withdraw') {
                    if (userEconomy.bank < amount) {
                        interaction.editReply({
                            content: '❌ You do not have enough money in your bank to withdraw that amount.',
                        });
                        return;
                    }

                    userEconomy.bank -= amount;
                    userEconomy.wallet += amount;
                    await userEconomy.save();

                    embed
                        .setColor('Yellow')
                        .setTitle('💵 Withdrawal Successful')
                        .setDescription(`You have withdrawn **${amount}** from your **bank** to your **wallet**.`);
                }

                if (subcommand === 'deposit') {
                    if (userEconomy.wallet < amount) {
                        interaction.editReply({
                            content: '❌ You do not have enough money in your wallet to deposit that amount.',
                        });
                        return;
                    }

                    userEconomy.wallet -= amount;
                    userEconomy.bank += amount;
                    await userEconomy.save();

                    embed
                        .setColor('Green')
                        .setTitle('💰 Deposit Successful')
                        .setDescription(`You have deposited **${amount}** from your **wallet** to your **bank**.`);
                }

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'work') {
                let userEconomy = await Economy.findOne({ userId });

                if (!userEconomy) {
                    userEconomy = new Economy({
                        identifier: Math.random().toString(36).substring(2, 15),
                        userId,
                        wallet: 0,
                        bank: 1000,
                        lastWorkedAt: null,
                        portfolio: { crypto: [], stocks: [], nfts: [] },
                    });
                    await userEconomy.save();
                }

                const currentTime = new Date();
                const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // one hour back

                if (userEconomy.lastWorkedAt && userEconomy.lastWorkedAt > oneHourAgo) {
                    const remainingTime = userEconomy.lastWorkedAt.getTime() + 3600000 - Date.now(); // in ms

                    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60)); // hours
                    const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); // minutes
                    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000); // seconds

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('⏳ Work Cooldown')
                        .setDescription('❌ You have already worked within the last hour. Please try again later.')
                        .addFields(
                            { name: 'Remaining Time', value: `⏰ Time left until you can work again: **${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s**` }
                        )
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });
                    return;
                }

                const earnedMoney = Math.floor(Math.random() * 200) + 100;
                userEconomy.bank += earnedMoney;
                userEconomy.lastWorkedAt = currentTime;

                await userEconomy.save();

                const embed = new EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle('🛠️ Work Completed')
                    .setDescription(`You worked and earned **${earnedMoney}**! Your bank account now has **${userEconomy.bank}**.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'portfolio') {
                const userEconomy = await Economy.findOne({ userId });
                if (!userEconomy) {
                    interaction.editReply({
                        content: '❌ Your portfolio does not exist yet. Please create an economy account first.',
                    });
                    return;
                }

                const calculatePortfolioValue = (items: { name: string; amount: number; value: number }[]) => {
                    return items.reduce((total, item) => total + (item.amount * item.value), 0);
                };

                const cryptoValue = calculatePortfolioValue(userEconomy.portfolio.crypto);
                const stocksValue = calculatePortfolioValue(userEconomy.portfolio.stocks);
                const nftValue = calculatePortfolioValue(userEconomy.portfolio.nfts);

                const totalValue = cryptoValue + stocksValue + nftValue;

                const cryptoDescription = userEconomy.portfolio.crypto.length > 0
                    ? userEconomy.portfolio.crypto.map(crypto => `${crypto.name}: ${crypto.amount} | Value: ${crypto.value}`).join('\n')
                    : 'Haven`t bought anything yet';

                const stocksDescription = userEconomy.portfolio.stocks.length > 0
                    ? userEconomy.portfolio.stocks.map(stock => `${stock.name}: ${stock.amount} | Value: ${stock.value}`).join('\n')
                    : 'Haven`t bought anything yet';

                const nftDescription = userEconomy.portfolio.nfts.length > 0
                    ? userEconomy.portfolio.nfts.map(nft => `${nft.name}: ${nft.amount} | Value: ${nft.value}`).join('\n')
                    : 'Haven`t bought anything yet';

                const embed = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle('📊 Your Portfolio')
                    .setDescription('Here is your portfolio of crypto, stocks, and NFTs.')
                    .addFields(
                        { name: 'Cryptos', value: cryptoDescription },
                        { name: 'Stocks', value: stocksDescription },
                        { name: 'NFTs', value: nftDescription },
                        { name: 'Total Portfolio Value', value: `💰 Total Value: ${totalValue}€` }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'shop') {
                const embeds: EmbedBuilder[] = [];
                const categories = Object.entries(shopItems);

                categories.forEach(([category, items], _index) => {
                    const categoryText = `${category.charAt(0).toUpperCase() + category.slice(1)}\n` +
                        Object.entries(items)
                            .map(([itemName, price]) => {
                                const formattedPrice = Math.floor(price);
                                return `${itemName} - Amount: ${formattedPrice}€ 💰`;
                            })
                            .join('\n');

                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setTitle(`🛍️ ${category.charAt(0).toUpperCase() + category.slice(1)} Items`)
                        .setDescription(categoryText);

                    embeds.push(embed);
                });

                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('back')
                            .setLabel('Zurück')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Weiter')
                            .setStyle(ButtonStyle.Primary)
                    );

                let currentPage = 0;

                if (!interaction.channel) {
                    return;
                }

                await interaction.editReply({
                    embeds: [embeds[currentPage]],
                    components: [row]
                });

                const collector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 60000 // 1 minute
                });

                collector.on('collect', async (i) => {
                    if (i.user.id !== interaction.user.id) return;

                    if (i.customId === 'next') {
                        currentPage += 1;
                        if (currentPage === embeds.length - 1) {
                            row.components[1].setDisabled(true);
                        }
                        row.components[0].setDisabled(false);

                    } else if (i.customId === 'back') {
                        currentPage -= 1;
                        if (currentPage === 0) {
                            row.components[0].setDisabled(true);
                        }
                        row.components[1].setDisabled(false);
                    }

                    await i.update({
                        embeds: [embeds[currentPage]],
                        components: [row]
                    });
                });

                collector.on('end', async () => {
                    row.components.forEach((button) => button.setDisabled(true));
                    await interaction.editReply({ components: [row] });
                });
            } else if (subcommand === 'buy') {
                const itemCategory = interaction.options.getString('category');
                const item = interaction.options.getString('item');
                const amount = interaction.options.getInteger('amount') || 1;

                if (!itemCategory || !item || !amount) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('❌ Invalid Input')
                        .setDescription('❌ Please provide a valid category, item, and amount.')
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }

                if (!shopItems[itemCategory]) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('❌ Invalid Category')
                        .setDescription(`❌ Invalid category. Available categories are: ${Object.keys(shopItems).join(', ')}.`)
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }

                if (!shopItems[itemCategory][item]) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('❌ Item Not Found')
                        .setDescription(`❌ The item "${item}" is not available in the selected category "${itemCategory}".`)
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }

                const totalPrice = shopItems[itemCategory][item] * amount;

                const userEconomy = await Economy.findOne({ userId: interaction.user.id });

                if (!userEconomy) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('❌ Account Not Found')
                        .setDescription('❌ Your economy account does not exist. Please create one first.')
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }

                if (userEconomy.wallet < totalPrice) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('❌ Insufficient Funds')
                        .setDescription(`❌ You do not have enough money to buy **${amount} ${item}**. You need **${totalPrice}** in your wallet.`)
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }

                userEconomy.wallet -= totalPrice;

                const portfolioCategory = itemCategory === "crypto" ? userEconomy.portfolio.crypto :
                    itemCategory === "stocks" ? userEconomy.portfolio.stocks :
                        itemCategory === "nfts" ? userEconomy.portfolio.nfts :
                            itemCategory === "cars" ? userEconomy.inventory.cars :
                                itemCategory === "trucks" ? userEconomy.inventory.trucks :
                                    itemCategory === "groceries" ? userEconomy.inventory.groceries :
                                        itemCategory === "properties" ? userEconomy.inventory.properties :
                                            userEconomy.inventory.computers;

                portfolioCategory.push({ name: item, amount, value: totalPrice });

                await userEconomy.save();

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🛍️ Purchase Successful')
                    .setDescription(`You have successfully purchased **${amount} ${item}(s)** from the **${itemCategory}** category for **${totalPrice}**.`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else if (subcommand === 'leaderboard') {
                const topPlayers = await Economy.aggregate([
                    {
                        $project: {
                            userId: 1,
                            wallet: 1,
                            bank: 1,
                            totalMoney: { $add: ["$wallet", "$bank"] }
                        }
                    },
                    {
                        $sort: { totalMoney: -1 }
                    },
                    { $limit: 10 }
                ]);
            
                if (topPlayers.length === 0) {
                    interaction.editReply({
                        content: '❌ No player data found.',
                    });
                    return;
                }
            
                const leaderboardEmbed = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle('🏆 Top 10 Players - Most Total Money')
                    .setDescription('Here are the top 10 players with the most total earnings (wallet + bank):')
                    .setTimestamp();

                for (let i = 0; i < topPlayers.length; i++) {
                    const player = topPlayers[i];
                    const totalMoney = player.totalMoney;

                    const user = await client.users.fetch(player.userId);
            
                    if (!user) {
                        continue;
                    }
            
                    leaderboardEmbed.addFields({
                        name: `${i + 1}. ${user.username}`,
                        value: `💰 Total Money: ${totalMoney}€ (||Wallet: ${player.wallet}€, Bank: ${player.bank}€||)`,
                        inline: false,
                    });
                }
            
                interaction.editReply({ embeds: [leaderboardEmbed] });
            } else if (subcommand === 'add-money') {
                const targetUser = interaction.options.getUser('user');
                const amount = interaction.options.getInteger('amount');
            
                if (!(interaction.member instanceof GuildMember)) {
                    interaction.editReply({
                        content: '❌ This command only works for members.',
                    });
                    return;
                }
            
                const memberPermissions = interaction.member.permissions;
            
                if (!memberPermissions.has(PermissionsBitField.Flags.ManageEvents)) {
                    interaction.editReply({
                        content: '❌ You do not have permission to execute this command. You need "Manage Roles" permission.',
                    });
                    return;
                }
            
                if (!targetUser || !amount || amount <= 0) {
                    interaction.editReply({
                        content: '❌ Please enter a valid player and amount.',
                    });
                    return;
                }
            
                const playerEconomy = await Economy.findOne({ userId: targetUser.id });
            
                if (!playerEconomy) {
                    const newEconomy = new Economy({
                        identifier: Math.random().toString(36).substring(2, 15),
                        userId: targetUser.id,
                        wallet: 0,
                        bank: amount,
                    });
                    await newEconomy.save();
            
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('💰 Money Added')
                        .setDescription(`**${targetUser.tag}** has received **${amount}** 💰 in the bank.`)
                        .setTimestamp();
            
                    interaction.editReply({ embeds: [embed] });

                    if (!targetUser.bot) {
                        const dmEmbed = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('💰 Money Added')
                            .setDescription(`You have received **${amount}** 💰 in your bank.`)
                            .addFields(
                                { name: 'Current Bank Balance:', value: `${amount} 💰`, inline: true }
                            )
                            .setTimestamp();
            
                        try {
                            await targetUser.send({ embeds: [dmEmbed] });
                        } catch (error) {
                            console.error('Error sending DM:', error);
                        }
                    }
            
                    return;
                }
            
                playerEconomy.bank += amount;
                await playerEconomy.save();
            
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('💰 Money Added')
                    .setDescription(`**${targetUser.tag}** received **${amount}** 💰 in the bank. New balance: **${playerEconomy.bank}** 💰`)
                    .setTimestamp();
            
                interaction.editReply({ embeds: [embed] });

                if (!targetUser.bot) {
                    const dmEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('💰 Money Added')
                        .setDescription(`You have received **${amount}** 💰 in your bank.`)
                        .addFields(
                            { name: 'Current Bank Balance:', value: `${playerEconomy.bank} 💰`, inline: true }
                        )
                        .setTimestamp();
            
                    try {
                        await targetUser.send({ embeds: [dmEmbed] });
                    } catch (error) {
                        console.error('Error sending DM:', error);
                    }
                }
            
                return;
            } else if (subcommand === 'reset-money') {
                const targetUser = interaction.options.getUser('user');
                const resetAll = interaction.options.getBoolean('all');
            
                if (!(interaction.member instanceof GuildMember)) {
                    interaction.editReply({
                        content: '❌ You are not a member of the server.',
                    });
                    return;
                }
            
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    interaction.editReply({
                        content: '❌ You do not have permission to execute this command. You need the "ADMINISTRATOR" permission.',
                    });
                    return;
                }

                if (resetAll) {
                    const allEconomies = await Economy.find();
            
                    if (allEconomies.length === 0) {
                        interaction.editReply({
                            content: '❌ No player data found.',
                        });
                        return;
                    }

                    for (const economy of allEconomies) {
                        economy.wallet = 0;
                        economy.bank = 0;
                        await economy.save();
                    }
            
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('💸 All Money Reset')
                        .setDescription('All players have had their money reset to 0 in both wallet and bank.')
                        .setTimestamp();
            
                    interaction.editReply({ embeds: [embed] });
                } else if (targetUser) {
                    const playerEconomy = await Economy.findOne({ userId: targetUser.id });
            
                    if (!playerEconomy) {
                        interaction.editReply({
                            content: `❌ No economy data found for **${targetUser.tag}**.`,
                        });
                        return;
                    }

                    playerEconomy.wallet = 0;
                    playerEconomy.bank = 0;
                    await playerEconomy.save();
            
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('💸 Money Reset')
                        .setDescription(`The money of **${targetUser.tag}** has been reset to 0 in both wallet and bank.`)
                        .setTimestamp();
            
                    interaction.editReply({ embeds: [embed] });
                } else {
                    interaction.editReply({
                        content: '❌ Please specify either a user or select to reset money for all players.',
                    });
                }
            }
        } catch (error) {
            LogService.error('Error with economy command:', error);
            await interaction.editReply({
                content: '❌ An error occurred. Please try again later.',
            });
        }
    },
};

export default EconomyCommand;
