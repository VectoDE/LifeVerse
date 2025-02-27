import morgan from 'morgan';

export const loggerMiddleware = (format: string = 'combined') => {
    return morgan(format);
};
