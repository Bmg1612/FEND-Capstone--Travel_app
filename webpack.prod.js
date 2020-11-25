const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/client/index.js',
    devtool: 'source-map',
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],

    },
    // output: {
    //     libraryTarget: 'var',
    //     library: 'Client',
    // },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }), 
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
            sourcemap: true,
            //Was not founding the files because there whas an 'auto' before them
            // modifyURLPrefix: {
            //     'auto./': '',
            //     'auto':''
            // },
            // inlineWorkboxRuntime: true   
        }),
    ]
}

