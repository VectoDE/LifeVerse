const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    resolve: {
        fallback: {
            "zlib": require.resolve("browserify-zlib"),
        }
    },
    plugins: [
        new NodePolyfillPlugin()
    ],
};