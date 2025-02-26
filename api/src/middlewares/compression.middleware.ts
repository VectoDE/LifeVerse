import compression from 'compression';

export const compressionMiddleware = () => {
    return compression();
};
