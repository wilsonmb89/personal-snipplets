const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common');

const proConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new Dotenv({
      path: './src/environments/pro.env'
    })
  ]
};

module.exports = merge(commonConfig, proConfig);
