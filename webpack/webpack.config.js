const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const development = require('./webpack.config.dev');
const production = require('./webpack.config.prod');
const PATHS = require('./PATHS');
require('dotenv').config();

const { ENV, URL } = process.env;
const pathsToClean = ['dist'];

const cleanOptions = {
  root: path.resolve(),
  verbose: true,
  dry: false,
};

const common = {
  // entry: PATHS.APP,
  output: {
    path: PATHS.DIST,
    filename: 'app.bundle.[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    modules: ['node_modules', PATHS.SRC],
    extensions: ['.js', '.jsx', '.json', '.scss'],
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.DefinePlugin({
      url: JSON.stringify(URL),
    }),
  ],
  optimization: {
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        default: false,
        react: {
          test: /react/,
          name: 'react',
          minSize: 1,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
        vendor: {
          test: /node_modules\/(?!react)/,
          name: 'vendor',
          minSize: 1,
          minChunks: 2,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/[name].[ext]',
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)/,
        exclude: /(node_modules)/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: 'assets/',
            outputPath: 'assets/',
          },
        },
      },
    ],
  },
};
module.exports = () => {
  const config = merge(common, ENV === 'DEV' ? development : production);
  return config;
};
