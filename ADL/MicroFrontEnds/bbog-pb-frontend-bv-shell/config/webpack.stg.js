const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common');

const stgConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../build/container'),
    publicPath: '/container/'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'Shell',
      remotes: {
        legacyApp: 'LegacyApp@https://virtual-staging.bancodebogota.co/bbog-pb-frontend-legacy-app/remoteEntry.js',
        settingsApp:
          'SettingsApp@https://virtual-staging.bancodebogota.co/bbog-pb-frontend-settings-app/remoteEntry.js',
        customerAssistanceApp:
          'CustomerAssistanceApp@https://virtual-staging.bancodebogota.co/bbog-pb-customer-assistance-app/remoteEntry.js',
        transfersApp:
          'TransfersApp@https://virtual-staging.bancodebogota.co/bbog-pb-frontend-transfers-app/remoteEntry.js',
        authenticationApp:
          'AuthenticationApp@https://virtual-staging.bancodebogota.co/bbog-pb-frontend-authentication-app/remoteEntry.js'
      }
    }),
    new Dotenv({
      path: './src/environments/stg.env'
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        tealium_env: 'qa',
        recaptcha_env: '6Ler_fwUAAAAAM2zBK_y1jFCjwok-xCGySLncLoA',
        base_url: 'https://virtual-staging.bancodebogota.co/',
        robot_follow: 'noindex, nofollow'
      },
      template: './public/index.ejs'
    })
  ]
};

module.exports = merge(commonConfig, stgConfig);
