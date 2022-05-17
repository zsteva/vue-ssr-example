const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = require('./webpack.base.config');

const isProduction = process.env.NODE_ENV === 'production';
const baseDir = path.resolve(__dirname, '..');

var clientConfig = {
    // target: "web",

    // name: "client",

    entry: {
        app: path.join(baseDir, 'src/entry-client.js'),
    },

    optimization: {
        runtimeChunk: {
          // extract webpack runtime & manifest to avoid vendor chunk hash changing
          // on every build.
          name: "manifest",
        },

        // extract vendor chunks for better caching

        splitChunks: {
            chunks: "initial", // all
/*            minSize: 30000,
            maxSize: 0,
            minChunks: 1,

            name: true,*/

            cacheGroups: {
                vendor: {
                   name: "vendor",
                    test(module) { return ( /node_modules/.test(module.context) && !/\.css$/.test(module.request)); },
                },
            },
        },

        // minimizer: isProduction ? [new UglifyJsPlugin()] : [],

    },

    plugins: [
        new webpack.DefinePlugin({
           "process.env.VUE_ENV": '"client"',
           "process.browser": true,
           "process.client": true,
           "process.server": false,
        }),

        new VueSSRClientPlugin(),
    ],
};

module.exports = merge(baseConfig, clientConfig);

