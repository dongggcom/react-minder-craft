const path = require('path');
const Webpackbar = require('webpackbar');

module.exports = {
    externals: {
        seajs: 'seajs',
    },
    stats: 'errors-only',
    mode: 'production',
    optimization: {
        splitChunks: { chunks: 'all' },
    },
    resolve: {
        modules: [path.join(__dirname, '/node_modules'), 'node_modules'],
        extensions: ['', '.js', '.jsx'],
        fallback: {
            path: false,
            vm: false,
            fs: false,
        },
        alias: {
            '@': path.join(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: ['@babel/plugin-proposal-class-properties'],
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'less-loader', options: { javascriptEnabled: true } },
                ],
            },
        ],
    },
    plugins: [new Webpackbar()],
};
