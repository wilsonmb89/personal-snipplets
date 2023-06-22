const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const commonConfig = require('./webpack.common');

const localConfig = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    publicPath: '/',
    compress: true,
    port: 4204,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  plugins: [
    new Dotenv({
      path: './src/environments/local.env'
    })
  ]
};

module.exports = merge(commonConfig, localConfig);
