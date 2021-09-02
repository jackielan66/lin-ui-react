const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.jsx',
    output: {
        filename: 'l-react-ui.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // 模块解析额外配置
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'src/components/'),
        },
        extensions: ['.jsx', '.js'],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
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
        new HtmlWebpackPlugin({
            title: '测试',
            template: 'public/index.html',
        }),
    ],
};
