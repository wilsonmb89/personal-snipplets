const Dotenv = require('dotenv-webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common');

const stgConfig = {
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    historyApiFallback: true,
    port: 4205
  },
  plugins: [
    new Dotenv({
      path: './src/environments/stg.env'
    })
  ]
};

module.exports = merge(commonConfig, stgConfig);
