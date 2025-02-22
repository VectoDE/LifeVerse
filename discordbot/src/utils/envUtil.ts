import dotenv from 'dotenv';

dotenv.config();

export class EnvUtil {
    private static cachedEnv: Record<string, string> = {};

    public static loadEnvFile(): void {
        dotenv.config();
    }

    public static getEnvVar(name: string, defaultValue?: string): string {
        if (this.cachedEnv[name]) return this.cachedEnv[name];

        const value = process.env[name] || defaultValue;
        if (value === undefined) {
            throw new Error(`Missing environment variable: ${name}`);
        }

        this.cachedEnv[name] = value;
        return value;
    }

    public static loadEnvVariables(keys: string[]): Record<string, string> {
        return keys.reduce(
            (envVars, key) => {
                envVars[key] = this.getEnvVar(key);
                return envVars;
            },
            {} as Record<string, string>,
        );
    }
}
