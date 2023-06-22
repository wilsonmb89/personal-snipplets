const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const commonConfig = require('./webpack.common');

const stgConfig = {
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    port: 4201
  },
  plugins: [
    new Dotenv({
      path: './src/environments/stg.env'
    })
  ]
};

module.exports = merge(commonConfig, stgConfig);
