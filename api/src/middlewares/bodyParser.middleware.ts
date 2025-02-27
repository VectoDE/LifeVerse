import express from 'express';

export const bodyParserMiddleware = (options: express.RequestHandler = express.urlencoded({ extended: true })) => {
    return [
        express.json(),
        options
    ];
};
