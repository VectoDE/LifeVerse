import { Schema, model, Document } from 'mongoose';

export interface ICrypto {
    name: string;
    amount: number;
    value: number;
}

export interface IStock {
    name: string;
    amount: number;
    value: number;
}

export interface INft {
    name: string;
    amount: number;
    value: number;
}

export interface IPortfolio {
    crypto: ICrypto[];
    stocks: IStock[];
    nfts: INft[];
}

export interface ICar {
    name: string;
    amount: number;
    value: number;
}

export interface ITruck {
    name: string;
    amount: number;
    value: number;
}

export interface IGrocery {
    name: string;
    amount: number;
    value: number;
}

export interface IProperty {
    name: string;
    amount: number;
    value: number;
}

export interface IComputer {
    name: string;
    amount: number;
    value: number;
}

export interface IInventory {
    cars: ICar[];
    trucks: ITruck[];
    groceries: IGrocery[];
    properties: IProperty[];
    computers: IComputer[];
}

export interface IEconomy extends Document {
    identifier: string;
    userId: string;
    wallet: number;
    bank: number;
    portfolio: IPortfolio;
    inventory: IInventory;
    lastWorkedAt: Date | null;
    initializePortfolio: () => Promise<void>;
    updatePortfolioValues: () => Promise<void>;
}

const EconomySchema = new Schema<IEconomy>({
    identifier: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 1000 },
    portfolio: {
        crypto: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
        stocks: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
        nfts: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
    },
    inventory: {
        cars: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
        trucks: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
        groceries: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
        properties: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
        computers: [{
            name: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            value: { type: Number, required: true, default: 0 },
        }],
    },
    lastWorkedAt: { type: Date, default: null },
});

EconomySchema.methods.initializePortfolio = async function() {
    const initialCryptoValues: Record<string, number> = {
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
    };

    const initialStockValues: Record<string, number> = {
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
    };

    const initialNftValues: Record<string, number> = {
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
    };

    for (let crypto of this.portfolio.crypto) {
        if (initialCryptoValues[crypto.name]) {
            crypto.value = initialCryptoValues[crypto.name];
        }
    }

    for (let stock of this.portfolio.stocks) {
        if (initialStockValues[stock.name]) {
            stock.value = initialStockValues[stock.name];
        }
    }

    for (let nft of this.portfolio.nfts) {
        if (initialNftValues[nft.name]) {
            nft.value = initialNftValues[nft.name];
        }
    }

    await this.save();
};

EconomySchema.methods.updatePortfolioValues = async function() {
    for (let crypto of this.portfolio.crypto) {
        const fluctuation = (Math.random() - 0.5) * 1000;
        crypto.value += fluctuation;
        crypto.value = Math.max(0, crypto.value);
    }

    for (let stock of this.portfolio.stocks) {
        const fluctuation = (Math.random() - 0.5) * 5;
        stock.value += fluctuation;
        stock.value = Math.max(0, stock.value);
    }

    for (let nft of this.portfolio.nfts) {
        const fluctuation = (Math.random() - 0.5) * 50000;
        nft.value += fluctuation;
        nft.value = Math.max(0, nft.value);
    }

    await this.save();
};

EconomySchema.pre('save', function(next) {
    if (this.isNew && this.bank === undefined) {
        this.bank = 1000;
    }
    next();
});

EconomySchema.pre('save', function(next) {
    if (!this.identifier) {
        this.identifier = Math.random().toString(36).substring(2, 15);
    }
    next();
});

export const Economy = model<IEconomy>('Economy', EconomySchema);
