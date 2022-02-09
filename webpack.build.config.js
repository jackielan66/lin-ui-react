// 生产库

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/components/index',
    output: {
        filename: 'l-react-ui.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'lReactUi',
        libraryTarget: 'umd',
    },
    // 模块解析额外配置
    resolve: {
        alias: {
            '@Components': path.resolve(__dirname, 'src/components/'),
        },
        extensions: ['.jsx', '.js', '.ts', '.tsx'],
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
                test: /\.css$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'],
            },
            {
                test: /\.less$/,
                loader: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'less-loader'],
            },
            {
                test: /(\.tsx|\.ts)$/,
                loader: 'ts-loader',
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
        new MiniCssExtractPlugin({
            filename: '/css/cim-library.css',
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // test: /\.js(\?.*)?$/i,
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                        booleans: false,
                        drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
                        pure_funcs: ['console.log', 'console.info', 'console.debug'],
                        collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                        reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
                    },
                    mangle: {
                        safari10: true,
                    },
                    // Added for profiling in devtools
                    keep_classnames: false,
                    keep_fnames: false,
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: false,
                    },
                },
                sourceMap: false,
            }),
        ],
        // splitChunks: {
        //     chunks: 'all',
        //     name: false,
        // },
    },
};
