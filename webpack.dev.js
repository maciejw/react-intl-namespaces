const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
  entry: {
    bundle: ['./integration/index.tsx'],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {},
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.ts(x?)$/,
        use: ['awesome-typescript-loader'],
        exclude: [/\.test\.ts(x?)$/, /dist\/.*\.d\.ts$/],
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('postcss-cssnext'), require('postcss-import')];
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
});
