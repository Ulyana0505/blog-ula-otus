const path = require('path')
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin')

module.exports = {
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(css|scss)$/i,
                use: ['css-loader', 'sass-loader'],
            },
            {
                test: /\.(ico|png|jp?g|svg)/,
                type: 'asset',
                generator: {
                    filename: 'img/[name].[hash:8][ext]', // save to file images >= 2 KB
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 2 * 1024, // inline images < 2 KB
                    },
                },
            },
        ],
    },
    performance: {
        maxAssetSize: 1024 * 1024 * 3,
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: 'src/views/',
            css: {
                filename: 'css/[name].[contenthash:8].css',
            },
            js: {
                filename: 'js/[name].[contenthash:8].js',
            },
        }),
    ],
}
