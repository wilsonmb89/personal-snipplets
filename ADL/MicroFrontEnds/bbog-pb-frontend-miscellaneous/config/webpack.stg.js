const Dotenv = require('dotenv-webpack');
const path = require('path');
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common');

const stgConfig = {
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    port: 4206,
    historyApiFallback: true
  },
  plugins: [
    new Dotenv({
      path: './src/environments/stg.env'
    })
  ]
};

module.exports = merge(commonConfig, stgConfig);
