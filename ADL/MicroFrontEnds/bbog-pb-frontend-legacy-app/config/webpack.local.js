const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const commonConfig = require('./webpack.common');

const devConfig = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    port: 4201
  },
  plugins: [
    new Dotenv({
      path: './src/environments/local.env'
    })
  ]
};

module.exports = merge(commonConfig, devConfig);
