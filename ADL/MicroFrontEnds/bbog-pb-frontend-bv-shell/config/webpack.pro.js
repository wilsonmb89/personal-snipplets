const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common');

const proConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../build/container'),
    publicPath: '/container/'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'Shell',
      remotes: {
        legacyApp: 'LegacyApp@https://virtual.bancodebogota.co/bbog-pb-frontend-legacy-app/remoteEntry.js',
        settingsApp: 'SettingsApp@https://virtual.bancodebogota.co/bbog-pb-frontend-settings-app/remoteEntry.js',
        customerAssistanceApp:
          'CustomerAssistanceApp@https://virtual.bancodebogota.co/bbog-pb-customer-assistance-app/remoteEntry.js',
        transfersApp: 'TransfersApp@https://virtual.bancodebogota.co/bbog-pb-frontend-transfers-app/remoteEntry.js',
        authenticationApp:
          'AuthenticationApp@https://virtual.bancodebogota.co/bbog-pb-frontend-authentication-app/remoteEntry.js'
      }
    }),
    new Dotenv({
      path: './src/environments/pro.env'
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        tealium_env: 'prod',
        recaptcha_env: '6Leg_fwUAAAAAEV_HF0HFasCmzcumM82jVkSU90O',
        base_url: 'https://virtual.bancodebogota.co/',
        robot_follow: 'index, follow'
      },
      template: './public/index.ejs'
    })
  ]
};

module.exports = merge(commonConfig, proConfig);
