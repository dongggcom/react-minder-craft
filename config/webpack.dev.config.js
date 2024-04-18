const path = require('path');
const notifier = require('node-notifier');
const webpackCommonConfig = require('./webpack.common.config');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const PORT = 8081;

module.exports = merge(webpackCommonConfig, {
    entry: {
        index: path.resolve(__dirname, '../example/index.js'),
    },
    mode: 'development',
    devtool: 'eval',
    devServer: {
        overlay: true,
        quiet: true,
        contentBase: '../dist',
        port: PORT,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../example/index.html'),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`Running here http://localhost:${PORT}`],
            },
            onError: (severity, errors) => {
                if (severity !== 'error') {
                    return;
                }
                const error = errors[0];
                notifier.notify({
                    title: 'Webpack error',
                    message: severity + ': ' + error.name,
                    subtitle: error.file || '',
                });
            },
            clearConsole: true,
        }),
    ],
});
