const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: {
        main: ['./src/client/main.jsx', './src/client/main.scss', 'webpack-hot-middleware/client'],
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].js',
        publicPath: '/assets'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
              test: /\.(js)|(jsx)$/,
              exclude: /node_modules/,
              use: [{
                  loader: "babel-loader"
              },{
                loader: "eslint-loader",
                options: {
                  fix: true
                }
              }]
            },
            {
              test: /\.(png|jpe?g|gif)$/i,
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                //emitFile: false,
                publicPath: '/assets/'
              },
            },
            {
              test: /\.s[ac]ss$/i,
              use: [
                // Creates `style` nodes from JS strings
                'style-loader',
                // Translates CSS into CommonJS
                'css-loader',
                // Compiles Sass to CSS
                'sass-loader',
              ],
            },
        ],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'all'
                },
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2
                },
                default: {
                    name: 'main',
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        //new HtmlWebpackPlugin(),
            new webpack.LoaderOptionsPlugin({
                // test: /\.xxx$/, // may apply this only for some modules
                options: {
                    external: ['react', 'react-dom', 'react-router', 'react-router-dom']
                }
            }),
            new webpack.HotModuleReplacementPlugin({
                // Options...
            })
        ]
};
