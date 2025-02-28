import dotenv from 'dotenv';

dotenv.config();

export const config = {
    core: {
        name: String(process.env.NAME),
        version: String(process.env.VERSION),
        repository: String(process.env.REPOSITORY),
        documentation: String(process.env.DOCUMENTATION),
    },
    application: {
        env: String(process.env.ENVIRONMENT || 'development'),
        port: parseInt(process.env.PORT || '3000'),
    },
    database: {
        mongoUri: String(process.env.MONGO_URI),
    },
    discord: {
        clientId: String(process.env.DISCORD_CLIENT_ID),
        clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
        callbackUrl: String(process.env.DISCORD_CALLBACK_URL),
        webhook: {
            logUrl: String(process.env.DISCORD_LOG_WEBHOOK_URL),
        }
    },
    gateways: {
        payment: {
            stripe: String(process.env.STRIPE_SECRET_KEY),
        },
        sms: {
            accountSid: String(process.env.TWILIO_ACCOUNT_SID),
            authToken: String(process.env.TWILIO_AUTH_TOKEN),
            phoneNumber: String(process.env.TWILIO_PHONE_NUMBER),
        },
    }
}