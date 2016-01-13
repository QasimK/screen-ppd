var CleanWebpackPlugin = require('clean-webpack-plugin')
// var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?indentedSyntax&sourceMap'),
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[hash:6].[ext]',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                loader: 'url-loader?limit=10000&name=images/[name].[hash:6].[ext]',
            },

        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        // new CopyWebpackPlugin([
        //     {
        //         from: './src/index.html',
        //         to: './dist/index.html'
        //     }
        // ]),
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html',
          inject: 'body',
          hash: true,
        }),
    ],
}
