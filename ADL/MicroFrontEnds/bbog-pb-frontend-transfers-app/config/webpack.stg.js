const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const commonConfig = require('./webpack.common');

const stgConfig = {
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    historyApiFallback: true,
    port: 4204
  },
  plugins: [
    new Dotenv({
      path: './src/environments/stg.env'
    })
  ]
};

module.exports = merge(commonConfig, stgConfig);
