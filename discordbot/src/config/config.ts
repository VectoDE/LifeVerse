import { EnvUtil } from '../utils/envUtil';

EnvUtil.loadEnvFile();

export const config = {
    application: {
        TOKEN: EnvUtil.getEnvVar('TOKEN'),
        CLIENT_ID: EnvUtil.getEnvVar('CLIENT_ID'),
        TEST_GUILD_ID: EnvUtil.getEnvVar('TEST_GUILD_ID'),
    },
    database: {
        MONGO_URI: EnvUtil.getEnvVar('MONGO_URI'),
    },
    channels: {
        START_MESSAGE_CHANNEL_ID: EnvUtil.getEnvVar('START_MESSAGE_CHANNEL_ID'),
    },
    apiRequests: {
        WEBSITE: EnvUtil.getEnvVar('REQUEST_WEBSITE'),
        API: EnvUtil.getEnvVar('REQUEST_API'),
        GAME_SERVERS: EnvUtil.getEnvVar('REQUEST_GAME_SERVERS'),
    }
};
