export class LogService {
    /**
     * Logs an info message to the console.
     * @param message - The log message.
     * @param title - The title for the log (default is "Info Log").
     * @param fields - Optional fields to be added to the log.
     */
    public info(message: string, title: string = 'Info Log', fields: { name: string, value: string }[] = []): void {
        this.logToConsole('info', message, title, fields);
    }

    /**
     * Logs a warning message to the console.
     * @param message - The log message.
     * @param title - The title for the log (default is "Warning Log").
     * @param fields - Optional fields to be added to the log.
     */
    public warn(message: string, title: string = 'Warning Log', fields: { name: string, value: string }[] = []): void {
        this.logToConsole('warn', message, title, fields);
    }

    /**
     * Logs an error message to the console.
     * @param message - The log message.
     * @param title - The title for the log (default is "Error Log").
     * @param fields - Optional fields to be added to the log.
     */
    public error(message: string, title: string = 'Error Log', fields: { name: string, value: string }[] = []): void {
        this.logToConsole('error', message, title, fields);
    }

    /**
     * Logs the message to the console based on the log type.
     * @param logType - The type of the log (info, warn, error).
     * @param message - The log message.
     * @param title - The title for the log.
     * @param fields - Optional fields to be added to the log.
     */
    private logToConsole(logType: string, message: string, title: string, fields: { name: string, value: string }[]): void {
        let logMessage = `[${title}] ${message}`;

        if (fields.length > 0) {
            fields.forEach(field => {
                logMessage += `\n${field.name}: ${field.value}`;
            });
        }

        if (logType === 'info') {
            console.log(`[INFO]: ${logMessage}`);
        } else if (logType === 'warn') {
            console.warn(`[WARNING]: ${logMessage}`);
        } else if (logType === 'error') {
            console.error(`[ERROR]: ${logMessage}`);
        }
    }
}