/**
 * Webpack configuration for building unit tests
 */
var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const statsConfig = {
        builtAt: true,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        entrypoints: true,
    }

    return {
        mode: "development",
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': "\"development\""
            }),
            new webpack.ProvidePlugin({
                // Automtically detect jQuery and $ as free var in modules
                // and inject the jquery library
                // This is required by many jquery plugins
                // http://stackoverflow.com/questions/29080148/expose-jquery-to-real-window-object-with-webpack
                jquery: "jquery",
                jQuery: "jquery",
                $: "jquery"
            }),
        ],
        entry: "./test/index.ts",
        target: "web",
        devtool: "source-map",
        output: {
            path: path.resolve(__dirname, "./"),
            filename: "test/test.bundle.js",
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?/,
                    loader: 'istanbul-instrumenter-loader',
                    exclude: /node_modules/,
                    query: {
                        esModules: true
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(jsx)$/,
                    exclude: /node_modules/,
                    use: {
                      loader: "babel-loader"
                    }
                },
                {
                    test: /\.s?css$/,
                    loader: 'null-loader',
                }
            ]
        },
        optimization: {
            removeAvailableModules: true,
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,
            flagIncludedChunks: true,
            sideEffects: true,
            providedExports: true,
            usedExports: true,
            concatenateModules: false,
            moduleIds: false,
            chunkIds: false,
            minimize: false,
            portableRecords: true,
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: `tests/vendor`,
                        chunks: 'all'
                    }
                }
            }
        },
        resolve: {
            extensions: [
                ".tsx",
                ".ts",
                ".js",
                ".jsx",
            ],
            alias: {
                'fs' : 'memfs'
            }
        },
        stats: statsConfig,
    };
};
