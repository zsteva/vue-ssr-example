
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const baseConfig = require('./webpack.base.config');
const baseDir = path.resolve(__dirname, '..');

var serverConfig = {
    entry: path.join(baseDir, 'src/entry-server.js'),

    name: 'server',

    target: 'node',

    devtool: '#source-map',

    output: {
        path: path.join(baseDir, 'dist'),
        publicPath: "/dist/",
        libraryTarget: 'commonjs2',
    },

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // Externalize app dependencies. This makes the server build much faster
    // and generates a smaller bundle file.
    externals: webpackNodeExternals({
        // do not externalize dependencies that need to be processed by webpack.
        // you can add more file types here e.g. raw *.vue files
        // you should also whitelist deps that modifies `global` (e.g. polyfills)
        whitelist: [/\.css$/, /\?vue&type=style/],
    }),

    plugins: [
        new webpack.DefinePlugin({
            "process.env.VUE_ENV": '"server"',
            "process.browser": false,
            "process.client": false,
            "process.server": true,
        }),

        new VueSSRServerPlugin(),
    ]
};

module.exports = merge(baseConfig, serverConfig);

