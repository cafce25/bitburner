/**
 * Webpack configuration for building unit tests
 */
var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConfig = require('./webpack.config.js');

module.exports = (env, argv) => {
    let bConf = baseConfig(env, argv);

    bConf.entry = "./test/index.ts";

    bConf.output= {
        path: path.resolve(__dirname, "./dist-test"),
        filename: "test.bundle.js",
    };

    for (let i in bConf.module.rules) {
        const rule = bConf.module.rules[i];
        if (rule.test.test("test.css") || rule.test.test("test.scss")) {
            delete rule.use;
            rule.loader = "null-loader";
        }
    }

    bConf.module.rules.unshift({
        test: /\.(js|ts)x?/,
        loader: 'istanbul-instrumenter-loader',
        exclude: /node_modules/,
        query: {
            esModules: true
        }
    });

    bConf.optimization = {
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
                    name: `dist-test/vendor`,
                    chunks: 'all'
                }
            }
        }
    };

    return bConf;
};
