// 生产库

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './src/components/index.js',
    output: {
        filename: 'l-react-ui.js',
        path: path.resolve(__dirname, 'dist'),
        library:'l-react-ui',
        libraryTarget:'umd'
    },
    // 模块解析额外配置
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'src/components/'),
        },
        extensions: ['.jsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(svg|jpg|gif)$/,
                exclude: [
                    path.resolve(__dirname, 'src/components/Icon/svg'),
                ],
                loader: 'file-loader',
            },
            {
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, 'src/components/Icon/svg'),
                ],
                use: [
                    {
                        loader: 'svg-sprite-loader',
                    },
                ],
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ['@babel/preset-react']],
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};
