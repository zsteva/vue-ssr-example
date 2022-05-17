const fs = require('fs');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseDir = path.join(__dirname, '..');
const srcPath = path.join(__dirname, '../src');
const isProduction = process.env.NODE_ENV === 'production';
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const publicPath = '/dist/';

// enbale faster restart (webpack rebuild) but little bit buggy...
const enableHardSourceWebpackPlugin = false;

const sassResourcesLoader = {
    loader: 'sass-resources-loader',
    options: {
    }
};

let plugins = [
    new VueLoaderPlugin(),
    new CaseSensitivePathsPlugin(),
        // new HtmlWebpackPlugin(),
        /*
         new MiniCssExtractPlugin({
             filename: '[name].[contenthash].css',
         }),
         */
];


if (!isProduction) {
    plugins.push(new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [
                    "Your application is running here http://localhost:8080",
                ],
            },
        }));
}

if (enableHardSourceWebpackPlugin) {
	plugins.push(new HardSourceWebpackPlugin());
}

module.exports = {

    mode: process.env.NODE_ENV || 'development',

    //devtool: isProduction ? 'source-map' : 'eval-source-map',
    //devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    // devtool: isProduction ? false : '#source-map',

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@': srcPath,
        }
    },

    output: {
        path: path.join(baseDir, 'dist'),
        publicPath: publicPath, // "/dist/",
        filename: "js/[name].[chunkhash].js",
        chunkFilename: "js/[name].[chunkhash].js",
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [ srcPath ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [ srcPath ],
                // exclude: /node_modules/,
            },          
            {
                test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 4096,
                    esModule: false,
                    fallback: {
                        loader: "file-loader",
                        options: {
                            publicPath: publicPath,
                            name: "img/[name].[hash:8].[ext]",
                        },
                    },
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 4096,
                    esModule: false,
                    fallback: {
                        loader: "file-loader",
                        options: {
                            publicPath: publicPath,
                            name: "fonts/[name].[hash:8].[ext]",
                        },
                    },
                },
            },
            {
                test: /\.(css|scss)$/,
                use: [
                  "vue-style-loader",
                  {
                    loader: "css-loader",
                    options: {
                      sourceMap: true,
                      importLoaders: 3,
                    },
                  },
                  // { loader: "url-loader" },
                  /*
                  {
                    loader: "postcss-loader",
                    options: { sourceMap: true },
                  },
                  */
                  {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true,
                        additionalData: '$distPath: "./assets/";'
                    }
                  },
                  // sassResourcesLoader,
                ],
            },

        ]
    },

    plugins: plugins,
};


