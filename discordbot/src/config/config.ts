import { EnvUtil } from '../utils/envUtil';

EnvUtil.loadEnvFile();

export const config = {
    application: {
        TOKEN: String(EnvUtil.getEnvVar('TOKEN') || ''),
        CLIENT_ID: String(EnvUtil.getEnvVar('CLIENT_ID') || ''),
        TEST_GUILD_ID: String(EnvUtil.getEnvVar('TEST_GUILD_ID') || ''),
    },
    database: {
        MONGO_URI: String(EnvUtil.getEnvVar('MONGO_URI')),
    },
    channels: {
        START_MESSAGE_CHANNEL_ID: String(EnvUtil.getEnvVar('LOG_CHANNEL_ID')),
    },
    webhooks: {
        logWebhook: {
            id: String(EnvUtil.getEnvVar('LOG_WEBHOOK_ID')),
            token: String(EnvUtil.getEnvVar('LOG_WEBHOOK_TOKEN')),
        },
    },
    apiRequests: {
        WEBSITE: String(EnvUtil.getEnvVar('REQUEST_WEBSITE')),
        API: String(EnvUtil.getEnvVar('REQUEST_API')),
        GAME_SERVERS: String(EnvUtil.getEnvVar('REQUEST_GAME_SERVERS')),
    }
};
