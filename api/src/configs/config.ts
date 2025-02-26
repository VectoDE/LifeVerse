import dotenv from 'dotenv';

dotenv.config();

export const config = {
    core: {
        name: String(process.env.APP_NAME),
        version: String(process.env.VERSION),
        repository: String(process.env.REPOSITORY),
    },
    application: {
        env: String(process.env.NODE_ENV || 'development'),
        port: parseInt(process.env.PORT || '3000'),
    },
    database: {
        mongoUri: String(process.env.MONGO_URI),
    },
    discord: {
        clientId: String(process.env.DISCORD_CLIENT_ID),
        clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
        callbackUrl: String(process.env.DISCORD_CALLBACK_URL),
    }
}