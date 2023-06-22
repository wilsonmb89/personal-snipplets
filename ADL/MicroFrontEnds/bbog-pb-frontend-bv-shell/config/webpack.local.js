const path = require('path');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = require('./webpack.common');

const localConfig = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: '/container/'
  },
  devServer: {
    port: 4200,
    historyApiFallback: {
      index: '/container/index.html'
    },
    headers: {
      'Service-Worker-Allowed': '/'
    },
    compress: true,
    proxy: {
      '/bbog-pb-frontend-legacy-app': {
        target: 'http://localhost:4201',
        pathRewrite: { '^/bbog-pb-frontend-legacy-app': '' },
        changeOrigin: true
      },
      '/bbog-pb-frontend-settings-app': {
        target: 'http://localhost:4202',
        pathRewrite: { '^/bbog-pb-frontend-settings-app': '' },
        changeOrigin: true
      },
      '/bbog-pb-customer-assistance-app': {
        target: 'http://localhost:4203',
        pathRewrite: { '^/bbog-pb-customer-assistance-app': '' },
        changeOrigin: true
      },
      '/bbog-pb-frontend-transfers-app': {
        target: 'http://localhost:4204',
        pathRewrite: { '^/bbog-pb-frontend-transfers-app': '' },
        changeOrigin: true
      },
      '/bbog-pb-frontend-authentication-app': {
        target: 'http://localhost:4205',
        pathRewrite: { '^/bbog-pb-frontend-authentication-app': '' },
        changeOrigin: true
      },
      '/bbog-pb-frontend-legacy-web': {
        target: 'http://localhost:8100',
        pathRewrite: { '^/bbog-pb-frontend-legacy-web': '' },
        changeOrigin: true
      },
      '/build': {
        changeOrigin: true,
        target: 'http://localhost:8100'
      },
      '/assets': {
        changeOrigin: true,
        target: 'http://localhost:8100'
      },
      '/__ion-dev-server': {
        changeOrigin: true,
        target: 'http://localhost:8100'
      },
      '/bv_service-worker.js': {
        changeOrigin: true,
        target: 'http://localhost:8100'
      },
      '/manifest.json': {
        changeOrigin: true,
        target: 'http://localhost:8100'
      }
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'Shell',
      remotes: {
        legacyApp: 'LegacyApp@http://localhost:4200/bbog-pb-frontend-legacy-app/remoteEntry.js',
        settingsApp: 'SettingsApp@http://localhost:4200/bbog-pb-frontend-settings-app/remoteEntry.js',
        customerAssistanceApp:
          'CustomerAssistanceApp@http://localhost:4200/bbog-pb-customer-assistance-app/remoteEntry.js',
        transfersApp: 'TransfersApp@http://localhost:4200/bbog-pb-frontend-transfers-app/remoteEntry.js',
        authenticationApp: 'AuthenticationApp@http://localhost:4200/bbog-pb-frontend-authentication-app/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    }),
    new Dotenv({
      path: './src/environments/local.env'
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        tealium_env: 'dev',
        recaptcha_env: '6Ler_fwUAAAAAM2zBK_y1jFCjwok-xCGySLncLoA',
        base_url: 'http://localhost:4200/',
        robot_follow: 'noindex, nofollow'
      },
      template: './public/index.ejs'
    })
  ]
};

module.exports = merge(commonConfig, localConfig);
