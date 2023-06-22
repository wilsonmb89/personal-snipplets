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
    port: 4202,
    historyApiFallback: true
  },
  plugins: [
    new Dotenv({
      path: './src/environments/local.env'
    })
  ]
};

module.exports = merge(commonConfig, localConfig);
