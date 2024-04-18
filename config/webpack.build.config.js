const path = require('path');
const webpackCommonConfig = require('./webpack.common.config');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {merge} = require('webpack-merge');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = merge(webpackCommonConfig, {
    entry: {
        index: path.resolve(__dirname, '../example/index.js'),
    },
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:8].async.js',
    },
    mode: 'production',
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../example/index.html'),
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: resolve('public'),
            to: 'public',
        }]),
    ],
});
